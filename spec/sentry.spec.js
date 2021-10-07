import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { isLoggedIn, whereTo } from '../src/utils.js'
// import { mockServer } from './server.mock.js'

const UtilitySuite = suite('Sentry utility functions')

UtilitySuite.before(async (context) => {
	const loginAt = new Date()
	loginAt.setHours(loginAt.getHours() - 1)

	context.routes = {
		start: '/home',
		public: ['/api', '/about', '/open'],
		home: '/'
	}
	context.loggedInCookie = `lastLogin=${loginAt.toISOString()};`
	context.loggedInSession = { lastLogin: loginAt.toISOString() }
	context.lastLogin = loginAt.toISOString()

	context.store = {}
	global.localStorage = {
		getItem: (key) => {
			return context.store[key]
		},
		setItem: (key, value) => {
			context.store[key] = value + ''
		},
		clear: () => {
			context.store = {}
		}
	}
})

UtilitySuite('Should validate login using timestamp', () => {
	let loginTime = new Date()

	assert.not(isLoggedIn())
	assert.not(isLoggedIn(null))
	assert.ok(isLoggedIn(loginTime.toISOString()))

	loginTime.setHours(loginTime.getHours() - 23)
	assert.ok(isLoggedIn(loginTime.toISOString()))

	loginTime.setHours(loginTime.getHours() + 24)
	assert.not(isLoggedIn(loginTime.toISOString()))
})

UtilitySuite('Should allow all public routes', async (context) => {
	const routes = ['/api', '/about', '/open', '/api/child', '/open/sub']

	routes.forEach((route) => {
		const location = whereTo(context.routes, {}, route)
		assert.equal(location, route)
	})
})

UtilitySuite('Should allow all public routes', async (context) => {
	const routes = ['/api', '/about', '/open', '/api/child', '/open/sub']

	routes.forEach((route) => {
		const location = whereTo(context.routes, context.loggedInSession, route)
		assert.equal(location, route)
	})
})

UtilitySuite(
	'Should re-route protected routes when not logged in',
	async (context) => {
		const routes = ['/', '/dashboard', '/private', '/protected', '/logout']

		routes.forEach((route) => {
			const location = whereTo(context.routes, null, route)
			assert.equal(location, context.routes.start)
		})
	}
)

UtilitySuite(
	'Should allow protected routes when logged in',
	async (context) => {
		const routes = ['/', '/dashboard', '/private', '/protected', '/logout']

		routes.forEach((route) => {
			const location = whereTo(context.routes, context.lastLogin, route)
			assert.equal(location, route)
		})
	}
)

UtilitySuite('Should redirect login when logged in', async (context) => {
	const location = whereTo(
		context.routes,
		context.lastLogin,
		context.routes.start
	)
	assert.equal(location, context.routes.home)
})

// UtilitySuite('Should handle redirects when logged out', async context => {
//   const headers = {}
//   const items = [
//     { path: '/', expected: '/home' },
//     { path: '/home', expected: '/home' },
//     { path: '/private', expected: '/home' },
//     { path: '/api', expected: '/api' },
//   ]
//   let template = { status: 302, headers: { location: '/home' } }

//   for (const item of items) {
//     template.headers.location = item.expected

//     // const request = { headers, path: item.path, locals: {} }
//     const response = { original: '?' }
//     const expected = item.expected != item.path ? template : response

//     const result = redirect(context.routes, '', item.path, response)
//     // console.log('result', result, expected)
//     assert.equal(result, expected)
//   }
// })

// UtilitySuite('Should handle redirects when logged in', async context => {
//   // const headers = {
//   //   cookie: context.loggedInCookie,
//   // }
//   const items = [
//     { path: '/', expected: '/' },
//     { path: '/home', expected: '/' },
//     { path: '/private', expected: '/private' },
//     { path: '/api', expected: '/api' },
//   ]
//   let template = { status: 302, headers: { location: '/home' } }

//   for (const item of items) {
//     // const request = { headers, path: item.path, locals: {} }
//     const response = { original: '?' }
//     template.headers.location = item.expected
//     const expected = item.expected != item.path ? template : response
//     const result = redirect(
//       context.routes,
//       context.lastLogin,
//       item.path,
//       response
//     )

//     assert.equal(result, expected)
//   }
// })

// UtilitySuite(
//   'Should send logged timestamp to cookie endpoint',
//   async (context) => {
//     mockServer()
//     let result = await setCookie({})
//     assert.equal(result, { lastLogin: '' })
//   }
// )

UtilitySuite.run()
