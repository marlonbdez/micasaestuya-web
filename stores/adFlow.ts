import { defineStore } from 'pinia'
import * as Sentry from '@sentry/nuxt'
import type { IAdDraft } from '@/core/types'
import { usePhotoDb } from '~/composables/usePhotoDb'

const STORAGE_KEY = 'ad-draft:v9'

const emptyDraft = (): IAdDraft => ({
  type: null,
  operation: null,
  address: { region: null, street: '', streetNumber: '' },
  details: { price: null, surface: null, bedrooms: null, bathrooms: null },
  photos: []
})

const isPositive = (value: number | null) =>
  typeof value === 'number' && value > 0

export const useAdFlowStore = defineStore('adFlow', {
  state: () => ({
    draft: emptyDraft()
  }),

  getters: {
    canGoNext: (state) => (step: string) => {
      const { draft } = state
      switch (step) {
        case 'basic-info':
          return !!draft.type && !!draft.operation
        case 'address':
          return !!draft.address.region && !!draft.address.street.trim()
        case 'details':
          return (
            isPositive(draft.details.price) && isPositive(draft.details.surface)
          )
        case 'photos':
          return draft.photos.length > 0
        default:
          return false
      }
    }
  },

  actions: {
    update(patch: Partial<IAdDraft>) {
      Object.assign(this.draft, patch)
      this.persist()
    },

    persist() {
      if (!import.meta.client) return
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.draft))
    },

    hydrate() {
      if (!import.meta.client) return
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      try {
        const empty = emptyDraft()
        const stored = JSON.parse(raw)
        this.draft = {
          ...empty,
          ...stored,
          address: { ...empty.address, ...stored.address },
          details: { ...empty.details, ...stored.details },
          // Un `photos` que no sea array tumbaría canGoNext al leer .length.
          photos: Array.isArray(stored.photos) ? stored.photos : empty.photos
        }
      } catch (error) {
        console.error('Unable to parse ad draft from localStorage', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    },

    reset() {
      this.draft = emptyDraft()
      if (!import.meta.client) return

      localStorage.removeItem(STORAGE_KEY)
      // Las fotos no están en localStorage: sin esto quedan huérfanas en disco.
      usePhotoDb()
        .clearPhotos()
        .catch((error) => {
          console.error('Unable to clear the photos', error)
          Sentry.captureException(error)
        })
    }
  }
})
