import { sentry } from '$config'
/**
 *
 * @param {*} request
 * @returns
 */
/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post(request) {
	let status = 'S001'
	const { loginUrl } = sentry.routes()
	const params = Object.assign(
		Object.fromEntries(request.query.entries()),
		Object.fromEntries(request.body.entries())
	)
	const { error, email, provider } = await sentry.handleSignIn(params)

	if (error) {
		status = 'E001'
		console.error(error)
	}

	if (
		request.method !== 'GET' &&
		request.headers.accept !== 'application/json'
	) {
		return {
			status: 303,
			headers: {
				location: `${loginUrl}?email=${email}&provider=${provider}&status=${status}`
			}
		}
	}
}
