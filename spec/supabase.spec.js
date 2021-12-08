import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { sentry } from '../src/supabase.js'
import fetchMock from 'fetch-mock'

const SupabaseSuite = suite('Sentry for Supabase')

const ERROR_EMAIL = 'rate@limit.error'
const VALID_EMAIL = 'john@doe@example.com'

SupabaseSuite.before(async (context) => {
	global.window = { location: { href: '' } }

	context.calls = []
	context.user = {}

	context.supabase = {
		auth: {
			user: () => {
				context.calls.push({ function: 'user', user: context.user })
				return context.user
			},
			signIn: async (input, options) => {
				context.calls.push({ function: 'signIn', input, options })
				if (input.email === ERROR_EMAIL) {
					return { error: 'Rate limit error' }
				} else {
					return { error: null }
				}
			},
			signOut: async () => {
				context.user = {}
				context.calls.push({ function: 'signOut', user: context.user })
				await context.authStateCallback('SIGNED_OUT', null)
			},
			onAuthStateChange: (cb) => {
				context.authStateCallback = cb
			}
		}
	}
})

SupabaseSuite('Should handle sign in with magic link', async (context) => {
	const data = [
		{ mode: 'query', email: VALID_EMAIL, provider: 'magic' },
		{ mode: 'query', email: ERROR_EMAIL, provider: 'magic' },
		{ mode: 'body', email: VALID_EMAIL, provider: 'magic' },
		{ mode: 'body', email: ERROR_EMAIL, provider: 'magic' }
	]
	let calls = []
	let count = 0
	let unsubscribe = sentry.subscribe((data) => {
		if (count === 1) assert.equal(data.user, {})
		count++
	})
	sentry.init({ supabase: context.supabase })
	assert.equal(context.calls, [{ function: 'user', user: {} }])
	context.calls = []
	unsubscribe()

	data.map(async ({ mode, email, provider }) => {
		calls.push({
			function: 'signIn',
			input: { email },
			options: { redirectTo: 'http://localhost:3000/login' }
		})
		const params = new URLSearchParams({ email, provider })
		const { error } = await sentry.handleSignIn({
			query: mode === 'query' ? params : new URLSearchParams({}),
			body: mode !== 'query' ? params : new URLSearchParams({}),
			headers: { origin: 'http://localhost:3000' }
		})
		if (email === VALID_EMAIL) {
			assert.not(error)
		} else {
			assert.is.not(error)
		}
	})
	assert.equal(calls, context.calls)
	context.calls = []
})

SupabaseSuite('Should handle other sign in methods', async (context) => {
	const data = [
		{ mode: 'query', email: VALID_EMAIL, provider: 'other' },
		{ mode: 'query', email: ERROR_EMAIL, provider: 'other' },
		{ mode: 'body', email: VALID_EMAIL, provider: 'other' },
		{ mode: 'body', email: ERROR_EMAIL, provider: 'other' }
	]
	// let calls = []
	let count = 0
	let unsubscribe = sentry.subscribe((data) => {
		if (count === 1) assert.equal(data.user, {})
		count++
	})
	sentry.init({ supabase: context.supabase })
	assert.equal(context.calls, [{ function: 'user', user: {} }])
	context.calls = []
	unsubscribe()

	data.map(async ({ mode, email, provider }) => {
		// calls.push({
		// 	function: 'signIn',
		// 	input: { email },
		// 	options: { redirectTo: 'http://localhost:3000/login' }
		// })
		const params = new URLSearchParams({ email, provider })
		const result = await sentry.handleSignIn({
			query: mode === 'query' ? params : new URLSearchParams({}),
			body: mode !== 'query' ? params : new URLSearchParams({}),
			headers: { origin: 'http://localhost:3000' }
		})
		assert.equal(result, 'not supported yet')
	})
	// assert.equal(calls, context.calls)
	context.calls = []
})

SupabaseSuite('Should handle auth change', async (context) => {
	let count = 0

	await sentry.handleAuthChange()

	let unsubscribe = sentry.subscribe((data) => {
		if (count === 1) assert.equal(data.user, { id: '123', email: VALID_EMAIL })
		count++
	})
	fetchMock.mock('/auth/session', 200)
	await context.authStateCallback('SIGNED_IN', {
		user: { id: '123', email: VALID_EMAIL }
	})

	unsubscribe()
	const [endpoint, params] = fetchMock.lastCall()
	assert.equal(endpoint, '/auth/session')
	assert.equal(params, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'same-origin',
		body: `{"event":"SIGNED_IN","session":{"user":{"id":"123","email":"${VALID_EMAIL}"}}}`
	})

	fetchMock.restore()
})

SupabaseSuite('Should handle sign out', async (context) => {
	let count = 0
	let unsubscribe = sentry.subscribe((data) => {
		if (count === 0) assert.equal(data.user, { id: '123', email: VALID_EMAIL })
		else assert.equal(data.user, {})

		count++
	})
	// sentry.init({ supabase: context.supabase })
	context.calls = []

	fetchMock.mock('/auth/session', 200)
	await sentry.handleSignOut()
	unsubscribe()
	const [endpoint, params, _] = fetchMock.lastCall()
	assert.equal(endpoint, '/auth/session')
	assert.equal(params, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'same-origin',
		body: '{}'
	})
	// console.log('sign out', endpoint, params)
	fetchMock.restore()
	count = 0
	assert.equal(window.location.href, '/login')
	assert.equal(context.calls, [{ function: 'signOut', user: {} }])
	context.calls = []
})

SupabaseSuite('Should protect route', async (context) => {
	// before auth
	let result = sentry.protect('/')
	assert.equal(result, { status: 302, headers: { location: '/login' } })
	result = sentry.protect('/login')
	assert.equal(result, {})

	// after auth
	result = sentry.protect('/login', { role: 'authenticated' })
	assert.equal(result, { status: 302, headers: { location: '/' } })
	result = sentry.protect('/', { role: 'authenticated' }, { placeholder: true })
	assert.equal(result, { placeholder: true })
})

SupabaseSuite.run()
