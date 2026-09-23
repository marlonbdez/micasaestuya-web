import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { CollaborationTask } from '@/core/types'
import { LevelType } from '@/core/types/region'
import type { IListingDraft } from '@/core/types'
import {
  emptyListingDraft,
  toCreateInput,
  useListingDraftStore
} from '@/stores/listingDraft'

const completeDraft = (): IListingDraft => ({
  title: '  Casa con jardín  ',
  region: {
    term: 'Matanzas, Cárdenas, Varadero',
    country_code: 'CU',
    level1: 'Matanzas',
    level2: 'Cárdenas',
    level3: 'Varadero',
    level_type: LevelType.Level3
  },
  photos: ['photo-1'],
  description: ' Una casa tranquila. ',
  tasks: [CollaborationTask.Cooking, CollaborationTask.Gardening],
  capacity: 2,
  whatsapp: '+53 5123-4567'
})

describe('toCreateInput', () => {
  it('drops the photos, trims the texts and normalizes the phone', () => {
    const input = toCreateInput(completeDraft())

    expect(input).not.toHaveProperty('photos')
    expect(input.title).toBe('Casa con jardín')
    expect(input.description).toBe('Una casa tranquila.')
    expect(input.whatsapp).toBe('+5351234567')
    expect(input.capacity).toBe(2)
    expect(input.region.level3).toBe('Varadero')
  })

  it('refuses an incomplete draft', () => {
    expect(() => toCreateInput(emptyListingDraft())).toThrow()
  })
})

describe('listingDraft store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts empty', () => {
    const store = useListingDraftStore()

    expect(store.draft).toEqual(emptyListingDraft())
    expect(store.published).toBeNull()
  })

  it('applies partial updates without touching the other fields', () => {
    const store = useListingDraftStore()

    store.update({ title: 'Casa' })
    store.update({ capacity: 3 })

    expect(store.draft.title).toBe('Casa')
    expect(store.draft.capacity).toBe(3)
    expect(store.draft.tasks).toEqual([])
  })
})
