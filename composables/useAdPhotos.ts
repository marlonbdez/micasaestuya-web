import * as Sentry from '@sentry/nuxt'
import { useAdFlowStore } from '~/stores/adFlow'

export interface IAdPhotoPreview {
  id: string
  url: string
}

const MAX_PHOTOS = 10

export const useAdPhotos = () => {
  const adFlowStore = useAdFlowStore()
  const { savePhoto, getPhoto, deletePhoto } = usePhotoDb()
  const { resizeImage } = useImageResize()

  const previews = ref<IAdPhotoPreview[]>([])
  const isSaving = ref(false)
  const errorKey = ref('')

  const canAddMore = computed(() => previews.value.length < MAX_PHOTOS)

  // Guardar y leer son asíncronos: si el usuario cambia de paso mientras tanto,
  // las URLs que se crearan después ya no las revocaría nadie.
  let isMounted = true

  const load = async () => {
    let stored

    try {
      stored = await Promise.all(
        adFlowStore.draft.photos.map(async (id) => ({
          id,
          photo: await getPhoto(id)
        }))
      )
    } catch (error) {
      // A Sentry porque es un fallo del navegador del usuario que no se
      // reproduce aquí: sin esto no hay forma de saber a cuántos les pasa.
      console.error('Unable to read the photos', error)
      Sentry.captureException(error)
      errorKey.value = 'post_ad.photos.errors.storage'
      return
    }

    if (!isMounted) return

    previews.value = stored.flatMap(({ id, photo }) =>
      photo ? [{ id, url: URL.createObjectURL(photo) }] : []
    )

    // Un id sin fichero es un borrador de otro navegador: se cae el id, o
    // canGoNext dejaría avanzar con fotos que no existen.
    if (previews.value.length !== adFlowStore.draft.photos.length) {
      adFlowStore.update({
        photos: previews.value.map((preview) => preview.id)
      })
    }
  }

  const add = async (files: File[]) => {
    errorKey.value = ''

    const images = files.filter((file) => file.type.startsWith('image/'))
    if (images.length !== files.length) {
      errorKey.value = 'post_ad.photos.errors.not_an_image'
    }

    const room = Math.max(MAX_PHOTOS - previews.value.length, 0)
    if (images.length > room) {
      errorKey.value = 'post_ad.photos.errors.too_many'
    }

    isSaving.value = true
    let failed = 0

    // De una en una: diez canvas a la vez disparan la memoria en un móvil.
    for (const file of images.slice(0, room)) {
      // El try va por foto, no por lote: un HEIC que el navegador no sabe
      // decodificar no puede llevarse por delante a las que vienen detrás.
      try {
        const photo = await resizeImage(file)
        const id = await savePhoto(photo)

        adFlowStore.update({ photos: [...adFlowStore.draft.photos, id] })
        if (isMounted) {
          previews.value.push({ id, url: URL.createObjectURL(photo) })
        }
      } catch (error) {
        console.error('Unable to store the photo', error)
        Sentry.captureException(error)
        failed += 1
      }
    }

    isSaving.value = false
    if (failed) errorKey.value = 'post_ad.photos.errors.unreadable'
  }

  const remove = async (id: string) => {
    const preview = previews.value.find((entry) => entry.id === id)
    if (preview) URL.revokeObjectURL(preview.url)

    previews.value = previews.value.filter((entry) => entry.id !== id)
    adFlowStore.update({
      photos: adFlowStore.draft.photos.filter((photoId) => photoId !== id)
    })

    try {
      await deletePhoto(id)
    } catch (error) {
      console.error('Unable to delete the photo', error)
      Sentry.captureException(error)
    }
  }

  // createObjectURL reserva memoria hasta que se revoca a mano.
  onBeforeUnmount(() => {
    isMounted = false
    previews.value.forEach((preview) => URL.revokeObjectURL(preview.url))
  })

  return {
    previews,
    isSaving,
    errorKey,
    canAddMore,
    maxPhotos: MAX_PHOTOS,
    load,
    add,
    remove
  }
}
