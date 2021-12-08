/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post(request) {
	const { token } = request.params
	console.log(token, Object.fromEntries(request.query.entries()))
	return {
		status: 303,
		headers: {
			location: `/login`
		}
	}
}
