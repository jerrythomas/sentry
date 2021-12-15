import fs from 'fs'
import yaml from 'js-yaml'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { sentry } from '../src/sentry.js'
import fetchMock from 'fetch-mock'
import { adapter } from './mock/adapter.js'

const VALID_EMAIL = 'john@doe@example.com'

const SentrySuite = suite('Sentry wrapper for auth')

SentrySuite.before(async (context) => {
	global.window = { location: { href: '', pathname: '/' } }
	try {
		context.authProviders = yaml.load(
			fs.readFileSync('spec/fixtures/providers.yaml', 'utf8')
		)
	} catch (err) {
		console.error(err)
	}

	context.providers = [
		{ provider: 'magic' },
		{ provider: 'google', scopes: ['email'], params: [] }
	]
	context.adapter = adapter
})

SentrySuite('Should handle different providers', async (context) => {
	let calls = []
	let count = 0
	let unsubscribe = sentry.subscribe((data) => {
		if (count === 1) assert.equal(data.user, {})
		count++
	})
	sentry.init({ adapter: context.adapter, providers: context.providers })
	assert.equal(context.adapter.calls(), [{ function: 'user', user: {} }])
	assert.equal(sentry.routes(), { authUrl: '/auth/signin', loginUrl: '/auth' })

	context.adapter.clearCalls()
	unsubscribe()

	context.authProviders.map(
		async ({ credentials, message, expected, call }) => {
			if (call) calls.push(call)
			const result = await sentry.handleSignIn(
				credentials,
				'http://localhost:3000'
			)
			assert.equal(result, expected, message)
		}
	)

	assert.equal(context.adapter.calls(), calls)
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
