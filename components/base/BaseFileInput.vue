<script setup lang="ts">
defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: ''
  },
  multiple: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  select: [files: File[]]
}>()

const onChange = (event: Event) => {
  if (!(event.target instanceof HTMLInputElement) || !event.target.files) return

  emit('select', Array.from(event.target.files))

  // Se limpia tras emitir: elegir el mismo fichero dos veces seguidas no
  // dispara `change` si el input conserva el anterior.
  event.target.value = ''
}
</script>

<template>
  <div class="form-group" :class="{ 'form-group--error': errorMessage }">
    <label :for="id" class="label" :class="{ disabled }">
      <input
        :id="id"
        class="input sr-only"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        @change="onChange"
      />
      <span class="label__text">{{ label }}</span>
      <span v-if="hint" class="label__hint">{{ hint }}</span>
    </label>
    <span v-if="errorMessage" class="form-group__error-message">{{
      errorMessage
    }}</span>
  </div>
</template>

<style lang="scss" scoped>
.form-group {
  position: relative;

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
    .label {
      border-color: var(--border-color-error);
    }
  }
}

.label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $gap-extra-tiny;
  padding: $gap-extra-medium $gap-medium;
  border: px-to-rem(1) dashed var(--input-border-color);
  border-radius: var(--radius);
  background: var(--bg-2);
  cursor: pointer;
  text-align: center;

  &:hover {
    border-color: var(--warm);
  }

  // El input va oculto, así que no hay foco nativo que ver: el recuadro tiene
  // que enseñarlo por él o el campo es inalcanzable a ojo con el teclado.
  &:focus-within {
    border-style: solid;
    border-color: var(--input-focus-border-color-focus);
  }

  // El input va oculto con `sr-only`, no con `display: none`: así el campo
  // sigue existiendo para el teclado y para los lectores de pantalla.
  &__text {
    @include font-outfit-medium;
    color: var(--input-text-color);
  }

  &__hint {
    font-size: $font-size-sm;
    color: var(--text-3);
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.6;

    &:hover {
      border-color: var(--input-border-color);
    }
  }
}
</style>
