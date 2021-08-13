import md5 from 'md5'

export function dummyAvatar(email, size = 128) {
  const hash = md5(email.trim().toLowerCase())
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&r=G&s=${size}`
}

export async function gravatar(email, size = 128) {
  const hash = md5(email.trim().toLowerCase())
  const profile = `https://www.gravatar.com/${hash}.json`
  const notfound = 'User not found'

  let user = {
    email,
    avatar: `https://www.gravatar.com/avatar/${hash}?d=identicon&r=G&s=${size}`,
  }

  let response = await fetch(profile, { mode: 'cors' })
  if (response.status == 404) return user

  let result = await response.json()
  if (result === notfound) return user

  user.name = result.entry[0].name.formatted
  user.displayName = result.entry[0].displayName
  user.location = result.entry[0].currentLocation

  return user
}

function toDataURL(blob) {
  const value = new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
  return value
}

function profilePhoto(token) {
  let result = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
    method: 'post',
    headers: new Headers({
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: '',
  })
  return toDataURL(result)
}
