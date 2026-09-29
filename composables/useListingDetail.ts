import type { IListingDetail, IServicesInstance } from '~/core/types'

type Status = 'loading' | 'ready' | 'not-found' | 'error'

export const useListingDetail = (listingId: string) => {
  const { $services } = useNuxtApp()

  const listing = ref<IListingDetail | null>(null)
  const status = ref<Status>('loading')

  const load = async () => {
    status.value = 'loading'
    try {
      listing.value = await ($services as IServicesInstance).listing.get(
        listingId
      )
      status.value = 'ready'
    } catch (error) {
      const code = (error as { response?: { status?: number } }).response
        ?.status
      status.value = code === 404 ? 'not-found' : 'error'
    }
  }

  return { listing, status, load }
}
