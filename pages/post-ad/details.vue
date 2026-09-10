<script setup lang="ts">
import { number, object } from 'yup'
import { useForm } from 'vee-validate'
import { OperationType } from '@/core/types'
import { useAdFlowStore } from '~/stores/adFlow'

defineI18nRoute({
  paths: {
    'es-CU': '/publicar-anuncio/detalles',
    'es-DO': '/publicar-anuncio/detalles',
    'en-CU': '/post-ad/details',
    'en-DO': '/post-ad/details'
  }
})

const { t } = useI18n()
const adFlowStore = useAdFlowStore()

const emptyToNull = (value: number, original: unknown) =>
  original === '' || original === null ? null : value

const validationSchema = object({
  price: number()
    .transform(emptyToNull)
    .nullable()
    .typeError(() => t('post_ad.details.errors.number'))
    .required(() => t('post_ad.details.errors.price_required'))
    .positive(() => t('post_ad.details.errors.price_positive')),
  surface: number()
    .transform(emptyToNull)
    .nullable()
    .typeError(() => t('post_ad.details.errors.number'))
    .required(() => t('post_ad.details.errors.surface_required'))
    .positive(() => t('post_ad.details.errors.surface_positive')),
  bedrooms: number()
    .transform(emptyToNull)
    .nullable()
    .typeError(() => t('post_ad.details.errors.number'))
    .integer(() => t('post_ad.details.errors.rooms_integer'))
    .positive(() => t('post_ad.details.errors.rooms_positive')),
  bathrooms: number()
    .transform(emptyToNull)
    .nullable()
    .typeError(() => t('post_ad.details.errors.number'))
    .integer(() => t('post_ad.details.errors.rooms_integer'))
    .positive(() => t('post_ad.details.errors.rooms_positive'))
})

const toInput = (value: number | null) => (value === null ? '' : String(value))

const toDraft = (value: string) => {
  const parsed = Number(value)
  return value === '' || Number.isNaN(parsed) ? null : parsed
}

const { errors, values, defineField } = useForm({
  validationSchema,
  initialValues: {
    price: toInput(adFlowStore.draft.details.price),
    surface: toInput(adFlowStore.draft.details.surface),
    bedrooms: toInput(adFlowStore.draft.details.bedrooms),
    bathrooms: toInput(adFlowStore.draft.details.bathrooms)
  }
})

const [price, priceAttrs] = defineField('price')
const [surface, surfaceAttrs] = defineField('surface')
const [bedrooms, bedroomsAttrs] = defineField('bedrooms')
const [bathrooms, bathroomsAttrs] = defineField('bathrooms')

watch(
  values,
  (current) =>
    adFlowStore.update({
      details: {
        price: toDraft(current.price),
        surface: toDraft(current.surface),
        bedrooms: toDraft(current.bedrooms),
        bathrooms: toDraft(current.bathrooms)
      }
    }),
  { deep: true }
)

const operationKey = computed(() =>
  (adFlowStore.draft.operation ?? OperationType.Sale).toLowerCase()
)
</script>

<template>
  <section class="details-step">
    <h1 class="details-step__title">
      {{ t('post_ad.details.title') }}
    </h1>

    <div class="details-step__fields">
      <BaseInput
        id="ad-price"
        v-model="price"
        v-bind="priceAttrs"
        type="number"
        :label="t(`post_ad.basic_info.price_label.${operationKey}`)"
        :placeholder="t(`post_ad.basic_info.price_placeholder.${operationKey}`)"
        :error-message="errors?.price"
      />
      <BaseInput
        id="ad-surface"
        v-model="surface"
        v-bind="surfaceAttrs"
        type="number"
        :label="t('post_ad.details.surface_label')"
        :placeholder="t('post_ad.details.surface_placeholder')"
        :error-message="errors?.surface"
      />

      <div class="details-step__pair">
        <BaseInput
          id="ad-bedrooms"
          v-model="bedrooms"
          v-bind="bedroomsAttrs"
          type="number"
          :label="t('post_ad.details.bedrooms_label')"
          :placeholder="t('post_ad.details.bedrooms_placeholder')"
          :error-message="errors?.bedrooms"
        />
        <BaseInput
          id="ad-bathrooms"
          v-model="bathrooms"
          v-bind="bathroomsAttrs"
          type="number"
          :label="t('post_ad.details.bathrooms_label')"
          :placeholder="t('post_ad.details.bathrooms_placeholder')"
          :error-message="errors?.bathrooms"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// El ancho y el centrado los pone pages/post-ad.vue.
.details-step {
  &__title {
    @include font-outfit-semibold;
    font-size: $font-size-lg;
    margin: 0 0 $gap-extra-medium;
  }

  &__fields {
    display: flex;
    flex-direction: column;
    // El mensaje de error de BaseInput está posicionado en absoluto y no ocupa
    // sitio: sin este hueco taparía el campo de debajo al aparecer.
    gap: $gap-extra-medium;
  }

  &__pair {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(px-to-rem(140), 1fr));
    gap: $gap-medium;
  }
}
</style>
