<script setup lang="ts">
import { useAdFlowStore } from '~/stores/adFlow'

// Identificarse no está en la lista a propósito: no es un paso de relleno.
const STEPS = ['basic-info', 'address', 'details', 'photos', 'description']

defineI18nRoute({
  paths: {
    'es-CU': '/publicar-anuncio',
    'es-DO': '/publicar-anuncio',
    'en-CU': '/post-ad',
    'en-DO': '/post-ad'
  }
})

definePageMeta({
  layout: 'flow'
})

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const adFlowStore = useAdFlowStore()

// En el setup, no en onMounted: el padre corre antes que los hijos, así que
// cada paso ya lee el borrador restaurado.
adFlowStore.hydrate()

// Por nombre de ruta, no por path: con i18n la URL en español acaba en
// "datos-basicos" y parsearla dejaría el indicador clavado en el paso 1.
const currentStepName = computed(() => {
  const name = String(route.name ?? '')
    .split('___')[0]
    .replace('post-ad-', '')
  return STEPS.includes(name) ? name : STEPS[0]
})

const currentIndex = computed(() => STEPS.indexOf(currentStepName.value))
const currentStep = computed(() => currentIndex.value + 1)

const stepLabel = computed(() =>
  t(`post_ad.steps.${currentStepName.value.replaceAll('-', '_')}`)
)

const isFirstStep = computed(() => currentIndex.value === 0)
const isLastStep = computed(() => currentIndex.value === STEPS.length - 1)
const canGoNext = computed(() => adFlowStore.canGoNext(currentStepName.value))

const goTo = (index: number) =>
  navigateTo(localePath(`post-ad-${STEPS[index]}`))

const onBack = () => goTo(currentIndex.value - 1)

const onNext = () => {
  if (isLastStep.value) return // TODO: pantalla de publicar (identificarse)
  goTo(currentIndex.value + 1)
}
</script>

<template>
  <div class="post-ad">
    <BaseStepIndicator
      class="post-ad__steps"
      :current="currentStep"
      :total="STEPS.length"
      :label="stepLabel"
    />

    <NuxtPage />

    <!--
      La navegación vive aquí y no en cada paso: si no, se duplicaría cinco
      veces. No hay botón "Guardar" a propósito — el borrador se persiste
      solo en cada cambio, así que sería un botón que no hace nada.
    -->
    <nav class="post-ad__nav">
      <BaseCta variant="ghost" :disabled="isFirstStep" @click="onBack">
        <BaseIcon icon="chevron-left" size="sm" />
        {{ t('post_ad.back') }}
      </BaseCta>
      <BaseCta :disabled="!canGoNext" @click="onNext">
        {{ isLastStep ? t('post_ad.publish') : t('post_ad.next') }}
        <BaseIcon v-if="!isLastStep" icon="chevron-right" size="sm" />
      </BaseCta>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
// El ancho de la columna se define aquí, no en cada paso, para que no se
// desalineen entre sí.
.post-ad {
  max-width: px-to-rem(560);
  margin: 0 auto;
  padding: 0 $gap-medium $gap-huge;

  &__steps {
    padding: $gap-extra-medium 0;
  }

  &__nav {
    display: flex;
    justify-content: space-between;
    gap: $gap-small;
    margin-top: $gap-extra-medium;
    padding-top: $gap-medium;
    border-top: px-to-rem(1) solid var(--border);
  }
}
</style>
