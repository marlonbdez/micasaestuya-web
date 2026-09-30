import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { CollaborationTask } from '@/core/types'
import type { IListingCard } from '@/core/types'
import { useMyListings } from '@/composables/useMyListings'

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
  photos: []
})

const { mine, remove } = vi.hoisted(() => ({ mine: vi.fn(), remove: vi.fn() }))

mockNuxtImport('useNuxtApp', () => () => ({
  $services: { listing: { mine, remove } }
}))

beforeEach(() => {
  mine.mockReset()
  remove.mockReset()
})

describe('useMyListings', () => {
  it('loads my listings', async () => {
    mine.mockResolvedValue([card('1'), card('2')])
    const { items, status, load } = useMyListings()

    await load()

    expect(status.value).toBe('ready')
    expect(items.value.map(({ id }) => id)).toEqual(['1', '2'])
  })

  it('flags the failure so it can be retried', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    mine.mockRejectedValueOnce(new Error('offline'))
    const { status, load } = useMyListings()

    await load()
    expect(status.value).toBe('error')

    mine.mockResolvedValueOnce([])
    await load()
    expect(status.value).toBe('ready')
  })

  it('drops a listing from the list once it is deleted', async () => {
    mine.mockResolvedValue([card('1'), card('2')])
    remove.mockResolvedValue(undefined)
    const { items, load, remove: removeListing } = useMyListings()
    await load()

    await removeListing('1')

    expect(remove).toHaveBeenCalledWith('1')
    expect(items.value.map(({ id }) => id)).toEqual(['2'])
  })

  it('keeps the listing when the delete fails', async () => {
    mine.mockResolvedValue([card('1')])
    remove.mockRejectedValue(new Error('500'))
    const { items, load, remove: removeListing } = useMyListings()
    await load()

    await expect(removeListing('1')).rejects.toThrow()
    expect(items.value).toHaveLength(1)
  })
})
