/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export function post(request) {
  if (request.body && typeof request.body === 'string') {
    request.body = JSON.parse(request.body)
  }

  let cookies = []
  for (const key in request.body) {
    const cookie = `${key}=${request.body[key]}; Path=/; HttpOnly; Secure; SameSite=Strict;`
    cookies.push(cookie)
  }

  return {
    status: 200,
    body: {},
    headers: {
      'content-type': 'application/json',
      'set-cookie': cookies,
    },
  }
}
