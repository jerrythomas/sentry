/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ params, url, request }) {
	console.log(Object.fromEntries(url.searchParams.entries()))
	let body = await getRequestBody(request)
	console.log(body)

	return { body }
}
