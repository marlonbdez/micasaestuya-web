<script setup lang="ts">
const props = defineProps({
  selected: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  button: {
    type: Boolean,
    default: false
  },
  inline: {
    type: Boolean,
    default: false
  }
})

const isFocused = ref(false)

const emit = defineEmits<{ (event: 'update:selected', value: string): void }>()

const checked = computed(() => props.value === props.selected)

const updateSelected = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    emit('update:selected', event.target.value)
  }
}
</script>

<template>
  <div class="form-group" :class="{ inline }">
    <label
      :for="id"
      class="label"
      :class="{
        btn: button,
        checked: checked,
        focused: isFocused
      }"
    >
      <input
        :id="id"
        :value="value"
        :name="name"
        :checked="checked"
        type="radio"
        class="input"
        @input="updateSelected"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <slot />
    </label>
  </div>
</template>

<style lang="scss" scoped>
.form-group {
  position: relative;
  display: block;
  width: 100%;

  &.inline {
    & + & {
      margin-left: -0.0625rem;
    }

    &:first-child:not(:last-child) .label {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    & + &:not(:last-child) .label {
      border-radius: 0;
    }

    & + & .label {
      margin-left: -0.125rem;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .label {
      text-align: center;
    }
  }
}

.label {
  @include font-roboto-condensed-regular;
  letter-spacing: 0.06875em;
  position: relative;
  display: inline-block;
  cursor: pointer;
  color: var(--input-text-color);
  border-radius: 0.25rem;
  line-height: 1.6875em;
  padding: 0 0 0 2em;
  margin: 0;
  width: 100%;
  transition: all ease-in-out 0.15s;

  &.focused::before {
    border-color: var(--input-focus-border-color);
    background-color: var(--input-background-color);
    box-shadow: inset 0 0.0625em 0.0625em var(--shadow-color) 0 0 0.5em
      var(--color-gray-light);
  }

  &:not(.btn):before,
  &:not(.btn):after {
    content: '';
    position: absolute;
    display: block;
  }

  &:not(.btn):before {
    width: 1.5em;
    height: 1.5em;
    top: calc(50% - 0.75em);
    left: 0;
    background-color: var(--color-gray-lighter);
    cursor: pointer;
    border: 0.0625em;
  }

  &:not(.btn).checked:after {
    width: 1.125em;
    height: 1.125em;
    top: calc(50% - 0.5625em);
    left: 0.1875em;
    background-color: var(--color-red-dark);
    border: 0;
    z-index: $zindex-radio;
  }

  .input {
    position: absolute;
    border: none;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: none;
    width: 0;
    height: 0;
    top: 0;
    left: 0;
  }

  &.btn {
    padding: 0 0.625rem;
    text-transform: initial;
    border: 0.0625rem solid var(--input-border-color);
    background-color: var(--input-background-color);
    line-height: 2.6875rem;
    &.checked {
      color: var(--input-radio-text-color);
      background-color: var(--input-radio-active-background-color);
      border: 0.0625rem solid var(--input-radio-active-border-color);
      z-index: $zindex-radio;
    }
  }
}
</style>
