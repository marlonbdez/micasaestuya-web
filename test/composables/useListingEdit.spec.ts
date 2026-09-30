import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { CollaborationTask } from '@/core/types'
import type { IListingCreateInput } from '@/core/types'
import { useListingEdit } from '@/composables/useListingEdit'

const input: IListingCreateInput = {
  title: 'Casa',
  region: {
    term: 'Matanzas',
    country_code: 'CU',
    level1: 'Matanzas',
    level2: null,
    level3: null,
    level_type: 1
  },
  description: 'Descripción',
  tasks: [CollaborationTask.Cooking],
  capacity: 2,
  whatsapp: '+5351234567'
}

const { update, removePhoto, uploadListingPhotos, deletePhoto } = vi.hoisted(
  () => ({
    update: vi.fn(),
    removePhoto: vi.fn(),
    uploadListingPhotos: vi.fn(),
    deletePhoto: vi.fn()
  })
)

mockNuxtImport('useNuxtApp', () => () => ({
  $services: { listing: { update, removePhoto } }
}))
mockNuxtImport('useListingPhotoUpload', () => () => ({ uploadListingPhotos }))
mockNuxtImport('usePhotoDb', () => () => ({ deletePhoto }))

beforeEach(() => {
  for (const fn of [update, removePhoto, uploadListingPhotos, deletePhoto]) {
    fn.mockReset().mockResolvedValue(undefined)
  }
})

describe('useListingEdit', () => {
  it('saves the fields, removes the photos and uploads the new ones', async () => {
    await useListingEdit('l1').save(input, ['old'], ['new'])

    expect(update).toHaveBeenCalledWith('l1', input)
    expect(removePhoto).toHaveBeenCalledWith('l1', 'old')
    expect(uploadListingPhotos).toHaveBeenCalledWith('l1', ['new'])
    expect(deletePhoto).toHaveBeenCalledWith('new')
    expect(deletePhoto).toHaveBeenCalledWith('new-thumb')
  })

  it('only saves the fields when the photos did not change', async () => {
    await useListingEdit('l1').save(input, [], [])

    expect(update).toHaveBeenCalledOnce()
    expect(removePhoto).not.toHaveBeenCalled()
    expect(uploadListingPhotos).not.toHaveBeenCalled()
  })

  it('does not fail when a photo to remove is already gone', async () => {
    removePhoto.mockRejectedValue({ response: { status: 404 } })

    await expect(
      useListingEdit('l1').save(input, ['old'], [])
    ).resolves.toBeUndefined()
  })

  it('fails on any other error and keeps the new photos', async () => {
    uploadListingPhotos.mockRejectedValue(new Error('R2'))

    await expect(useListingEdit('l1').save(input, [], ['new'])).rejects.toThrow(
      'R2'
    )
    expect(deletePhoto).not.toHaveBeenCalled()
  })
})
