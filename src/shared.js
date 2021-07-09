export async function setCookie(user) {
  const loggedInAt = new Date()
  const lastLogin = Object.keys(user).includes('id')
    ? loggedInAt.toISOString()
    : ''
  localStorage.setItem('lastLogin', lastLogin)

  const result = await fetch('/api/setCookie', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lastLogin }),
  })
  return result
}
