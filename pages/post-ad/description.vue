<script setup lang="ts">
import { object, string } from 'yup'
import { useForm } from 'vee-validate'
import { useAdFlowStore } from '~/stores/adFlow'

defineI18nRoute({
  paths: {
    'es-CU': '/publicar-anuncio/descripcion',
    'es-DO': '/publicar-anuncio/descripcion',
    'en-CU': '/post-ad/description',
    'en-DO': '/post-ad/description'
  }
})

const { t } = useI18n()
const adFlowStore = useAdFlowStore()

const { errors, defineField } = useForm({
  validationSchema: object({
    description: string()
      .trim()
      .required(() => t('post_ad.description.errors.description_required'))
  }),
  initialValues: { description: adFlowStore.draft.description }
})

const [description, descriptionAttrs] = defineField('description')

watch(description, (value) => adFlowStore.update({ description: value }))
</script>

<template>
  <section class="description-step">
    <h1 class="description-step__title">
      {{ t('post_ad.description.title') }}
    </h1>

    <BaseTextarea
      id="ad-description"
      v-model="description"
      v-bind="descriptionAttrs"
      :label="t('post_ad.description.label')"
      :placeholder="t('post_ad.description.placeholder')"
      :error-message="errors?.description"
      @focusout="descriptionAttrs.onBlur"
    />
  </section>
</template>

<style lang="scss" scoped>
// El ancho y el centrado los pone pages/post-ad.vue.
.description-step {
  &__title {
    @include font-outfit-semibold;
    font-size: $font-size-lg;
    margin: 0 0 $gap-extra-medium;
  }
}
</style>
