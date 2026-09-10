import { test, expect } from 'vitest'
import { getPostBody } from '../../core/utils'

// Use Mock Service Worker (https://mswjs.io/) to mock fetch instead of vi.mock

// vi.stubGlobal('fetch', () => {
//   return {
//     json () {
//       return {
//         body: 'lorem ipsum'
//       }
//     }
//   }
// })

test.skip('with fetch', async () => {
  const result = await getPostBody()
  expect(result).toMatchInlineSnapshot(`
    "quia et suscipit
    suscipit recusandae consequuntur expedita et cum
    reprehenderit molestiae ut ut quas totam
    nostrum rerum est autem sunt rem eveniet architecto"
  `)
})
