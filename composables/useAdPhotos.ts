import { useAdFlowStore } from '~/stores/adFlow'
import type { IDraftPhotoPreview } from '~/composables/useDraftPhotos'

// El flow de /post-ad (modelo anterior al pivote). La lógica vive en
// useDraftPhotos; aquí solo se conecta al store adFlow y se mantienen las claves
// de i18n de post_ad.
export type IAdPhotoPreview = IDraftPhotoPreview

const MAX_PHOTOS = 10

export const useAdPhotos = () => {
  const adFlowStore = useAdFlowStore()

  const { error, ...photos } = useDraftPhotos({
    getIds: () => adFlowStore.draft.photos,
    setIds: (ids) => adFlowStore.update({ photos: ids }),
    max: MAX_PHOTOS
  })

  const errorKey = computed(() =>
    error.value ? `post_ad.photos.errors.${error.value}` : ''
  )

  return { ...photos, errorKey, maxPhotos: MAX_PHOTOS }
}
