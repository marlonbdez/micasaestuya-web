import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { CollaborationTask } from '@/core/types'
import type { IListingCard } from '@/core/types'
import { useListingExplore } from '@/composables/useListingExplore'

const card = (id: string): IListingCard => ({
  id,
  title: `Casa ${id}`,
  region: {
    term: 'Matanzas',
    country_code: 'CU',
    level1: 'Matanzas',
    level2: null,
    level3: null,
    level_type: 1
  },
  tasks: [CollaborationTask.Cooking],
  capacity: 2,
  photos: [`https://photos.test/${id}`]
})

const { list } = vi.hoisted(() => ({ list: vi.fn() }))

mockNuxtImport('useNuxtApp', () => () => ({
  $services: { listing: { list } }
}))

beforeEach(() => list.mockReset())

describe('useListingExplore', () => {
  it('asks for the next page each time and stops when all are loaded', async () => {
    list
      .mockResolvedValueOnce({ items: [card('1'), card('2')], total: 3 })
      .mockResolvedValueOnce({ items: [card('3')], total: 3 })
    const { items, hasMore, loadMore } = useListingExplore()

    expect(hasMore.value).toBe(true)
    await loadMore()
    expect(hasMore.value).toBe(true)
    await loadMore()

    expect(list.mock.calls).toEqual([[1], [2]])
    expect(items.value.map(({ id }) => id)).toEqual(['1', '2', '3'])
    expect(hasMore.value).toBe(false)
  })

  it('ignores a listing that shows up again in a later page', async () => {
    list
      .mockResolvedValueOnce({ items: [card('1'), card('2')], total: 3 })
      .mockResolvedValueOnce({ items: [card('2'), card('3')], total: 4 })
    const { items, loadMore } = useListingExplore()

    await loadMore()
    await loadMore()

    expect(items.value.map(({ id }) => id)).toEqual(['1', '2', '3'])
  })

  it('flags the failure and retries the same page', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    list
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ items: [card('1')], total: 1 })
    const { items, failed, loadMore } = useListingExplore()

    await loadMore()
    expect(failed.value).toBe(true)

    await loadMore()
    expect(failed.value).toBe(false)
    expect(list.mock.calls).toEqual([[1], [1]])
    expect(items.value).toHaveLength(1)
  })
})
