import FetchFactory from '../fetchFactory'
import type {
  IListing,
  IListingCard,
  IListingCreateInput,
  IListingDetail,
  IListingModule,
  IListingPage,
  IPhotoUpload,
  IPhotoUploadRequest
} from '~/core/types'

export default class ListingModule
  extends FetchFactory
  implements IListingModule
{
  private resource = 'listings'

  // Lectura pública (Listing.md § Endpoints de lectura): sin token.
  async list(page: number): Promise<IListingPage> {
    return await this.call<IListingPage>('GET', `${this.resource}?page=${page}`)
  }

  // Con sesión: incluye los que aún no tienen fotos, que Explorar no muestra.
  async mine(): Promise<IListingCard[]> {
    return await this.call<IListingCard[]>(
      'GET',
      `${this.resource}/mine`,
      {},
      {
        headers: this.authHeaders
      }
    )
  }

  async get(listingId: string): Promise<IListingDetail> {
    return await this.call<IListingDetail>(
      'GET',
      `${this.resource}/${listingId}`
    )
  }

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

  async update(
    listingId: string,
    input: IListingCreateInput
  ): Promise<IListing> {
    return await this.call<IListing>(
      'PATCH',
      `${this.resource}/${listingId}`,
      input,
      { headers: this.authHeaders }
    )
  }

  async removePhoto(listingId: string, photoId: string): Promise<void> {
    await this.call(
      'DELETE',
      `${this.resource}/${listingId}/photos/${photoId}`,
      {},
      { headers: this.authHeaders }
    )
  }

  async remove(listingId: string): Promise<void> {
    await this.call(
      'DELETE',
      `${this.resource}/${listingId}`,
      {},
      {
        headers: this.authHeaders
      }
    )
  }
}
