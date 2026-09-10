<script setup lang="ts">
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
  type: {
    type: String,
    default: 'text'
  },
  autocomplete: {
    type: String,
    default: 'off'
  },
  errorMessage: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  'update:model-value': [value: string]
  'icon-click': []
}>()

const updateModelValue = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    const value = event.target.value
    emit('update:model-value', value)
  }
}
</script>

<template>
  <div
    class="form-group"
    :class="{ 'form-group--error': errorMessage, 'form-group--icon': icon }"
  >
    <label
      :for="id"
      class="form-group__label"
      :class="{ 'sr-only': hideLabel }"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      :placeholder="placeholder"
      class="form-group__input"
      :type="type"
      :value="modelValue"
      :autocomplete="autocomplete"
      @input="updateModelValue"
    />
    <BaseIcon
      v-if="icon"
      :name="icon"
      class="form-group__icon"
      @click="$emit('icon-click')"
    />
    <span v-if="errorMessage" class="form-group__error-message">{{
      errorMessage
    }}</span>
  </div>
</template>

<style lang="scss" scoped>
.form-group {
  $root: &;
  position: relative;

  &__label {
    @include font-roboto-condensed-light;
    display: inline-block;
    color: var(--input-text-color);
    font-size: 1rem;
    letter-spacing: 0.06875em;
    line-height: 1.3125em;
    margin: 0 0 0.375em;
  }

  &__input {
    @include font-roboto-condensed-regular;
    background-color: var(--input-background-color);
    border: 0.0625rem solid var(--input-border-color);
    border-radius: $gap-extra-tiny;
    color: var(--input-text-color);
    display: block;
    height: 2.8125em;
    letter-spacing: 0.075em;
    padding: 0.3125em 0.625em;
    width: 100%;

    &:focus {
      border-color: var(--input-focus-border-color-focus);
      box-shadow: inset 0 0.0625em 0.0625em var(--background-backdrop) 0 0 0.5em
        var(--color-gray-light);
      outline: 0;
      transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    }
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
    text-shadow: 0.054166667em 0.054166667em 0.208333333em
      var(--home-search-background);

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

  &--icon {
    .sr-only + input + .form-group__icon {
      top: 0.625rem;
    }
  }

  &__icon {
    cursor: pointer;
    position: absolute;
    top: 2.35em;
    right: 0.625em;
    color: var(--color-gray);
  }

  &--error {
    #{$root}__input {
      border-color: var(--border-color-error);

      &:focus {
        box-shadow: inset 0 0.0625em 0.0625em var(--shadow-color),
          0 0 0.375em var(--text-color-error);
      }
    }
  }
}
</style>
