import { readFileSync } from 'fs'
import { test, expect, vi } from 'vitest'

vi.mock('fs', () => {
  // const actual = await vi.importActual('fs')
  return {
    readFileSync() {
      return '{ "name": "mocked }'
    }
  }
})

function loadFile() {
  return readFileSync('../README.md', 'utf8')
}

test('with fs', async () => {
  const result = await loadFile()
  expect(result).toMatchInlineSnapshot(`"{ "name": "mocked }"`)
})
