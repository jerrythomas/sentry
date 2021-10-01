export async function getPhotoUrl(token) {
  const url = 'https://graph.microsoft.com/v1.0/me/photo/$value'

  const response = await fetch(url, {
    method: 'get',
    headers: {
      Authorization: `bearer ${token}`,
    },
  })
  const blob = await response.blob()
  const photo = await blobToDataURL(blob)

  return photo
}

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onend = reject
    reader.onabort = reject
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(new Blob([blob], { type: blob.type }))
  })
}
