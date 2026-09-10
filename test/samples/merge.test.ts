import { test, expect } from 'vitest'
import { deepMerge, deepMerge } from '../../core/utils.js'

test('shall merge objects', () => {
  const merged = deepMerge({ a: 1 }, { b: 2 })
  expect(merged).toEqual({ a: 1, b: 2 })
})

test('shall merge arrays', () => {
  const merged = deepMerge([1, 2], [3, 4])
  expect(merged).toEqual([1, 2, 3, 4])
})

test('shall merge arrays with snapshots', () => {
  expect(deepMerge([1, 3], [3, 4])).toMatchSnapshot()
})

test('shall merge arrays with inline snapshots', () => {
  expect(deepMerge([2, 3], [3, 4])).toMatchInlineSnapshot(`
    [
      2,
      3,
      3,
      4,
    ]
  `)
})

test('throws error when merging incompatible types', () => {
  expect(() => deepMerge('{ a: 1 }', [3, 4])).toThrowError(
    'Cannot merge strings'
  )
})
