import { mixed, number, object, string, array } from 'yup'
import type { AnyObject, ObjectShape } from 'yup'
import { useForm } from 'vee-validate'
import { CollaborationTask } from '~/core/types'
import type { IAdRegion } from '~/core/types'

export const TITLE_MAX = 100
export const CAPACITY_MIN = 1
export const CAPACITY_MAX = 20
export const MAX_PHOTOS = 10
// "+", código de país y el número; se admiten espacios y guiones al escribir.
const WHATSAPP_PATTERN = /^\+[1-9][\d\s-]{6,18}\d$/

// En el orden en que salen en pantalla: el primero con error es el que se
// enseña. Los de fotos y términos solo existen en Publicar.
const FIELD_IDS: Record<string, string> = {
  title: 'listing-title',
  region: 'ad-region-1',
  photos: 'listing-photos',
  description: 'listing-description',
  tasks: `listing-task-${Object.values(CollaborationTask)[0]}`,
  capacity: 'listing-capacity',
  whatsapp: 'listing-whatsapp',
  accepted: 'listing-terms'
}

export interface IListingFormValues {
  title: string
  region: IAdRegion | null
  description: string
  tasks: CollaborationTask[]
  // BaseInput trabaja con texto, también con type="number".
  capacity: string
  whatsapp: string
}

// Los campos de Publicar y de Editar son los mismos; lo que cambia (fotos,
// términos) entra por `extra`.
export const useListingForm = (
  initialValues: IListingFormValues,
  extra: { schema?: ObjectShape; values?: AnyObject } = {}
) => {
  const { t } = useI18n()

  // Lo decide RegionCascade (evento `complete`): la región sola no dice si
  // quedaban niveles por elegir.
  const isRegionComplete = ref(false)

  const capacityRangeMessage = () =>
    t('publish_listing.errors.capacity_range', {
      min: CAPACITY_MIN,
      max: CAPACITY_MAX
    })

  const form = useForm({
    validationSchema: object({
      title: string()
        .trim()
        .required(() => t('publish_listing.errors.title_required'))
        .max(TITLE_MAX, () =>
          t('publish_listing.errors.title_max', { max: TITLE_MAX })
        ),
      region: mixed<IAdRegion>()
        .nullable()
        .test(
          'complete',
          () => t('publish_listing.errors.region_required'),
          (value) => !!value && isRegionComplete.value
        ),
      description: string()
        .trim()
        .required(() => t('publish_listing.errors.description_required')),
      tasks: array()
        .of(string())
        .min(1, () => t('publish_listing.errors.tasks_required')),
      capacity: number()
        .typeError(() => t('publish_listing.errors.capacity_required'))
        .required(() => t('publish_listing.errors.capacity_required'))
        .integer(() => capacityRangeMessage())
        .min(CAPACITY_MIN, () => capacityRangeMessage())
        .max(CAPACITY_MAX, () => capacityRangeMessage()),
      whatsapp: string()
        .trim()
        .required(() => t('publish_listing.errors.whatsapp_required'))
        .matches(WHATSAPP_PATTERN, () =>
          t('publish_listing.errors.whatsapp_invalid')
        ),
      ...extra.schema
    }),
    initialValues: { ...initialValues, ...extra.values }
  })

  // Al fallar la validación, se lleva al usuario al primer campo con error: en
  // móvil el botón queda muy lejos de lo que hay que arreglar.
  const focusFirstInvalid = (invalid: Record<string, string | undefined>) => {
    const first = Object.keys(FIELD_IDS).find((field) => invalid[field])
    if (!first) return
    const element = document.getElementById(FIELD_IDS[first])
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    element?.focus({ preventScroll: true })
  }

  return { ...form, isRegionComplete, focusFirstInvalid }
}
