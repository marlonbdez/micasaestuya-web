<script setup lang="ts">
import type { IRegion, LevelType } from '~/core/types/region'
import type { Option } from '~/core/types/dropdown'
import {
  useRegionSuggest,
  parseHighlightedText
} from '~/composables/useRegionSuggest'

interface Props {
  id?: string
  label: string
  placeholder?: string
  errorMessage?: string
  hideLabel?: boolean
  // Sin nivel, el backend devuelve los diez primeros de cualquier nivel,
  // que es lo que quiere el buscador. El publicador pide 3 (localidad).
  levelType?: LevelType
}

const props = withDefaults(defineProps<Props>(), {
  id: 'region-suggest',
  placeholder: '',
  errorMessage: '',
  hideLabel: false,
  levelType: undefined
})

const emit = defineEmits<{
  select: [region: IRegion]
  'select-empty': []
}>()

const { t } = useI18n()
const {
  term,
  setTerm,
  options,
  showOptions,
  isLoading,
  hasOptions,
  optionAt,
  clearOptions
} = useRegionSuggest(props.levelType)

const isFocused = ref(false)

const parsedOptions = computed<Option<IRegion>[]>(() =>
  options.value.map((region, index) => ({
    id: index.toString(),
    value: region.term ?? '',
    data: region
  }))
)

// La clave es el nivel, no su nombre: lo que en Cuba es "provincia" en otro
// país puede llamarse de otra forma, así que la traducción vive en el
// fichero de cada locale (es-cu.json, es-do.json), no en el base.
const getLevelName = (levelType: LevelType): string =>
  t(`region.level${levelType}`)

const select = (optionId?: string): void => {
  const region = hasOptions.value ? optionAt(optionId) : undefined
  if (!region) {
    emit('select-empty')
    return
  }
  setTerm(region.term ?? '')
  clearOptions()
  emit('select', region)
}

// El buscador dispara la selección desde fuera al pulsar "Buscar casas".
defineExpose({ select })

watch(isFocused, () => {
  if (isFocused.value && hasOptions.value) {
    showOptions.value = true
  } else {
    setTimeout(() => {
      showOptions.value = false
    }, 200)
  }
})
</script>

<template>
  <BaseDropdown
    :id="id"
    v-model="term"
    external-dropdown-ctrl
    :label="label"
    :placeholder="placeholder"
    :show-options="showOptions"
    :options="parsedOptions"
    class="region-suggest"
    @focusin="isFocused = true"
    @focusout="isFocused = false"
    @update:selected="select"
  >
    <template #selector>
      <BaseInput
        :id="`${id}-input`"
        v-model="term"
        :hide-label="hideLabel"
        :label="label"
        :placeholder="placeholder"
        :error-message="errorMessage"
        :icon="isLoading ? 'loading' : ''"
      />
    </template>
    <template #option="{ option }">
      <div class="region-suggest__option">
        <div class="region-suggest__name">
          <template
            v-for="(segment, index) in parseHighlightedText(
              option.data.highlighted_text
            )"
            :key="`${option.id}-${index}`"
          >
            <mark v-if="segment.isMarked">{{ segment.text }}</mark>
            <span v-else>{{ segment.text }}</span>
          </template>
        </div>
        <div class="region-suggest__level">
          <small>{{ getLevelName(option.data.level_type) }}</small>
        </div>
      </div>
    </template>
  </BaseDropdown>
</template>

<style lang="scss" scoped>
.region-suggest {
  // BaseDropdown ancla el panel a la derecha con min-width, pensado para
  // selectores estrechos. Aquí el campo es ancho y debe alinearse con él.
  :deep(.dropdown__content) {
    left: 0;
    right: 0;
  }

  &__option {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 2.5rem;
    width: 100%;
  }

  &__name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    :deep(mark) {
      background: none;
      color: inherit;
      @include font-roboto-bold;
    }
  }

  &__level {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 1rem;

    &::before {
      content: '';
      display: block;
      width: 0.875rem;
      height: 0.875rem;
      background-image: url('~/assets/icons/location.svg');
      background-size: contain;
      background-repeat: no-repeat;
      position: absolute;
      left: 0;
    }
  }
}
</style>
