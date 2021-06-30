import cookie from 'cookie'
import { whereTo } from '@jerrythomas/sentry'
import { routes } from './config'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
  const cookies = cookie.parse(request.headers.cookie || '')

  request.locals = { ...cookies }

  const response = await resolve(request)
  const location = whereTo(routes, request.locals.lastLogin, request.path)

  if (location != request.path) {
    return { status: 302, headers: { location } }
  }
  return response
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(request) {
  return {
    lastLogin: request.locals?.lastLogin,
  }
}
