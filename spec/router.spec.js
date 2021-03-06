import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { Router } from '../src/router.js'
import fs from 'fs'
import yaml from 'js-yaml'

const RouterSuite = suite('Router functions')

RouterSuite.before(async (context) => {
	context.config = yaml.load(
		fs.readFileSync('spec/fixtures/config.yaml', 'utf8')
	)
	context.roles = yaml.load(fs.readFileSync('spec/fixtures/roles.yaml', 'utf8'))
	context.redirect = yaml.load(
		fs.readFileSync('spec/fixtures/redirect.yaml', 'utf8')
	)
})

RouterSuite('Should handle different options', (context) => {
	context.config.forEach(({ options, expected, message }) => {
		let router = new Router(options)
		Object.keys(expected).forEach((key) => {
			assert.equal(router[key], expected[key], message)
		})
	})
})

RouterSuite('Should set allowedRoutes', (context) => {
	const { options, message, expected, data } = context.roles
	let router = new Router(options)

	Object.keys(expected).forEach((key) => {
		assert.equal(router[key], expected[key], message)
	})

	data.forEach(({ roles, routes, message, isAuthenticated }) => {
		router.authRoles = roles
		assert.equal(router.allowedRoutes, routes, message)
		assert.equal(router.isAuthenticated, isAuthenticated, message)
	})
})

RouterSuite('Should fallback on allowed routes', (context) => {
	const { options, data } = context.redirect
	let router = new Router(options)

	data.forEach(({ roles, routes, message }) => {
		router.authRoles = roles
		routes.forEach(({ visited, redirect }) => {
			const fallback = router.redirect(visited)
			assert.equal(fallback, redirect, message)
		})
	})
})

RouterSuite.run()
