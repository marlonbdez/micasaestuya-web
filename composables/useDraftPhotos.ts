import * as Sentry from '@sentry/nuxt'

// La versión genérica de useAdPhotos: la misma lógica (IndexedDB para los
// ficheros, el borrador solo guarda los ids), pero sin atarse a un store. Quien
// la usa le dice dónde leer y escribir los ids. useAdPhotos se queda como está
// mientras exista /post-ad.

export interface IDraftPhotoPreview {
  id: string
  url: string
}

export type DraftPhotoError =
  | 'storage'
  | 'not_an_image'
  | 'too_many'
  | 'unreadable'

interface IDraftPhotosOptions {
  getIds: () => string[]
  setIds: (ids: string[]) => void
  max: number
}

export const useDraftPhotos = ({
  getIds,
  setIds,
  max
}: IDraftPhotosOptions) => {
  const { savePhoto, getPhoto, deletePhoto } = usePhotoDb()
  const { resizeImage } = useImageResize()

  const previews = ref<IDraftPhotoPreview[]>([])
  const isSaving = ref(false)
  const error = ref<DraftPhotoError | null>(null)

  const canAddMore = computed(() => previews.value.length < max)

  // Guardar y leer son asíncronos: si el componente se desmonta mientras
  // tanto, las URLs que se crearan después ya no las revocaría nadie.
  let isMounted = true

  const load = async () => {
    const ids = getIds()
    let stored

    try {
      stored = await Promise.all(
        ids.map(async (id) => ({ id, photo: await getPhoto(id) }))
      )
    } catch (loadError) {
      console.error('Unable to read the photos', loadError)
      Sentry.captureException(loadError)
      error.value = 'storage'
      return
    }

    if (!isMounted) return

    previews.value = stored.flatMap(({ id, photo }) =>
      photo ? [{ id, url: URL.createObjectURL(photo) }] : []
    )

    // Un id sin fichero es un borrador de otro navegador: se cae el id.
    if (previews.value.length !== ids.length) {
      setIds(previews.value.map((preview) => preview.id))
    }
  }

  const add = async (files: File[]) => {
    error.value = null

    const images = files.filter((file) => file.type.startsWith('image/'))
    if (images.length !== files.length) error.value = 'not_an_image'

    const room = Math.max(max - previews.value.length, 0)
    if (images.length > room) error.value = 'too_many'

    isSaving.value = true
    let failed = 0

    // De una en una: diez canvas a la vez disparan la memoria en un móvil. Y
    // el try va por foto: una que no se pueda decodificar no tumba al resto.
    for (const file of images.slice(0, room)) {
      try {
        const photo = await resizeImage(file)
        const id = await savePhoto(photo)

        setIds([...getIds(), id])
        if (isMounted) {
          previews.value.push({ id, url: URL.createObjectURL(photo) })
        }
      } catch (saveError) {
        console.error('Unable to store the photo', saveError)
        Sentry.captureException(saveError)
        failed += 1
      }
    }

    isSaving.value = false
    if (failed) error.value = 'unreadable'
  }

  const remove = async (id: string) => {
    const preview = previews.value.find((entry) => entry.id === id)
    if (preview) URL.revokeObjectURL(preview.url)

    previews.value = previews.value.filter((entry) => entry.id !== id)
    setIds(getIds().filter((photoId) => photoId !== id))

    try {
      await deletePhoto(id)
    } catch (deleteError) {
      console.error('Unable to delete the photo', deleteError)
      Sentry.captureException(deleteError)
    }
  }

  // createObjectURL reserva memoria hasta que se revoca a mano.
  onBeforeUnmount(() => {
    isMounted = false
    previews.value.forEach((preview) => URL.revokeObjectURL(preview.url))
  })

  return { previews, isSaving, error, canAddMore, load, add, remove }
}
