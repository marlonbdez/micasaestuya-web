<script setup lang="ts">
import type { IAdRegion } from '~/core/types'
import type { IRegionNode } from '~/core/types/region'
import { useRegionCascade } from '~/composables/useRegionCascade'

interface Props {
  modelValue: IAdRegion | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:model-value': [region: IAdRegion | null]
  // Si lo elegido llega hasta el último nivel que existe para esa rama. Solo
  // la cascada lo sabe: el padre ve la región, no las listas.
  complete: [isComplete: boolean]
}>()

const { t } = useI18n()
const { selected, options, select, restore } = useRegionCascade()

const emitComplete = () =>
  emit(
    'complete',
    selected.value.length > 0 && selected.value.length === options.value.length
  )

// `complete` va antes que el modelo: quien valide al cambiar la región tiene
// que encontrarlo ya actualizado.
const onSelect = async (index: number, value: string) => {
  const region = await select(index, value)
  emitComplete()
  emit('update:model-value', region)
}

// El placeholder es una opción vacía y no un atributo: un <select> nativo no
// tiene placeholder, y sin ella el navegador preselecciona el primer valor
// como si el usuario ya hubiese elegido.
const toSelectOptions = (nodes: IRegionNode[]) => [
  { id: '', value: t('post_ad.address.select_placeholder') },
  ...nodes.map(({ name }) => ({ id: name, value: name }))
]

onMounted(async () => {
  await restore(props.modelValue)
  emitComplete()
})
</script>

<template>
  <div class="region-cascade">
    <BaseSelect
      v-for="(nodes, index) in options"
      :id="`ad-region-${index + 1}`"
      :key="index"
      :model-value="selected[index] ?? ''"
      :options="toSelectOptions(nodes)"
      :label="t(`region.level${index + 1}`)"
      @update:model-value="(value: string) => onSelect(index, value)"
    />
  </div>
</template>

<style lang="scss" scoped>
.region-cascade {
  display: flex;
  flex-direction: column;
  gap: $gap-medium;
}
</style>
