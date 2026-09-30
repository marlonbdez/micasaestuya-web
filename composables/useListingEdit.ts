import type { IListingCreateInput, IServicesInstance } from '~/core/types'

const isNotFound = (error: unknown) =>
  (error as { response?: { status?: number } }).response?.status === 404

export const useListingEdit = (listingId: string) => {
  const { $services } = useNuxtApp()
  const listing = ($services as IServicesInstance).listing
  const { uploadListingPhotos } = useListingPhotoUpload()
  const { deletePhoto } = usePhotoDb()

  // Se puede repetir sin miedo si algo falla a medias: guardar los textos no
  // cambia nada la segunda vez, y una foto que ya no está no es un fallo.
  const save = async (
    input: IListingCreateInput,
    removedPhotoIds: string[],
    newPhotoIds: string[]
  ) => {
    await listing.update(listingId, input)

    for (const photoId of removedPhotoIds) {
      try {
        await listing.removePhoto(listingId, photoId)
      } catch (error) {
        if (!isNotFound(error)) throw error
      }
    }

    if (newPhotoIds.length === 0) return
    await uploadListingPhotos(listingId, newPhotoIds)
    await discardPhotos(newPhotoIds)
  }

  // Las fotos nuevas viven en el mismo almacén de IndexedDB que el borrador de
  // Publicar: se borran de una en una, nunca vaciándolo.
  const discardPhotos = async (ids: string[]) => {
    await Promise.all(
      ids.flatMap((id) => [deletePhoto(id), deletePhoto(`${id}-thumb`)])
    )
  }

  return { save, discardPhotos }
}
