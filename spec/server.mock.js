import { createServer } from 'miragejs'

export function mockServer() {
  return createServer({
    environment: 'test',

    // rest of server
    routes() {
      this.post('/api/setCookie', (schema, request) => {
        let attrs = JSON.parse(request.requestBody)
        console.log(attrs)
        // debugger
        return attrs
      })
    },
  })
}
