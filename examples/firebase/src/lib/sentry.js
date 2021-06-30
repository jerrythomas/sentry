export function whereTo(session, route) {
  let location = route
  const loggedIn =
    session && session?.user && Object.keys(session?.user).includes('id')

  console.log('is logged in?', session, loggedIn)

  if (loggedIn && route === '/login') location = '/'
  if (!loggedIn && route === '/') location = '/login'

  if (location != route) {
    return { status: 301, headers: { location } }
  }
  return {}
}
