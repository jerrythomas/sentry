import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { sentry } from '../src/sentry.js'
import fetchMock from 'fetch-mock'
import { adapter, ERROR_EMAIL } from './mock/adapter.js'

const VALID_EMAIL = 'john@doe@example.com'

const SentrySuite = suite('Sentry wrapper for auth')

SentrySuite.before(async (context) => {
	global.window = { location: { href: '', pathname: '/' } }

	context.providers = [
		{ provider: 'magic' },
		{ provider: 'google', scopes: ['email'], params: [] }
	]
	context.adapter = adapter
})

SentrySuite('Should handle sign in with magic link', async (context) => {
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
	sentry.init({ adapter: context.adapter })
	assert.equal(context.adapter.calls(), [{ function: 'user', user: {} }])
	assert.equal(sentry.routes(), { authUrl: '/auth/signin', loginUrl: '/auth' })

	context.adapter.clearCalls()
	unsubscribe()

	data.map(async ({ mode, email, provider }) => {
		calls.push({
			function: 'signIn',
			credentials: { email },
			options: {
				redirectTo: 'http://localhost:3000/auth',
				scopes: '',
				params: []
			}
		})
		const params = new URLSearchParams({ email, provider })
		const result = await sentry.handleSignIn({
			query: mode === 'query' ? params : new URLSearchParams({}),
			body: mode !== 'query' ? params : new URLSearchParams({}),
			headers: { origin: 'http://localhost:3000' }
		})
		if (email === VALID_EMAIL) {
			assert.not(result.error)
		} else {
			assert.is.not(result.error)
		}
		assert.equal(result.email, email)
		assert.equal(result.provider, provider)
	})
	assert.equal(context.adapter.calls(), calls)

	context.adapter.clearCalls()
})

SentrySuite('Should handle other sign in methods', async (context) => {
	const data = [
		{ mode: 'query', provider: 'google' },
		{ mode: 'body', provider: 'google' }
	]
	let calls = []
	let count = 0
	let unsubscribe = sentry.subscribe((data) => {
		if (count === 1) assert.equal(data.user, {})
		count++
	})
	sentry.init({
		adapter: context.adapter,
		providers: context.providers
	})
	assert.equal(context.adapter.calls(), [{ function: 'user', user: {} }])
	context.adapter.clearCalls()
	unsubscribe()

	data.map(async ({ mode, email, provider }) => {
		calls.push({
			function: 'signIn',
			credentials: { provider },
			options: {
				redirectTo: 'http://localhost:3000/auth',
				scopes: context.providers
					.filter((d) => d.provider === 'google')[0]
					.scopes.join(' '),
				params: []
			}
		})

		const params = new URLSearchParams({ email, provider })
		const result = await sentry.handleSignIn({
			query: mode === 'query' ? params : new URLSearchParams({}),
			body: mode !== 'query' ? params : new URLSearchParams({}),
			headers: { origin: 'http://localhost:3000' }
		})
		assert.is.not(result.email)
		assert.equal(result.provider, provider)
	})

	assert.equal(context.adapter.calls(), calls)
	context.adapter.clearCalls()
})

SentrySuite('Should fail when provider is not configured', async (context) => {
	const data = [{ mode: 'query', provider: 'unknown' }]
	let count = 0
	let unsubscribe = sentry.subscribe((data) => {
		if (count === 1) assert.equal(data.user, {})
		count++
	})
	sentry.init({ adapter: context.adapter })
	assert.equal(context.adapter.calls(), [{ function: 'user', user: {} }])
	context.adapter.clearCalls()
	unsubscribe()

	data.map(async ({ mode, email, provider }) => {
		const params = new URLSearchParams({ email, provider })
		const result = await sentry.handleSignIn({
			query: mode === 'query' ? params : new URLSearchParams({}),
			body: mode !== 'query' ? params : new URLSearchParams({}),
			headers: { origin: 'http://localhost:3000' }
		})
		assert.equal(result.error, 'Provider has not been configured.')
		assert.is.not(result.email)
		assert.equal(result.provider, provider)
	})

	assert.equal(context.adapter.calls(), [])
})

SentrySuite('Should handle auth change', async (context) => {
	let count = 0

	await sentry.handleAuthChange()

	let unsubscribe = sentry.subscribe((data) => {
		if (count === 1)
			assert.equal(data.user, {
				id: '123',
				email: VALID_EMAIL,
				role: 'authenticated'
			})
		count++
	})
	fetchMock.mock('/auth/session', 200)
	await context.adapter.authStateCallback('SIGNED_IN', {
		user: { id: '123', email: VALID_EMAIL, role: 'authenticated' }
	})

	unsubscribe()
	assert.equal(window.location.pathname, '/')
	const [endpoint, params] = fetchMock.lastCall()
	assert.equal(endpoint, '/auth/session')
	assert.equal(params, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'same-origin',
		body: `{"event":"SIGNED_IN","session":{"user":{"id":"123","email":"${VALID_EMAIL}","role":"authenticated"}}}`
	})

	fetchMock.restore()
})

SentrySuite('Should handle sign out', async (context) => {
	let count = 0
	let unsubscribe = sentry.subscribe((data) => {
		if (count === 0)
			assert.equal(data.user, {
				id: '123',
				email: VALID_EMAIL,
				role: 'authenticated'
			})
		else assert.equal(data.user, {})

		count++
	})
	// sentry.init({ adapter: context.adapter })
	context.adapter.clearCalls()

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

	fetchMock.restore()
	count = 0
	assert.equal(window.location.pathname, '/auth')
	assert.equal(context.adapter.calls(), [{ function: 'signOut', user: {} }])
	context.adapter.clearCalls()
})

SentrySuite('Should protect route', async (context) => {
	// before auth
	let result = sentry.protect('/')
	assert.equal(result, { status: 302, headers: { location: '/auth' } })
	result = sentry.protect('/auth')
	assert.equal(result, {})

	// after auth
	result = sentry.protect('/auth', { role: 'authenticated' })
	assert.equal(result, { status: 302, headers: { location: '/' } })
	result = sentry.protect('/', { role: 'authenticated' }, { placeholder: true })
	assert.equal(result, { placeholder: true })
})

SentrySuite.run()
