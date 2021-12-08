import { supabase } from '$config/auth'

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function put(request) {
	const { entity } = request.params
	let { data, error, status } = await supabase.from(entity).insert([request.body])
	if (error) return { status, body: error }

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
	const { data, error, status } = await supabase.from(entity).upsert(request.body)

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
	const { data, error, status } = await supabase.from(entity).delete().match(request.body)

	if (error) return { status, body: error }
	return {
		status: 200,
		body: { data }
	}
}

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
