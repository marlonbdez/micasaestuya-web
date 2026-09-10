<script setup lang="ts">
type Options = {
  id: string
  value: string
}

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  hideLabel: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array<Options>,
    default: () => []
  }
})

const emit = defineEmits<{
  'update:model-value': [value: string]
}>()

const updateModelValue = (event: Event) => {
  if (event.target instanceof HTMLSelectElement) {
    emit('update:model-value', event.target.value)
  }
}
</script>

<template>
  <div class="form-group">
    <label
      :for="id"
      class="form-group__label"
      :class="{ 'sr-only': hideLabel }"
    >
      {{ label }}
    </label>
    <select
      :id="id"
      class="form-group__select"
      :value="modelValue"
      @change="updateModelValue"
    >
      <option v-for="option in options" :key="option.id" :value="option.id">
        {{ option.value }}
      </option>
    </select>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/scss/abstract/_mixins.scss' as *;

html.dark-mode .form-group__select {
  background-image: url('~/assets/icons/chevron-down-white.svg');
}

.form-group {
  position: relative;

  &__label {
    @include font-roboto-condensed-light;
    color: var(--color-gray-darker);
    font-size: 1rem;
    letter-spacing: 0.06875em;
    line-height: 1.3125em;
    margin: 0 0 0.375em;
  }

  &__select {
    @include font-roboto-condensed-regular;
    appearance: none;
    background-color: var(--input-background-color);
    background-image: url(../img/arrow-down.png);
    background-image: url('~/assets/icons/chevron-down.svg');
    background-position: right 0.5em center;
    background-repeat: no-repeat;
    background-size: 1.1875em auto;
    border-radius: 0.25rem;
    border: 0.0625em solid var(--input-border-color);
    color: var(--input-text-color);
    cursor: pointer;
    display: block;
    height: 2.8125em;
    letter-spacing: 0.075em;
    padding: 0.3125em 2em 0.3125em 0.625em;
    width: 100%;

    &:focus {
      border-color: var(--color-gray-light);
      box-shadow: inset 0 0.0625em 0.0625em var(--color-black-transparent) 0 0
        0.5em var(--color-gray-light);
      outline: 0;
      transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    }
  }
}
</style>
