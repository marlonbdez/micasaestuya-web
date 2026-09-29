import type { IListingCard, IServicesInstance } from '~/core/types'

export const useListingExplore = () => {
  const { $services } = useNuxtApp()

  const items = ref<IListingCard[]>([])
  const total = ref(0)
  const page = ref(0)
  const loading = ref(false)
  const failed = ref(false)

  const hasMore = computed(
    () => page.value === 0 || items.value.length < total.value
  )

  const loadMore = async () => {
    if (loading.value) return
    loading.value = true
    failed.value = false
    try {
      const result = await ($services as IServicesInstance).listing.list(
        page.value + 1
      )
      const known = new Set(items.value.map(({ id }) => id))
      items.value.push(...result.items.filter(({ id }) => !known.has(id)))
      total.value = result.total
      page.value += 1
    } catch (error) {
      console.error('Unable to fetch listings', error)
      failed.value = true
    } finally {
      loading.value = false
    }
  }

  return { items, loading, failed, hasMore, loadMore }
}
