import md5 from 'md5'

/**
 * Read chunked data from a readable stream and return a Buffer
 *
 * @param {ReadableStream} stream
 * @returns {Buffer} containing contents of the stream
 */
export async function readStream(stream) {
	let buf = await new Promise((resolve, reject) => {
		let buffers = []
		stream.on('readable', () => {
			let chunk
			while (null !== (chunk = stream.read())) {
				buffers.push(new Buffer.from(chunk))
			}
		})
		stream.on('error', (err) => reject(err))
		stream.on('end', () => resolve(Buffer.concat(buffers)))
	})

	return buf
}

/**
 * Convert a buffer into a base 64 encoded string dataURL
 *
 * @param {Buffer} buffer
 * @param {String} contentType
 * @returns {DataURL}
 */
export function toDataURL(buffer, contentType = 'image/jpeg') {
	return `data:${contentType};base64,${buffer.toString('base64')}`
}

/**
 * Given an email and Auth token for Microsoft Graph API, fetch the photo for the email
 *
 * @param {String} email
 * @param {String} token
 * @returns {Object} containing status and the photo in a Buffer
 */
export async function getUserPhotoFromMicrosoft(email, token) {
	const url = `https://graph.microsoft.com/v1.0/users/${email}/photo/$value`

	const response = await fetch(url, {
		method: 'get',
		headers: {
			Authorization: 'Bearer ' + token
		}
	})

	let photo
	if (response.ok) {
		photo = await readStream(response.body)
	}
	return {
		ok: response.ok,
		status: response.status,
		statusText: response.statusText,
		photo
	}
}

/**
 * Parse a string as a boolean value.
 *
 * - Nulls are considered as false.
 * - 1, 'yes' & 'true' are considered as true
 *
 * @param {String} value
 * @returns {Boolean}
 */
export function asBoolean(value) {
	return ['1', 'yes', 'true', ''].includes((value || 'false').toLowerCase())
}

/**
 * Get the gravatar URL for an email
 *
 * @param {String} email
 * @param {Number} size
 * @param {String} d
 * @param {String} rating
 * @returns {String}
 */
export function gravatar(email, size = 256, d = 'identicon', rating = 'G') {
	const hash = md5((email || '').trim().toLowerCase())
	return `//www.gravatar.com/avatar/${hash}?d=${d}&r=${rating}&s=${size}`
}
