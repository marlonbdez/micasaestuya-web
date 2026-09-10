import type { ComputedRef } from 'vue'
import type { ISearchParams } from '@/core/types'
import type { Option } from '@/core/types/dropdown'

const POPULAR_DESTINATIONS = [
  { flag: '🇨🇺', name: 'La Habana', slug: 'la-habana', country: 'Cuba' },
  { flag: '🇨🇺', name: 'Trinidad', slug: 'trinidad', country: 'Cuba' },
  {
    flag: '🇩🇴',
    name: 'Las Terrenas',
    slug: 'las-terrenas',
    country: 'Rep. Dominicana'
  },
  { flag: '🇲🇽', name: 'Tulum', slug: 'tulum', country: 'México' },
  { flag: '🇵🇷', name: 'San Juan', slug: 'san-juan', country: 'Puerto Rico' }
]

/**
 * Estado y opciones del selector de huéspedes. Sincroniza params.guests
 * cada vez que cambia la selección.
 */
const useGuestSelector = (params: ISearchParams) => {
  const { t } = useI18n()
  const selectedGuestId = ref<string>('1')

  const guestOptions = computed<Option<number>[]>(() => [
    { id: '1', value: t('search.vacation.guests.one') },
    { id: '2', value: t('search.vacation.guests.two') },
    { id: '3', value: t('search.vacation.guests.three_four') },
    { id: '5', value: t('search.vacation.guests.five_plus') }
  ])

  const selectedGuestLabel = computed(() => {
    const found = guestOptions.value.find((o) => o.id === selectedGuestId.value)
    return found?.value ?? t('search.vacation.guests.placeholder')
  })

  const onGuestSelect = (id: string) => {
    selectedGuestId.value = id
  }

  watch(selectedGuestId, (id) => {
    params.guests = Number(id)
  })

  return { selectedGuestId, guestOptions, selectedGuestLabel, onGuestSelect }
}

/**
 * Destinos populares (chips) y acción de selección rápida de destino.
 */
const useDestinationSearch = (params: ISearchParams) => {
  const selectDestination = (name: string) => {
    params.destination = name
  }

  return {
    popularDestinations: computed(() => POPULAR_DESTINATIONS),
    selectDestination
  }
}

/**
 * Validación del formulario: destino, ambas fechas y checkOut > checkIn.
 */
const useSearchValidation = (params: ISearchParams) =>
  computed(
    () =>
      !!params.destination.trim() &&
      !!params.checkIn &&
      !!params.checkOut &&
      params.checkOut > params.checkIn
  )

/**
 * Navegación a /properties con los parámetros de búsqueda, si son válidos.
 */
const useSearchSubmit = (
  params: ISearchParams,
  isValid: ComputedRef<boolean>
) => {
  const { locale } = useI18n()

  const submit = () => {
    if (!isValid.value) return
    navigateTo({
      path: `/${locale.value}/properties`,
      query: { ...toRaw(params) }
    })
  }

  return { submit }
}

/**
 * Composable para el buscador vacacional (hero homepage).
 * Encapsula estado, opciones i18n y lógica de navegación.
 * No contiene ningún HTML ni lógica visual — eso es responsabilidad del componente.
 */
export const useVacationSearch = () => {
  const params = reactive<ISearchParams>({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  })

  const { selectedGuestId, guestOptions, selectedGuestLabel, onGuestSelect } =
    useGuestSelector(params)
  const { popularDestinations, selectDestination } =
    useDestinationSearch(params)
  const isValid = useSearchValidation(params)
  const { submit } = useSearchSubmit(params, isValid)

  return {
    params,
    guestOptions,
    popularDestinations,
    selectedGuestId,
    selectedGuestLabel,
    isValid,
    selectDestination,
    onGuestSelect,
    submit
  }
}
