<script setup lang="ts" generic="T">
import type { Option } from '~/core/types/dropdown'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  options: {
    type: Array as () => Option<T>[],
    default: () => []
  },
  selected: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  externalDropdownCtrl: {
    type: Boolean,
    default: false
  },
  showOptions: {
    type: Boolean,
    default: false
  }
})

const isVisible = ref(false)
const inputValue = ref('')

const toogleVisibility = () => {
  isVisible.value = !isVisible.value
}

const hideDropdown = () => {
  isVisible.value = false
}

const showDropdown = computed(() => {
  return props.externalDropdownCtrl ? props.showOptions : isVisible.value
})

const emit = defineEmits<{
  'update:model-value': [value: string]
  'update:selected': [value: string]
}>()

const updateSelected = ({ id, callback, disabled }: Options) => {
  // `disabled` ya estaba en el tipo Option pero no se respetaba.
  if (disabled) return
  if (callback) {
    callback()
  }
  emit('update:selected', id)
  hideDropdown()
}

watch(
  () => inputValue.value,
  (value) => {
    emit('update:model-value', value)
  }
)
</script>

<template>
  <div v-click-outside="hideDropdown" class="dropdown">
    <div
      class="dropdown__selector"
      @click="toogleVisibility"
      @keydown.esc.exact="hideDropdown"
      @keydown.shift.tab.exact="hideDropdown"
    >
      <slot :id="id" name="selector" :dropdown-visible="showDropdown">
        <BaseInput
          :id="id"
          v-model="inputValue"
          :label="label"
          :placeholder="placeholder"
          hide-label
          @keydown.space.enter.exact="toogleVisibility"
        />
      </slot>
    </div>
    <ul v-if="showDropdown" class="dropdown__content">
      <li
        v-for="option in options"
        :id="option.id"
        :key="option.id"
        :data-cy="option.dataTestId || option.id"
        tabindex="0"
        class="dropdown__option"
        :class="{
          'dropdown__option--selected': option.id === selected,
          'dropdown__option--disabled': option.disabled
        }"
        :aria-disabled="option.disabled || undefined"
        @click="updateSelected(option)"
        @keydown.space.enter.exact.prevent="updateSelected(option)"
        @keydown.esc.exact="hideDropdown"
      >
        <slot name="option" :option="option">
          <BaseIcon
            v-if="option.icon"
            :icon="option.icon"
            class="dropdown__icon"
            size="sm"
          />
          <span>{{ option.value }}</span>
        </slot>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.dropdown {
  position: relative;

  &__selector {
    display: flex;
    justify-content: flex-end;
    min-width: 2.5rem;

    :deep(.form-group) {
      width: 100%;
    }
  }

  &__content {
    position: absolute;
    display: block;
    right: 0;
    margin-top: $gap-tiny;
    list-style: none;
    padding: 0;
    min-width: 6.25em;
    list-style: none;
    border-radius: 0;
    opacity: 0.97;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 23em;
    z-index: $zindex-dropdown;
    background-color: var(--input-background-color);
    border: 0.0625em solid var(--input-border-color);
    border-radius: 0.25rem;
    box-shadow: 0.0625em 0.0625em 0.3125em 0.0625em
      var(--color-black-transparent);
  }

  &__option {
    @include font-roboto-condensed-light;
    display: flex;
    align-items: center;
    position: relative;
    font-size: 1rem;
    text-decoration: none;
    white-space: nowrap;
    padding: 0.6875em 1em;
    color: var(--input-text-color);
    cursor: pointer;
    outline: none;

    &:hover,
    &:focus,
    &:active {
      background: var(--color-gray-light);
      color: var(--color-gray);
    }

    :deep(.icon) {
      margin-right: $gap-extra-tiny;
    }

    &--selected {
      background: var(--color-gray-light);
      color: var(--color-gray);
      text-decoration: underline;
    }

    &--disabled {
      cursor: not-allowed;
      opacity: 0.5;

      &:hover,
      &:focus {
        background: transparent;
        color: var(--input-text-color);
      }
    }
  }

  &__icon {
    margin-right: 0.25rem;
  }
}
</style>
