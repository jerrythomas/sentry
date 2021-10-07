import cookie from 'cookie'

export async function handle({ request, resolve }) {
	const cookies = cookie.parse(request.headers.cookie || '')

	// do some stuff before
	request.locals.user = cookies.user

	const response = await resolve(request)

	// do some stuff after
	response.headers['set-cookie'] = `user=${
		request.locals.user || ''
	}; path=/; HttpOnly`

	return response
}

export async function getSession(request) {
	return {
		user: request.locals.user
	}
}
