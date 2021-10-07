import md5 from 'md5'

/**
 * Get the gravatar URL for an email
 *
 * @param {String} email
 * @param {Number} size
 * @param {String} d
 * @param {String} rating
 * @returns {String}
 */
export function gravatar(email, size = 400, d = 'identicon', rating = 'G') {
  const hash = md5((email || '').trim().toLowerCase())
  return `//www.gravatar.com/avatar/${hash}?d=${d}&r=${rating}&s=${size}`
}
