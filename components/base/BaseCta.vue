<script setup lang="ts">
import { NuxtLink } from '#components'

type Props = {
  to: string
  isLink: boolean
  isExternalUrl: boolean
  disabled: boolean
  variant: string
  size: string
  ariaLabel: string
}

const props: Props = defineProps({
  to: {
    type: String,
    default: ''
  },
  isLink: {
    type: Boolean,
    default: false
  },
  isExternalUrl: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) =>
      ['primary', 'secondary', 'tertiary', 'flat', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  // Vacío por defecto: el texto del botón ya es su nombre accesible. Un
  // aria-label lo sustituye, así que solo se pone en botones de solo icono.
  ariaLabel: {
    type: String,
    default: ''
  }
})

const componentType = computed(() => {
  if (props.isLink) {
    return NuxtLink
  }
  if (props.isExternalUrl) {
    return 'a'
  }
  return 'button'
})

const targetProp = computed(() => (props.isExternalUrl ? 'href' : 'to'))

const cssClass = computed(() => ({
  btn: componentType.value === 'button',
  link: componentType.value !== 'button',
  primary: props.variant === 'primary',
  secondary: props.variant === 'secondary',
  flat: props.variant === 'flat',
  ghost: props.variant === 'ghost',
  // El tamaño solo pinta en los botones: un enlace es texto en línea y no
  // tiene alto propio.
  [props.size]: componentType.value === 'button'
}))

const handleClick = () => {
  if (componentType.value === 'button' && (props.to || props.isExternalUrl)) {
    return navigateTo(props.to.toString() ?? props.isExternalUrl.toString())
  }
}
</script>

<template>
  <component
    :is="componentType"
    :[targetProp]="to"
    :class="cssClass"
    :disabled="disabled"
    :aria-label="ariaLabel || undefined"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
@use '../assets/scss/abstract/_mixins.scss' as *;
@use '../assets/scss/tokens/_spacing.scss' as *;

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: $gap-extra-tiny;
  position: relative;
  cursor: pointer;
  gap: $gap-extra-tiny;
  @include font-roboto-condensed-regular;

  // `md` es el tamaño de siempre: mismos valores que tenía .btn antes de que
  // existiera la prop, para que los botones que no la pasan no se muevan.
  &.md {
    min-height: px-to-rem(45);
    font-size: $font-size-md;
    padding-left: $gap-tiny;
    padding-right: $gap-tiny;

    @include media-breakpoint-up(sm) {
      padding-left: $gap-small;
      padding-right: $gap-small;
    }
  }

  &.sm {
    min-height: px-to-rem(32);
    font-size: $font-size-sm;
    padding-left: $gap-extra-tiny;
    padding-right: $gap-extra-tiny;

    @include media-breakpoint-up(sm) {
      padding-left: $gap-small;
      padding-right: $gap-small;
    }
  }

  &.lg {
    min-height: px-to-rem(56);
    font-size: $font-size-lg;
    padding-left: $gap-small;
    padding-right: $gap-small;

    @include media-breakpoint-up(sm) {
      padding-left: $gap-medium;
      padding-right: $gap-medium;
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.primary {
    color: var(--primary-button-text-color);
    background-color: var(--primary-button-color);

    &:not(:disabled) {
      &:hover,
      &:focus {
        background-color: var(--primary-button-color-hover);
      }

      &:active {
        background-color: var(--primary-button-color-active);
      }
    }

    &:disabled {
      background-color: var(--primary-button-color-disabled);
      color: var(--primary-button-text-color-disabled);
    }

    :deep(svg) {
      fill: var(--color-white);
    }
  }

  &.secondary {
    color: var(--secondary-button-text-color);
    background-color: var(--secondary-button-color);

    &:not(:disabled) {
      &:hover,
      &:focus {
        background-color: var(--secondary-button-color-hover);
      }

      &:active {
        background-color: var(--secondary-button-color-active);
      }
    }

    &:disabled {
      background-color: var(--secondary-button-color-disabled);
      color: var(--secondary-button-text-color-disabled);
    }

    :deep(svg) {
      fill: var(--secondary-button-text-color);
    }
  }

  &.flat {
    color: var(--flat-button-text-color);
    background-color: var(--flat-button-color);
    @include font-roboto-condensed-light;

    &:not(:disabled) {
      &:hover,
      &:focus {
        background-color: var(--flat-button-color-hover);
      }

      &:active {
        background-color: var(--flat-button-color-active);
      }
    }

    &:disabled {
      background-color: var(--flat-button-color-disabled);
      color: var(--flat-button-text-color-disabled);
    }

    :deep(svg) {
      fill: var(--flat-text-color);
    }
  }

  &.ghost {
    color: var(--ghost-button-text-color);
    background-color: var(--ghost-button-color);
    border: 0.0625rem solid var(--ghost-button-text-color);

    &:not(:disabled) {
      &:hover,
      &:focus {
        background-color: var(--ghost-button-color-hover);
      }

      &:active {
        background-color: var(--ghost-button-color-active);
      }
    }

    &:disabled {
      background-color: var(--ghost-button-color-disabled);
      color: var(--ghost-button-text-color-disabled);
    }

    :deep(svg) {
      fill: var(--ghost-button-text-color);
    }
  }

  :deep(span + span) {
    margin-left: $gap-extra-tiny;
  }
}

.link {
  background: transparent;
  color: var(--text-color-secondary);
  cursor: pointer;
  text-decoration: underline;
  -webkit-transition: color 0.2s linear, background-color 0.2s linear;
  transition: color 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    background-color 0.2s linear;
  position: relative;
  transition: 0.4s;
  letter-spacing: 0.06875em;
  @include font-roboto-condensed-light;

  &.-highlighted {
    color: var(--red-orange-600);
  }

  &:hover,
  &:active,
  &:focus {
    color: var(--red-orange-600);
    text-decoration: underline;
  }

  :deep(span + span) {
    margin-left: $gap-extra-tiny;
  }
}
</style>
