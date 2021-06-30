// import cookie from 'cookie'

export function isLoggedIn(lastLogin) {
  let today = new Date()
  let loginTime

  loginTime = Date.parse(lastLogin || '')

  const diff = today - loginTime
  // console.log(diff > 0 && diff < 86400000 ? 'Logged In' : 'Not logged in')
  return diff >= 0 && diff < 86400000
}

export function whereTo(routes, lastLogin, route) {
  const loggedIn = isLoggedIn(lastLogin)
  let location = route
  let isPublic = false

  for (let i = 0; i < routes.public.length && !isPublic; i++) {
    isPublic = route.startsWith(routes.public[i])
  }

  if (loggedIn && route === routes.login) location = routes.home
  if (!loggedIn && !isPublic) location = routes.login

  return location
}

export function redirect(routes, lastLogin, path, response = {}) {
  const location = whereTo(routes, lastLogin, path)
  console.log('hooks/load => location', path, '=>', location)
  if (location != path) {
    return { status: 302, headers: { location } }
  }
  return response
}

// export function redirectOnServer(routes, request, response) {
//   const location = whereTo(routes, request.locals?.lastLogin, request.path)
//   console.log('hooks => location', location, request.path)
//   if (location != request.path) {
//     return { status: 302, headers: { location } }
//   }
//   return response
// }
//
// export function redirectOnClient(routes, path, session) {
//   // const location = whereTo(routes, session, path)
//   // console.log('load => location', path, location)
//   // if (location != path) {
//   //   return { status: 302, headers: { location } }
//   // }
//   // return {}
//   redirectOnServer(routes, { locals: session, path }, {})
// }
