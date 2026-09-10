import type { IServicesInstance } from '~/core/types'
import type { IRegion, LevelType } from '~/core/types/region'

const MIN_SEARCH_LENGTH = 3
const DEBOUNCE_DELAY = 200

export type HighlightSegment = {
  text: string
  isMarked: boolean
}

// El backend envuelve la coincidencia en <b> (y a veces <mark>). Se trocea
// en segmentos en vez de inyectarlo con v-html: pintar HTML del servidor
// sería una vía de XSS.
export const parseHighlightedText = (
  highlightedText?: string
): HighlightSegment[] => {
  if (!highlightedText) return []

  const segments: HighlightSegment[] = []
  const markRegex = /<(?:mark|b)>(.*?)<\/(?:mark|b)>/gi
  let lastIndex = 0
  let match: RegExpExecArray | null = null

  while ((match = markRegex.exec(highlightedText)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: highlightedText.slice(lastIndex, match.index),
        isMarked: false
      })
    }
    segments.push({ text: match[1], isMarked: true })
    lastIndex = markRegex.lastIndex
  }

  if (lastIndex < highlightedText.length) {
    segments.push({ text: highlightedText.slice(lastIndex), isMarked: false })
  }

  return segments
}

export const useRegionSuggest = (levelType?: LevelType) => {
  const { locale } = useI18n()
  const { $services } = useNuxtApp()

  const term = ref('')
  const options = ref<IRegion[]>([])
  const isLoading = ref(false)
  const showOptions = ref(false)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let isRequestBlocked = false
  let skipNextSearch = false

  const hasOptions = computed(() => options.value.length > 0)
  const countryCode = computed(() => locale.value.split('-')[1])

  const search = async (value: string): Promise<void> => {
    if (value.length < MIN_SEARCH_LENGTH) {
      options.value = []
      showOptions.value = false
      return
    }

    // Si ya hay una petición en vuelo, se marca y se relanza al terminar con
    // el término más reciente, en vez de encadenar peticiones.
    if (isLoading.value) {
      isRequestBlocked = true
      return
    }

    isRequestBlocked = false
    isLoading.value = true

    try {
      options.value = await ($services as IServicesInstance).region.suggest(
        value,
        countryCode.value,
        levelType
      )
      showOptions.value = hasOptions.value
    } catch (error) {
      console.error('Unable to fetch regions', error)
    } finally {
      isLoading.value = false
      if (isRequestBlocked) search(term.value)
    }
  }

  const onTermChange = (value: string): void => {
    // Escribir el nombre de la opción elegida en el campo no debe relanzar
    // la búsqueda: dejaría el desplegable abierto justo tras seleccionar.
    if (skipNextSearch) {
      skipNextSearch = false
      return
    }
    if (!value) {
      showOptions.value = false
      return
    }
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => search(value), DEBOUNCE_DELAY)
  }

  const setTerm = (value: string): void => {
    skipNextSearch = true
    term.value = value
  }

  const optionAt = (index?: string): IRegion | undefined =>
    index ? options.value[Number(index)] : options.value[0]

  const clearOptions = (): void => {
    options.value = []
    showOptions.value = false
  }

  watch(term, onTermChange)

  onScopeDispose(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  return {
    term,
    setTerm,
    options,
    isLoading,
    showOptions,
    hasOptions,
    optionAt,
    clearOptions
  }
}
