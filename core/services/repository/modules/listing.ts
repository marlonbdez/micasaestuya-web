import FetchFactory from '../fetchFactory'
import type {
  IListing,
  IListingCreateInput,
  IListingModule,
  IPhotoUpload,
  IPhotoUploadRequest
} from '~/core/types'

export default class ListingModule
  extends FetchFactory
  implements IListingModule
{
  private resource = 'listings'

  // Contrato en micasaestuya-docs/Listing.md. Requiere sesión: el dueño del
  // alojamiento lo pone la API a partir del token.
  async create(input: IListingCreateInput): Promise<IListing> {
    return await this.call<IListing>('POST', this.resource, input, {
      headers: this.authHeaders
    })
  }

  // Pide URLs firmadas de R2 para subir cada foto y su miniatura directo,
  // sin pasar por la api (Listing.md § Fotos).
  async requestPhotoUploads(
    listingId: string,
    photos: IPhotoUploadRequest[]
  ): Promise<IPhotoUpload[]> {
    const { uploads } = await this.call<{ uploads: IPhotoUpload[] }>(
      'POST',
      `${this.resource}/${listingId}/photos`,
      { photos },
      { headers: this.authHeaders }
    )
    return uploads
  }

  // Tras subir los ficheros a R2, la api los comprueba y guarda sus URLs.
  async confirmPhotos(
    listingId: string,
    photoIds: string[]
  ): Promise<IListing> {
    return await this.call<IListing>(
      'POST',
      `${this.resource}/${listingId}/photos/confirm`,
      { photoIds },
      { headers: this.authHeaders }
    )
  }
}
