import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { Router } from '../src/router.js'
import fs from 'fs'
import yaml from 'js-yaml'

const RouterSuite = suite('Router functions')

RouterSuite.before(async (context) => {
	try {
		context.config = yaml.load(
			fs.readFileSync('spec/fixtures/config.yaml', 'utf8')
		)
		context.roles = yaml.load(
			fs.readFileSync('spec/fixtures/roles.yaml', 'utf8')
		)
		context.redirect = yaml.load(
			fs.readFileSync('spec/fixtures/redirect.yaml', 'utf8')
		)
	} catch (err) {
		console.error(err)
	}
})

RouterSuite('Should work with defaults', (context) => {
	let router = new Router()

	assert.equal(router.home, '/')
	assert.equal(router.login, '/login')
	assert.equal(router.logout, '/logout')
	assert.equal(router.endpoints, {
		signIn: '/auth/signin',
		sessionCookie: '/auth/session'
	})
	assert.not(router.isAuthenticated)

	assert.equal(router.byRole, {
		public: ['/auth/session', '/auth/signin', '/login'],
		authorized: ['/']
	})
})

RouterSuite('Should handle different options', (context) => {
	context.config.forEach(({ options, expected }) => {
		let router = new Router(options)
		Object.keys(expected).forEach((key) => {
			assert.equal(router[key], expected[key])
		})
	})
})

RouterSuite('Should set allowedRoutes', (context) => {
	const { options, expected, data } = context.roles
	let router = new Router(options)

	Object.keys(expected).forEach((key) => {
		assert.equal(router[key], expected[key])
	})

	data.forEach(({ roles, routes }) => {
		router.authRoles = roles
		assert.equal(router.allowedRoutes, routes)
	})
})

RouterSuite('Should fallback on allowed routes', (context) => {
	const { options, data } = context.redirect
	let router = new Router(options)

	data.forEach(({ roles, routes }) => {
		router.authRoles = roles
		routes.forEach(({ visited, redirect }) => {
			const fallback = router.redirect(visited)
			assert.equal(fallback, redirect)
		})
	})
})

RouterSuite.run()
