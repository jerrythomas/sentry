// import { readStream, toDataURL } from '../stuff'
/**
 * Given an email and Auth token for Microsoft Graph API, fetch the photo for the email
 *
 * @param {String} email
 * @param {String} token
 * @returns {Object} containing status and the photo in a Buffer
 */
export async function getPhotoOld(email, token) {
  const url = `https://graph.microsoft.com/v1.0/users/${email}/photo/$value`

  const response = await fetch(url, {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })

  let photo = null
  if (response.ok) {
    console.log(response.body)
    photo = await readStream(response.body)
  }
  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    contentType: response.headers.get('Content-Type'),
    photo,
  }
}

export async function getPhoto(email, token) {
  const url = `https://graph.microsoft.com/v1.0/users/${email}/photo/$value`
  const res = await fetch(url, {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
  if (res.ok) {
    // console.log(res.body.blob())
    const photo = await toDataURL(res.body)
    // console.log(photo)
    // fs.writeFileSync(`static/photos/${email}.jpg`, photo)
  }
}

async function toDataURL(readable) {
  console.log(readable)
  let buf = await new Promise((resolve, reject) => {
    let buffers = []

    while (null !== (chunk = readable.read())) {
      buffers.push(new Buffer.from(chunk))
    }

    readable.on('readable', () => {
      let chunk
      while (null !== (chunk = readable.read())) {
        buffers.push(new Buffer.from(chunk))
      }
    })
    readable.on('error', (err) => reject(err))
    readable.on('end', () => resolve(Buffer.concat(buffers)))
  })

  return buf
}

// export async function getPhotoAsDataURL(email, token) {
//   const response = await getPhoto(email, token)
//
//   if (response.ok) {
//     return toDataURL(response.photo, response.contentType)
//   } else {
//     console.error(response.statusText)
//   }
//   return null
// }
