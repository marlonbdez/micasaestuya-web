<script setup lang="ts">
defineProps({
  id: {
    type: String,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  hideCheckbox: {
    type: Boolean,
    default: false
  },
  button: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

const isFocused = ref(false)

const emit = defineEmits<{
  'update:model-value': [value: boolean]
}>()

const updateModelValue = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    emit('update:model-value', event.target.checked)
  }
}
</script>

<template>
  <div class="form-group" :class="{ 'form-group--button': button }">
    <label
      :for="id"
      class="label"
      :class="{
        checked: modelValue,
        focused: isFocused,
        'hide-checkbox': hideCheckbox,
        btn: button
      }"
    >
      <input
        :id="id"
        :checked="modelValue"
        type="checkbox"
        class="input"
        @input="updateModelValue"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <slot />
    </label>
    <span v-if="errorMessage" class="form-group__error-message">{{
      errorMessage
    }}</span>
  </div>
</template>

<style lang="scss" scoped>
.form-group {
  position: relative;
  margin: 0 0 1rem;
  display: inline-block;

  // Como botón va en grupos que ya separan con `gap`: el margen se sumaría.
  &--button {
    margin: 0;
  }

  &__error-message {
    position: absolute;
    @include font-roboto-condensed-light;
    display: flex;
    color: var(--text-color-error);
    font-size: 0.875rem;
    letter-spacing: 0.06875em;
    line-height: 1.3125em;
    margin: 0.25em 0 0;
    align-items: flex-start;

    &::before {
      content: '';
      width: 1rem;
      height: 1rem;
      background-image: url('~/assets/icons/error-circle.svg');
      background-size: contain;
      background-repeat: no-repeat;
      display: inline-block;
      margin-top: 0.0625rem;
      margin-right: 0.5em;
    }
  }
}

.label {
  margin-bottom: 0;
  position: relative;
  cursor: pointer;
  display: block;
  color: var(--input-text-color);
  &.checked :deep(svg) {
    stroke: var(--color-red-dark);
  }
  &.hide-checkbox.focused::before {
    content: '';
    position: absolute;
    display: block;
    width: 100%;
    height: 0.0625em;
    bottom: 0;
    border-bottom: 0.0625em solid var(--color-red-dark);
  }

  &:not(.hide-checkbox):not(.btn) {
    @include font-roboto-condensed-light;
    font-size: 1rem;
    line-height: 1.3125em;
    letter-spacing: 0.06875em;
    padding-left: 1.8rem;

    &::before {
      content: '';
      display: block;
      width: 1.25em;
      height: 1.25em;
      padding: 0;
      background-color: var(--input-background-color);
      border: 0.0625em solid var(--input-border-color);
      border-radius: 0.25rem;
      position: absolute;
      top: 0;
      left: 0;
    }

    &.focused::before {
      border-color: var(--color-gray-light);
      outline: 0;
      box-shadow: inset 0 0.0625em 0.0625em var(--color-black-transparent) 0 0
        0.5em var(--color-gray-light);
      transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    }

    &.checked::after {
      color: gray;
      content: '';
      position: absolute;
      display: block;
      width: 1.25em;
      height: 1.25em;
      padding: 0;
      top: 0;
      left: 0;
      background-image: url('~/assets/icons/check.svg');
      background-repeat: no-repeat;
      background-position: center center;
      background-color: var(--input-background-color);
      border: 0.0625em solid var(--input-border-color);
      border-radius: 0.25rem;
    }
  }
}

// Mismos colores que el modo `button` de BaseRadioButton, para que elegir una
// opción o varias se vea igual. La forma de pastilla es la de los chips del
// prototipo.
.label.btn {
  @include font-outfit-medium;
  padding: $gap-small $gap-medium;
  border: px-to-rem(1) solid var(--input-border-color);
  border-radius: var(--radius-pill);
  background-color: var(--input-background-color);
  transition: all ease-in-out 0.15s;

  &.checked {
    color: var(--input-radio-text-color);
    background-color: var(--input-radio-active-background-color);
    border-color: var(--input-radio-active-border-color);
  }

  // El input está oculto: sin esto no se ve dónde está el foco del teclado.
  &.focused {
    outline: px-to-rem(2) solid var(--input-radio-active-border-color);
    outline-offset: px-to-rem(1);
  }
}

.input {
  position: absolute;
  width: 0;
  height: 0;
  top: 0;
  left: 0;
  border: none;
}
</style>
