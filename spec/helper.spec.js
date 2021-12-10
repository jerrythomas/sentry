import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { sessionFromCookies, cookiesFromSession } from '../src/helper.js'

const HelperSuite = suite('Helper functions')

HelperSuite.before(async (context) => {
	context.cookieProperties = 'Max-Age=86400; Path=/; HttpOnly; SameSite=Strict'
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

HelperSuite.run()
