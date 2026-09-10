import type { ISearchParams } from '~/core/types'

export interface PopularDestination {
  flag: string
  name: string
  country: string
}

export interface GuestOption {
  label: string
  value: number
}

// Destination names are international proper nouns — no i18n needed
const POPULAR_DESTINATIONS: PopularDestination[] = [
  { flag: '🇨🇺', name: 'La Habana', country: 'Cuba' },
  { flag: '🇨🇺', name: 'Trinidad', country: 'Cuba' },
  { flag: '🇩🇴', name: 'Las Terrenas', country: 'Rep. Dominicana' },
  { flag: '🇲🇽', name: 'Tulum', country: 'México' },
  { flag: '🇵🇷', name: 'San Juan', country: 'Puerto Rico' }
]

const buildGuestOptions = (
  t: ReturnType<typeof useI18n>['t']
): GuestOption[] => [
  { label: t('search.guests.one'), value: 1 },
  { label: t('search.guests.two'), value: 2 },
  { label: t('search.guests.three_four'), value: 3 },
  { label: t('search.guests.five_plus'), value: 5 }
]

export const useVacationalSearch = () => {
  const { t } = useI18n()
  const searchParams = ref<ISearchParams>({
    destination: '',
    checkIn: null,
    checkOut: null,
    guests: 1
  })
  const guestOptions = computed<GuestOption[]>(() => buildGuestOptions(t))
  const selectDestination = (name: string) => {
    searchParams.value.destination = name
  }
  const handleSearch = () => {
    if (!searchParams.value.destination) return
    navigateTo({ path: '/properties', query: { ...searchParams.value } })
  }
  return {
    searchParams,
    popularDestinations: POPULAR_DESTINATIONS,
    guestOptions,
    selectDestination,
    handleSearch
  }
}
