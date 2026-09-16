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
  rows: {
    type: Number,
    default: 5
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  'update:model-value': [value: string]
}>()

const updateModelValue = (event: Event) => {
  if (event.target instanceof HTMLTextAreaElement) {
    emit('update:model-value', event.target.value)
  }
}
</script>

<template>
  <div class="form-group" :class="{ 'form-group--error': errorMessage }">
    <label
      :for="id"
      class="form-group__label"
      :class="{ 'sr-only': hideLabel }"
    >
      {{ label }}
    </label>
    <textarea
      :id="id"
      :placeholder="placeholder"
      class="form-group__textarea"
      :rows="rows"
      :value="modelValue"
      @input="updateModelValue"
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

  &__textarea {
    @include font-roboto-condensed-regular;
    background-color: var(--input-background-color);
    border: 0.0625rem solid var(--input-border-color);
    border-radius: $gap-extra-tiny;
    color: var(--input-text-color);
    display: block;
    letter-spacing: 0.075em;
    padding: 0.3125em 0.625em;
    width: 100%;
    resize: vertical;

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

  &--error {
    #{$root}__textarea {
      border-color: var(--border-color-error);

      &:focus {
        box-shadow: inset 0 0.0625em 0.0625em var(--shadow-color),
          0 0 0.375em var(--text-color-error);
      }
    }
  }
}
</style>
