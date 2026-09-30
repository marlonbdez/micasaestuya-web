import { defineStore } from 'pinia'
import * as Sentry from '@sentry/nuxt'
import type { IListing, IListingDraft, IServicesInstance } from '@/core/types'
import { toCreateInput } from '@/core/listingForm'
import { usePhotoDb } from '~/composables/usePhotoDb'

const STORAGE_KEY = 'listing-draft:v1'

export const emptyListingDraft = (): IListingDraft => ({
  title: '',
  region: null,
  photos: [],
  description: '',
  tasks: [],
  capacity: '',
  whatsapp: ''
})

export const useListingDraftStore = defineStore('listingDraft', {
  state: () => ({
    draft: emptyListingDraft(),
    // Solo en memoria: la pantalla de confirmación lo lee y, si se recarga,
    // no hay nada que confirmar.
    published: null as IListing | null,
    // El alojamiento se publica igual aunque falle la subida de las fotos
    // (Listing.md § Fotos, opción B): esto es lo que distingue el mensaje.
    photosFailed: false
  }),

  actions: {
    update(patch: Partial<IListingDraft>) {
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
        const empty = emptyListingDraft()
        const stored = JSON.parse(raw)
        this.draft = {
          ...empty,
          ...stored,
          // Un campo que no sea array tumbaría cualquier .length o .includes.
          photos: Array.isArray(stored.photos) ? stored.photos : empty.photos,
          tasks: Array.isArray(stored.tasks) ? stored.tasks : empty.tasks,
          // Los borradores antiguos guardaban la capacidad como número.
          capacity: stored.capacity == null ? '' : String(stored.capacity)
        }
      } catch (error) {
        console.error('Unable to parse listing draft from localStorage', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    },

    async publish() {
      let listing: IListing
      try {
        const { $services } = useNuxtApp()
        listing = await ($services as IServicesInstance).listing.create(
          toCreateInput(this.draft)
        )
      } catch (error) {
        console.error('Unable to publish the listing', error)
        Sentry.captureException(error)
        throw error
      }

      // A partir de aquí el alojamiento ya existe: un fallo en las fotos no
      // debe volver a intentar crearlo, así que no se relanza el error.
      this.published = listing
      this.photosFailed = false
      const photoIds = [...this.draft.photos]

      if (photoIds.length > 0) {
        try {
          const { uploadListingPhotos } = useListingPhotoUpload()
          const updated = await uploadListingPhotos(listing.id, photoIds)
          if (updated) this.published = updated
        } catch (photoError) {
          console.error('Unable to upload the listing photos', photoError)
          Sentry.captureException(photoError)
          this.photosFailed = true
        }
      }

      this.reset()
      return this.published
    },

    reset() {
      this.draft = emptyListingDraft()
      if (!import.meta.client) return

      localStorage.removeItem(STORAGE_KEY)
      // Este almacén de IndexedDB es solo del borrador de Publicar: vaciarlo
      // entero no se lleva por delante nada de otro flujo.
      usePhotoDb()
        .clearPhotos()
        .catch((error) => {
          console.error('Unable to clear the listing photos', error)
          Sentry.captureException(error)
        })
    }
  }
})
