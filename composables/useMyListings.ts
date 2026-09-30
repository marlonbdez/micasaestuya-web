import type { IListingCard, IServicesInstance } from '~/core/types'

type Status = 'loading' | 'ready' | 'error'

export const useMyListings = () => {
  const { $services } = useNuxtApp()
  const listing = () => ($services as IServicesInstance).listing

  const items = ref<IListingCard[]>([])
  const status = ref<Status>('loading')

  const load = async () => {
    status.value = 'loading'
    try {
      items.value = await listing().mine()
      status.value = 'ready'
    } catch (error) {
      console.error('Unable to fetch my listings', error)
      status.value = 'error'
    }
  }

  const remove = async (listingId: string) => {
    await listing().remove(listingId)
    items.value = items.value.filter(({ id }) => id !== listingId)
  }

  return { items, status, load, remove }
}
