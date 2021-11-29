/**
 * Read chunked data from a readable stream and return a Buffer
 *
 * @param {ReadableStream} stream
 * @returns {Buffer} containing contents of the stream
 */
export async function readStream(stream) {
  const reader = await stream.getReader()
  console.log(reader)

  let buf = await new Promise((resolve, reject) => {
    let buffers = []

    reader.on('readable', () => {
      let chunk
      while (null !== (chunk = stream.read())) {
        buffers.push(new Buffer.from(chunk))
      }
    })
    reader.on('error', (err) => reject(err))
    reader.on('end', () => resolve(Buffer.concat(buffers)))
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
