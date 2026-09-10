<script setup lang="ts">
import { object, string } from 'yup'
import { useForm } from 'vee-validate'
import type { IAdAddress, IAdRegion } from '~/core/types'
import { useAdFlowStore } from '~/stores/adFlow'

defineI18nRoute({
  paths: {
    'es-CU': '/publicar-anuncio/ubicacion',
    'es-DO': '/publicar-anuncio/ubicacion',
    'en-CU': '/post-ad/address',
    'en-DO': '/post-ad/address'
  }
})

const { t } = useI18n()
const adFlowStore = useAdFlowStore()

// Los tres campos escriben en la misma rama del borrador, así que el parche
// se arma sobre la dirección actual: sin el spread, guardar la calle
// borraría la región ya elegida.
const update = (patch: Partial<IAdAddress>) =>
  adFlowStore.update({ address: { ...adFlowStore.draft.address, ...patch } })

const region = computed({
  get: () => adFlowStore.draft.address.region,
  set: (value: IAdRegion | null) => update({ region: value })
})

const { errors, defineField } = useForm({
  validationSchema: object({
    street: string()
      .trim()
      .required(() => t('post_ad.address.errors.street_required'))
  }),
  initialValues: { street: adFlowStore.draft.address.street }
})

const [street, streetAttrs] = defineField('street')

watch(street, (value) => update({ street: value }))

const streetNumber = computed({
  get: () => adFlowStore.draft.address.streetNumber,
  set: (value: string) => update({ streetNumber: value })
})
</script>

<template>
  <section class="address-step">
    <h1 class="address-step__title">
      {{ t('post_ad.address.title') }}
    </h1>

    <div class="address-step__fields">
      <RegionCascade v-model="region" />
      <BaseInput
        id="ad-street"
        v-model="street"
        v-bind="streetAttrs"
        :label="t('post_ad.address.street_label')"
        :placeholder="t('post_ad.address.street_placeholder')"
        :error-message="errors?.street"
        @focusout="streetAttrs.onBlur"
      />
      <BaseInput
        id="ad-street-number"
        v-model="streetNumber"
        :label="t('post_ad.address.number_label')"
        :placeholder="t('post_ad.address.number_placeholder')"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
// El ancho y el centrado los pone pages/post-ad.vue.
.address-step {
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
}
</style>
