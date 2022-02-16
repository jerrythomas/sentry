import { cookiesFromSession } from '@jerrythomas/sentry'

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ request }) {
	const body = await request.json()
	return cookiesFromSession(body.session)
}
