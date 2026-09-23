import type { IServicesInstance, IAdRegion } from '~/core/types'
import type { IRegionNode } from '~/core/types/region'

// La cascada es un array de niveles, no tres variables numeradas:
//   selected[i]  → lo elegido en el nivel i
//   options[i]   → las opciones que se pintan en el nivel i
// Un nivel solo existe si su padre tiene hijos, así que la longitud de
// `options` es también cuántos desplegables hay que pintar.
export const useRegionCascade = () => {
  const { locale } = useI18n()
  const { $services } = useNuxtApp()

  const selected = ref<string[]>([])
  const options = ref<IRegionNode[][]>([])

  const countryCode = computed(() => locale.value.split('-')[1])

  const fetchChildren = async (parents: string[]): Promise<IRegionNode[]> => {
    try {
      return await ($services as IServicesInstance).region.children(
        countryCode.value,
        parents
      )
    } catch (error) {
      console.error('Unable to fetch regions', error)
      return []
    }
  }

  const toRegion = (): IAdRegion | null => {
    if (!selected.value.length) return null
    const [level1, level2 = null, level3 = null] = selected.value
    return {
      term: selected.value.join(', '),
      country_code: countryCode.value,
      level1,
      level2,
      level3,
      level_type: selected.value.length
    }
  }

  // Truncar en vez de limpiar nivel a nivel: elegir en el nivel i invalida
  // todo lo que cuelga de él, tanto lo elegido como sus listas.
  const select = async (index: number, value: string) => {
    selected.value = [...selected.value.slice(0, index), value].filter(Boolean)
    options.value = options.value.slice(0, index + 1)

    // Volver a "Selecciona" solo recorta: pedir hijos aquí devolvería los del
    // nivel de arriba y pintaría un desplegable repetido debajo.
    if (!value) return toRegion()

    const children = await fetchChildren(selected.value)
    if (children.length) options.value.push(children)

    return toRegion()
  }

  // Rehidrata la cascada desde un borrador: para que un desplegable muestre
  // lo elegido, antes tiene que contenerlo entre sus opciones.
  const restore = async (region: IAdRegion | null) => {
    options.value = [await fetchChildren([])]
    selected.value = []

    const levels = [region?.level1, region?.level2, region?.level3].filter(
      Boolean
    ) as string[]

    for (const level of levels) {
      selected.value.push(level)
      const children = await fetchChildren(selected.value)
      if (!children.length) break
      options.value.push(children)
    }
  }

  return { selected, options, select, restore }
}
