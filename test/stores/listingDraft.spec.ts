import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { CollaborationTask } from '@/core/types'
import { LevelType } from '@/core/types/region'
import type { IListingFormValues } from '@/core/types'
import { toCreateInput } from '@/core/listingForm'
import { emptyListingDraft, useListingDraftStore } from '@/stores/listingDraft'

const completeValues = (): IListingFormValues => ({
  title: '  Casa con jardín  ',
  region: {
    term: 'Matanzas, Cárdenas, Varadero',
    country_code: 'CU',
    level1: 'Matanzas',
    level2: 'Cárdenas',
    level3: 'Varadero',
    level_type: LevelType.Level3
  },
  description: ' Una casa tranquila. ',
  tasks: [CollaborationTask.Cooking, CollaborationTask.Gardening],
  capacity: '2',
  whatsapp: '+53 5123-4567'
})

describe('toCreateInput', () => {
  it('trims the texts, normalizes the phone and turns capacity into a number', () => {
    const input = toCreateInput(completeValues())

    expect(input.title).toBe('Casa con jardín')
    expect(input.description).toBe('Una casa tranquila.')
    expect(input.whatsapp).toBe('+5351234567')
    expect(input.capacity).toBe(2)
    expect(input.region.level3).toBe('Varadero')
  })

  it('refuses an incomplete form', () => {
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
    store.update({ capacity: '3' })

    expect(store.draft.title).toBe('Casa')
    expect(store.draft.capacity).toBe('3')
    expect(store.draft.tasks).toEqual([])
  })
})
