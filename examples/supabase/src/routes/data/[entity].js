import { supabase } from '$config/auth'

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get(request) {
	const { entity } = request.params

	// console.log('get', entity, Object.fromEntries(request.query.entries()))

	const { data, error, status } = await supabase
		.from(entity)
		.select()
		.match(Object.fromEntries(request.query.entries()))

	if (error) return { status, body: error }
	console.log('get', entity, data)
	return {
		status: 200,
		body: { data }
	}
}

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(request) {
	const { entity } = request.params
	const method = (request.query.get('method') || 'POST').toUpperCase()
	let data

	try {
		data = Object.fromEntries(request.body.entries())
	} catch (err) {
		console.error('post', method, entity, err)
		data = request.body
	}

	let result

	if (method === 'POST') {
		result = await supabase.from(entity).upsert(data)
	} else if (method === 'PUT') {
		result = await supabase.from(entity).insert([data])
	} else if (method === 'DELETE') {
		result = await supabase.from(entity).delete().match(data)
	}

	if (
		!result.error &&
		request.method !== 'GET' &&
		request.headers.accept !== 'application/json'
	) {
		return {
			status: 303,
			headers: {
				location: request.headers.referer.replace(request.headers.origin, '')
			}
		}
	}

	return {
		status: result.status,
		statusText: result.statusText,
		body: result.body
	}
}

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function put(request) {
	const { entity } = request.params
	console.log(entity, 'put', request.body)

	let { data, error, status } = await supabase
		.from(entity)
		.insert([request.body])
	if (error) return { status, body: error }

	return {
		status: 200,
		body: { data }
	}
}

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function del(request) {
	const { entity } = request.params
	console.log(entity, 'del', request.body)
	const { data, error, status } = await supabase
		.from(entity)
		.delete()
		.match(request.body)

	if (error) return { status, body: error }
	return {
		status: 200,
		body: { data }
	}
}
