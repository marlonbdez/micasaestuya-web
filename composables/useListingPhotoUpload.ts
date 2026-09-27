import type { IListing, IServicesInstance } from '~/core/types'

// PUT directo a la URL firmada de R2: no pasa por nuestra api ni lleva sesión.
const uploadToR2 = async (url: string, blob: Blob) => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': blob.type },
    body: blob
  })
  if (!response.ok) {
    throw new Error(`Unable to upload the photo to R2 (${response.status})`)
  }
}

export const useListingPhotoUpload = () => {
  const { getPhoto } = usePhotoDb()

  // Sube a R2 las fotos del borrador que ya están en IndexedDB y las
  // confirma en la api. Si algo falla a medio camino, el alojamiento ya
  // existe sin fotos: no se reintenta ni se borra (Listing.md § Fotos).
  const uploadListingPhotos = async (
    listingId: string,
    photoIds: string[]
  ): Promise<IListing | null> => {
    const { $services } = useNuxtApp()
    const listingModule = ($services as IServicesInstance).listing

    const stored = await Promise.all(
      photoIds.map(async (id) => ({
        photo: await getPhoto(id),
        thumbnail: await getPhoto(`${id}-thumb`)
      }))
    )
    // Un id sin fichero es un borrador roto (huella de otro navegador, por
    // ejemplo): se salta en vez de tumbar la subida entera.
    const ready = stored.filter(
      (entry): entry is { photo: Blob; thumbnail: Blob } =>
        !!entry.photo && !!entry.thumbnail
    )
    if (ready.length === 0) return null

    const uploads = await listingModule.requestPhotoUploads(
      listingId,
      ready.map(({ photo }) => ({ contentType: photo.type }))
    )

    await Promise.all(
      uploads.map((upload, index) =>
        Promise.all([
          uploadToR2(upload.uploadUrl, ready[index].photo),
          uploadToR2(upload.thumbUploadUrl, ready[index].thumbnail)
        ])
      )
    )

    return listingModule.confirmPhotos(
      listingId,
      uploads.map((upload) => upload.photoId)
    )
  }

  return { uploadListingPhotos }
}
