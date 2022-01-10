import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import {
	sessionFromCookies,
	cookiesFromSession,
	hasAuthParams
} from '../src/helper.js'

const HelperSuite = suite('Helper functions')

HelperSuite.before(async (context) => {
	context.cookieProperties = 'Max-Age=3600; Path=/; HttpOnly; SameSite=Strict'
	;(context.pathname = '/auth'), (context.origin = 'http://localhost:3000')
	context.locations = [
		{
			href: 'http://localhost:3000/auth#access_token=abcd',
			expected: true
		},
		{
			href: 'http://localhost:3000/auth#type=other&access_token=abcd',
			expected: true
		},
		{
			href: 'http://localhost:3000/auth#access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjQxNjk4MzI5LCJzdWIiOiI2MzUxMTdmZC0yMjY0LTQ3ZGEtYWYwZS1hY2RiN2ZmOGU5ZTUiLCJlbWFpbCI6ImplcnJ5LnRob21hc0BzZW5lY2FnbG9iYWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIn0.QhVMcq9qfSV4FmMTRik20dWzVUGltOfdCrbphRqW99w&expires_in=3600&refresh_token=dSsLeCJCof1knFRrv7aG4A&token_type=bearer&type=magiclink',
			expected: true
		},
		{
			href: 'http://localhost:3000/auth#',
			expected: false
		},
		{
			href: 'http://localhost:3000/auth?provider=magic',
			expected: false
		}
	]
})

HelperSuite('Should extract session cookies from request', (context) => {
	let session = sessionFromCookies({ headers: {} })
	assert.equal(session, { id: '', email: '', role: '' })

	const cookie =
		'id=74758948-0f30-4388-baaf-1279bbe5ff0b; email=jane%40example.com; role=authenticated'

	session = sessionFromCookies({ headers: { cookie } })
	assert.equal(session, {
		id: '74758948-0f30-4388-baaf-1279bbe5ff0b',
		email: 'jane@example.com',
		role: 'authenticated'
	})
})

HelperSuite('Should create cookies from session', (context) => {
	const sessions = [
		{},
		{
			user: { id: 'xyz', email: 'john.doe@example.com', role: 'authenticated' }
		}
	]

	sessions.forEach((session) => {
		let { id, email, role } = session.user || { id: '', email: '', role: '' }

		email = email.replace('@', '%40')
		const cookies = cookiesFromSession(session)
		const expected = {
			status: 200,
			headers: {
				'content-type': 'application/json',
				'set-cookie': [
					`id=${id}; ${context.cookieProperties}`,
					`email=${email}; ${context.cookieProperties}`,
					`role=${role}; ${context.cookieProperties}`
				]
			}
		}
		// console.log(session, cookies)
		assert.equal(cookies, expected)
	})
})

HelperSuite('Should identify url with auth params', (context) => {
	context.locations.forEach(({ href, expected }) => {
		const location = {
			pathname: context.pathname,
			origin: context.origin,
			href
		}
		assert.equal(hasAuthParams(location), expected)
	})
})

HelperSuite.run()
