import { cookiesFromSession } from '@jerrythomas/sentry'

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post(request) {
	return cookiesFromSession(request.body.session)
}
