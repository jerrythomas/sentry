import { routes } from '$config'

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(request) {
	console.log('session', request)
	request.locals.user = request.body.user
	return {
		status: 200,
		headers: {
			'content-type': 'application/json'
			// 'set-cookie': cookies,
		},
		body: {}
	}
	// return { status: 200, body: request.body }
}

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get(request) {
	console.log('session', request)
	request.locals.user = request.body.user
	return {
		status: 200,
		body: {},
		headers: {
			'content-type': 'application/json'
			// 'set-cookie': cookies,
		}
	}
	// return { status: 200, body: request.body }
}
