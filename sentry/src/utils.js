/**
 * Assumes that user is logged in if the last login timestamp is not older than 24 hours
 *
 * @param {*} lastLogin  Empty or timestamp of last login
 * @returns true or false
 */
export function isLoggedIn(lastLogin) {
  let today = new Date()
  let loginTime

  loginTime = Date.parse(lastLogin || '')

  const diff = today - loginTime
  return diff >= 0 && diff < 86400000
}

/**
 * Identifies which routes are allowed based on whether
 * the user is logged in and redirects to allowed routes
 * if user attempts to access a public route.
 *
 * login route is redirected to home if user is already logged in
 *
 * @param {object} routes    route configuration object
 * @param {string} lastLogin Last login timestamp of user
 * @param {string} route     Route user wants to go to
 * @returns Allowed route for the user based on login status
 */
export function whereTo(routes, lastLogin, route) {
  const loggedIn = isLoggedIn(lastLogin)
  let location = route
  let isPublic = false

  for (let i = 0; i < routes.public.length && !isPublic; i++) {
    isPublic = route.startsWith(routes.public[i])
  }

  if (loggedIn && route === routes.start) location = routes.home
  if (!loggedIn && !isPublic) location = routes.start

  return location
}
