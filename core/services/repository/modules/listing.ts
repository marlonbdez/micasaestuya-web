import FetchFactory from '../fetchFactory'
import type {
  IListing,
  IListingCreateInput,
  IListingModule
} from '~/core/types'

export default class ListingModule
  extends FetchFactory
  implements IListingModule
{
  // SERVICIO SIMULADO: todavía no existe POST /api/listings
  // (micasaestuya-docs/Listing.md). El día que exista, el cuerpo entero se
  // sustituye por:
  //   return await this.call<IListing>('POST', 'listings', input, {
  //     headers: this.authHeaders
  //   })
  async create(input: IListingCreateInput): Promise<IListing> {
    return await Promise.resolve({
      ...input,
      id: `mock-${Date.now()}`,
      owner: this.store.user?.id ?? 'mock-owner',
      photos: [],
      createdAt: new Date().toISOString()
    })
  }
}
