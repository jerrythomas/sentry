import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { sentry } from '../src/supabase.js'
import xhr from 'xhr2'
import { mockServer } from './server.mock.js'

const SupabaseSuite = suite('Sentry for Supabase')

const ERROR_EMAIL = 'rate@limit.error'
const VALID_EMAIL = 'john@doe@example.com'

SupabaseSuite.before(async (context) => {
	global.window = { location: { href: '' } }
	global.XMLHttpRequest = xhr

	context.calls = []
	context.user = {}
	// stubbed supabase client instance
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
			options: { redirectTo: 'http://localhost:3000' }
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
		// calls.push({
		// 	function: 'signIn',
		// 	input: { email },
		// 	options: { redirectTo: 'http://localhost:3000' }
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

	await context.authStateCallback('SIGNED_IN', {
		user: { id: '123', email: VALID_EMAIL }
	})

	unsubscribe()
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

	await sentry.handleSignOut()
	unsubscribe()
	count = 0
	assert.equal(window.location.href, '/login')
	assert.equal(context.calls, [{ function: 'signOut', user: {} }])
	context.calls = []
})

SupabaseSuite('Should protect route', async (context) => {
	let result = sentry.protect('/')
	assert.equal(result, { status: 302, redirect: '/login' })
	result = sentry.protect('/login')
	assert.equal(result, {})
})

SupabaseSuite.run()
