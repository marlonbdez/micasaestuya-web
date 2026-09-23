import { defineStore } from 'pinia'
import * as Sentry from '@sentry/nuxt'
import type {
  IListing,
  IListingCreateInput,
  IListingDraft,
  IServicesInstance
} from '@/core/types'
import { usePhotoDb } from '~/composables/usePhotoDb'

const STORAGE_KEY = 'listing-draft:v1'

export const emptyListingDraft = (): IListingDraft => ({
  title: '',
  region: null,
  photos: [],
  description: '',
  tasks: [],
  capacity: null,
  whatsapp: ''
})

// El borrador admite huecos (región sin elegir, capacidad vacía); lo que se
// envía, no. Si falta algo, es que alguien llamó a publicar sin validar.
export const toCreateInput = (draft: IListingDraft): IListingCreateInput => {
  if (!draft.region || draft.capacity === null) {
    throw new Error('The listing draft is incomplete')
  }

  return {
    title: draft.title.trim(),
    region: draft.region,
    description: draft.description.trim(),
    tasks: [...draft.tasks],
    capacity: draft.capacity,
    // Espacios y guiones fuera: el número tiene que servir tal cual para
    // abrir un chat de WhatsApp.
    whatsapp: draft.whatsapp.replace(/[\s-]/g, '')
  }
}

export const useListingDraftStore = defineStore('listingDraft', {
  state: () => ({
    draft: emptyListingDraft(),
    // Solo en memoria: la pantalla de confirmación lo lee y, si se recarga,
    // no hay nada que confirmar.
    published: null as IListing | null
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
          tasks: Array.isArray(stored.tasks) ? stored.tasks : empty.tasks
        }
      } catch (error) {
        console.error('Unable to parse listing draft from localStorage', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    },

    async publish() {
      try {
        const { $services } = useNuxtApp()
        const listing = await ($services as IServicesInstance).listing.create(
          toCreateInput(this.draft)
        )
        this.published = listing
        this.reset()
        return listing
      } catch (error) {
        console.error('Unable to publish the listing', error)
        Sentry.captureException(error)
        throw error
      }
    },

    reset() {
      const photoIds = this.draft.photos
      this.draft = emptyListingDraft()
      if (!import.meta.client) return

      localStorage.removeItem(STORAGE_KEY)
      // Se borran una a una y no con clearPhotos(): el almacén de IndexedDB es
      // el mismo que usa /post-ad, y vaciarlo entero se llevaría sus fotos.
      const { deletePhoto } = usePhotoDb()
      Promise.all(photoIds.map((id) => deletePhoto(id))).catch((error) => {
        console.error('Unable to clear the listing photos', error)
        Sentry.captureException(error)
      })
    }
  }
})
