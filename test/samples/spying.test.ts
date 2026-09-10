import { test, expect, vi } from 'vitest'
import { greeting } from '../../core/utils.js'

test('greeting', () => {
  const spy = vi.spyOn(console, 'log')

  greeting('World')

  expect(spy).toBeCalledWith('Hello World')
  expect(spy).toBeCalledTimes(1)
})

test('greeting 2', () => {
  const spy = vi.spyOn(console, 'log')

  greeting('World')
  greeting('People')

  expect(spy).toBeCalledWith('Hello People')
  expect(spy).toBeCalledWith('Hello World')
  expect(spy).toBeCalledTimes(2)

  // In case the order of calls is important
  expect(spy.mock.calls[0][0]).toBe('Hello World')
  expect(spy.mock.calls[1][0]).toBe('Hello People')
})
