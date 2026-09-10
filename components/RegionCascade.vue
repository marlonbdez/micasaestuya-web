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
}>()

const { t } = useI18n()
const { selected, options, select, restore } = useRegionCascade()

const onSelect = async (index: number, value: string) => {
  emit('update:model-value', await select(index, value))
}

// El placeholder es una opción vacía y no un atributo: un <select> nativo no
// tiene placeholder, y sin ella el navegador preselecciona el primer valor
// como si el usuario ya hubiese elegido.
const toSelectOptions = (nodes: IRegionNode[]) => [
  { id: '', value: t('post_ad.address.select_placeholder') },
  ...nodes.map(({ name }) => ({ id: name, value: name }))
]

onMounted(() => restore(props.modelValue))
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
