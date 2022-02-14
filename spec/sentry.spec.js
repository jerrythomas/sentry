import fs from 'fs'
import yaml from 'js-yaml'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import fetchMock from 'fetch-mock'
import { adapter } from './mock/adapter.js'
import { Response } from './mock/response.js'
import { Headers } from './mock/headers.js'

import { sentry } from '../src/sentry.js'

const VALID_EMAIL = 'john@doe@example.com'
const SentrySuite = suite('Sentry wrapper for auth')

SentrySuite.before(async (context) => {
	global.window = { location: { href: '', pathname: '/' } }
	global.window.sessionStorage = {
		getItem(key) {
			return context.sessionStorage[key]
		},
		setItem(key, value) {
			context.sessionStorage[key] = value
		}
	}
	global.Response = Response
	global.Headers = Headers
	try {
		context.authProviders = yaml.load(
			fs.readFileSync('spec/fixtures/providers.yaml', 'utf8')
		)
	} catch (err) {
		console.error(err)
	}

	context.sessionStorage = {}
	context.providers = [
		{ provider: 'magic' },
		{ provider: 'google', scopes: ['email'], params: [] }
	]
	context.adapter = adapter
	context.routes = { routes: { authenticated: ['/visited'] } }
	context.authCookie = [
		'id=74758948-0f30-4388-baaf-1279bbe5ff0b',
		'email=jane%40example.com',
		'role=authenticated'
	].join('; ')
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
	sentry.init({
		adapter: context.adapter,
		providers: context.providers,
		routes: context.routes
	})
	// console.log(context.routes)
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
	await sentry.handleAuthChange('/')
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

SentrySuite(
	'Should redirect to cached route after authentication',
	async (context) => {
		let count = 0
		sentry.init({
			adapter: context.adapter,
			providers: context.providers,
			routes: context.routes
		})
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
		await sentry.handleAuthChange('/visited')

		await context.adapter.authStateCallback('SIGNED_IN', {
			user: { id: '123', email: VALID_EMAIL, role: 'authenticated' }
		})

		unsubscribe()
		assert.equal(window.location.pathname, '/visited')
		const [endpoint, params] = fetchMock.lastCall()
		assert.equal(endpoint, '/auth/session')
		assert.equal(params, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'same-origin',
			body: `{"event":"SIGNED_IN","session":{"user":{"id":"123","email":"${VALID_EMAIL}","role":"authenticated"}}}`
		})

		fetchMock.restore()
	}
)

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

SentrySuite('Should bypass routing when url is not present', () => {
	const input = { request: { headers: new Headers({}) }, locals: {} }
	const response = new Response('', { status: 200 })
	const result = sentry.protect(input, response)

	assert.equal(result, response)
})

SentrySuite('Should redirect protected routes for auth', () => {
	const input = {
		request: { headers: new Headers({}) },
		locals: {},
		url: { pathname: '/' }
	}
	const response = new Response('', {
		status: 302,
		headers: new Headers({ location: '/auth' })
	})
	const result = sentry.protect(input, new Response('', { status: 200 }))
	// console.log(result, response)
	assert.equal(result, response)
})

SentrySuite('Should allow auth route when not authenticated', () => {
	const input = {
		request: { headers: new Headers({}) },
		locals: {},
		url: { pathname: '/auth' }
	}
	const response = new Response('auth content', {
		status: 200
	})

	const result = sentry.protect(input, response)
	assert.equal(result, response)
})

SentrySuite('Should allow protected routes when authenticated', (context) => {
	const input = {
		request: {
			headers: new Headers({
				cookie: context.authCookie
			})
		},
		locals: {},
		url: { pathname: '/' }
	}
	const response = new Response('some content', {
		status: 200
	})

	const result = sentry.protect(input, response)
	assert.equal(result, response)
})

SentrySuite('Should redirect to home when authenticated', (context) => {
	const input = {
		request: {
			headers: new Headers({
				cookie: context.authCookie
			})
		},
		locals: {},
		url: { pathname: '/' }
	}

	const response = new Response('', {
		status: 302,
		headers: new Headers({ location: '/' })
	})
	const result = sentry.protect(input, response)
	assert.equal(result, response)
})

SentrySuite.run()
