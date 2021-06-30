/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export function post(request) {
  if (request.body && typeof request.body === 'string') {
    request.body = JSON.parse(request.body)
  }
  const user = JSON.stringify(request.body)
  // console.log('Session api', session, request.body)
  const message = `Successfuly signed ${user == {} ? 'out' : 'in'}`
  const userCookie = `user=${user}; Path=/; HttpOnly; Secure; SameSite=Strict;`
  const sessionCookie = `session=; Path=/; HttpOnly; Secure; SameSite=Strict;`

  return {
    status: 200,
    body: JSON.stringify({ message }),
    headers: {
      'content-type': 'application/json',
      'set-cookie': [userCookie, sessionCookie],
    },
  }
}
