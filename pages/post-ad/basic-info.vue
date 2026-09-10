<script setup lang="ts">
import { PropertyType, OperationType } from '@/core/types'
import { useAdFlowStore } from '~/stores/adFlow'

defineI18nRoute({
  paths: {
    'es-CU': '/publicar-anuncio/datos-basicos',
    'es-DO': '/publicar-anuncio/datos-basicos',
    'en-CU': '/post-ad/basic-info',
    'en-DO': '/post-ad/basic-info'
  }
})

const { t } = useI18n()
const adFlowStore = useAdFlowStore()

const types: { value: PropertyType; icon: string; labelKey: string }[] = [
  { value: PropertyType.Apartment, icon: 'apartments', labelKey: 'apartment' },
  { value: PropertyType.House, icon: 'house', labelKey: 'house' },
  { value: PropertyType.Office, icon: 'buildings', labelKey: 'office' },
  { value: PropertyType.Garage, icon: 'garage', labelKey: 'garage' },
  { value: PropertyType.Landscape, icon: 'landscape', labelKey: 'landscape' }
]

const operations: { value: OperationType; labelKey: string }[] = [
  { value: OperationType.Sale, labelKey: 'sale' },
  { value: OperationType.Rent, labelKey: 'rent' },
  { value: OperationType.Share, labelKey: 'share' }
]

const selectedType = computed({
  get: () => adFlowStore.draft.type ?? '',
  set: (value: string) => adFlowStore.update({ type: value as PropertyType })
})

const selectedOperation = computed({
  get: () => adFlowStore.draft.operation ?? '',
  set: (value: string) =>
    adFlowStore.update({ operation: value as OperationType })
})
</script>

<template>
  <section class="basic-info-step">
    <h1 class="basic-info-step__title">
      {{ t('post_ad.basic_info.title') }}
    </h1>

    <fieldset class="basic-info-step__group">
      <legend class="basic-info-step__legend">
        {{ t('post_ad.basic_info.type_label') }}
      </legend>
      <div class="basic-info-step__options basic-info-step__options--cards">
        <BaseRadioButton
          v-for="option in types"
          :id="`ad-type-${option.value}`"
          :key="option.value"
          v-model:selected="selectedType"
          name="ad-type"
          :value="option.value"
          button
          class="basic-info-step__option"
        >
          <BaseIcon :icon="option.icon" size="lg" />
          <span>{{ t(`property_types.${option.labelKey}`) }}</span>
        </BaseRadioButton>
      </div>
    </fieldset>

    <fieldset class="basic-info-step__group">
      <legend class="basic-info-step__legend">
        {{ t('post_ad.basic_info.operation_label') }}
      </legend>
      <div class="basic-info-step__options basic-info-step__options--joined">
        <BaseRadioButton
          v-for="option in operations"
          :id="`ad-operation-${option.value}`"
          :key="option.value"
          v-model:selected="selectedOperation"
          name="ad-operation"
          :value="option.value"
          button
          inline
        >
          {{ t(`post_ad.basic_info.operation.${option.labelKey}`) }}
        </BaseRadioButton>
      </div>
    </fieldset>
  </section>
</template>

<style lang="scss" scoped>
.basic-info-step {
  &__title {
    @include font-outfit-semibold;
    font-size: $font-size-lg;
    margin: 0 0 $gap-extra-medium;
  }

  &__group {
    border: 0;
    padding: 0;
    margin: 0 0 $gap-extra-medium;
  }

  &__legend {
    @include font-outfit-medium;
    font-size: $font-size-sm;
    color: var(--text-2);
    padding: 0;
    margin-bottom: $gap-small;
  }

  &__options {
    display: flex;
    flex-wrap: wrap;
    gap: $gap-small;

    &--cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(px-to-rem(140), 1fr));
    }

    // Sin gap y sin wrap a propósito: el modo `inline` de BaseRadioButton
    // une los bordes con márgenes negativos y necesita los botones pegados.
    &--joined {
      flex-wrap: nowrap;
      gap: 0;

      > * {
        flex: 1;
      }
    }
  }

  &__option {
    :deep(.label) {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: $gap-small;
      min-height: px-to-rem(92);
      padding: $gap-medium $gap-small;
      text-align: center;
      // BaseRadioButton fija line-height a la altura del botón de una línea.
      line-height: 1.35;
    }
  }
}
</style>
