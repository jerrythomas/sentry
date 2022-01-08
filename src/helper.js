import cookie from 'cookie'
/**
 *
 * @param {*} request
 * @returns
 */
export function sessionFromCookies(request) {
	const cookies = cookie.parse(request.headers.cookie || '')
	const keys = ['id', 'email', 'role']
	let session = {}

	keys.map((key) => {
		session[key] = key in cookies ? cookies[key] : ''
	})

	return session
}

/**
 *
 * @param {s} session
 * @returns
 */
export function cookiesFromSession(session) {
	const keys = ['id', 'email', 'role']
	const user = session?.user || null
	const cookies = keys.map((key) =>
		cookie.serialize(key, user ? user[key] : '', {
			path: '/',
			httpOnly: true,
			sameSite: true,
			maxAge: 3600
		})
	)
	// console.log('session user', user?.email, user?.role)
	return {
		status: 200,
		headers: {
			'content-type': 'application/json',
			'set-cookie': cookies
		}
	}
}
