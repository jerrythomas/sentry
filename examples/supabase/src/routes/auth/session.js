import { cookiesFromSession } from '@jerrythomas/sentry'

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ request }) {
	const body = await request.json()
	console.log(body)
	return cookiesFromSession(body.session)
}
