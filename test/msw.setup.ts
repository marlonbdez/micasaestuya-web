import { beforeAll, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

// Provide the server-side API with the request handlers.
const server = setupServer(
  http.get('https://jsonplaceholder.typicode.com/posts/1', () => {
    return HttpResponse.json({
      body: 'lorem ipsum is dolor'
    })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.close())
