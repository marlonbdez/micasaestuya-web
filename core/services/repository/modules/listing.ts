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
  private resource = 'listings'

  // Contrato en micasaestuya-docs/Listing.md. Requiere sesión: el dueño del
  // alojamiento lo pone la API a partir del token.
  async create(input: IListingCreateInput): Promise<IListing> {
    return await this.call<IListing>('POST', this.resource, input, {
      headers: this.authHeaders
    })
  }
}
