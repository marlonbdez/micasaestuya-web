import { describe, it, expect, test } from 'vitest'

function sum(a: number, b: number) {
  return a + b
}

function sumAll(...args: number[]) {
  return args.reduce((acc, val) => acc + val, 0)
}

describe('My test', () => {
  it('lorem ipsum', () => {
    expect(true).toBe(true)
  })
})

test('1 + 1', () => {
  expect(sum(1, 2)).toEqual(3)
  expect(sumAll(1, 2, 3, 4, 5)).toEqual(15)
})
