import cookie from 'cookie'
import { redirect } from '@jerrythomas/sentry'
import { routes } from './config'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
  const cookies = cookie.parse(request.headers.cookie || '')
  request.locals = { ...cookies }
  const response = await resolve(request)
  return redirect(routes, request.locals.lastLogin, request.path, response)
  // return redirectOnServer(routes, request, response)
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(request) {
  return {
    lastLogin: request.locals?.lastLogin,
  }
}
