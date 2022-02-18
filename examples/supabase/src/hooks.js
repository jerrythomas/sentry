import { sentry } from './config'
import { sessionFromCookies } from '@jerrythomas/sentry'

export const handle = async ({ event, resolve }) => {
	const response = await resolve(event)
	event.locals = sessionFromCookies(event)
	return sentry.protectServerRoute(event, response)
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event) {
	return sessionFromCookies(event)
}
