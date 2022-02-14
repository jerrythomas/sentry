import { sentry } from './config'

export const handle = async ({ event, resolve }) => {
	const response = await resolve(event)
	console.log(
		'protect',
		event.url?.pathname,
		event.locals,
		event.request.headers.get('cookie')
	)
	return sentry.protect(event, response)
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event) {
	return event.locals
}
