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
