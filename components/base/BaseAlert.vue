<script setup lang="ts">
type VariantType = 'success' | 'info' | 'warning' | 'error'

defineProps({
  variant: {
    type: String,
    default: 'info',
    validator: (value: VariantType) =>
      ['info', 'success', 'warning', 'error'].includes(value)
  }
})
</script>

<template>
  <div class="alert-box" :class="variant">
    <p><slot /></p>
  </div>
</template>

<style lang="scss" scoped>
.alert-box {
  @include font-roboto-light;
  position: relative;
  font-size: 1rem;
  letter-spacing: -0.00625em;
  box-shadow: 0 0.0625em 0.1875em 0 var(--shadow-color);
  margin: $gap-medium auto;
  padding: $gap-extra-medium $gap-medium;

  > p {
    margin: 0;
    text-align: center;

    strong {
      display: block;
      margin-bottom: $gap-extra-tiny;
    }
  }

  &.info,
  &.error,
  &.warning,
  &.success {
    padding-top: $gap-extra-huge;
  }

  &.info {
    background-color: var(--info-message-background-color);
  }

  &.error {
    background-color: var(--error-message-background-color);
  }

  &.warning {
    background-color: var(--warning-message-background-color);
  }

  &.success {
    background-color: var(--success-message-background-color);
  }

  @include media-breakpoint-up(sm) {
    &.info,
    &.error,
    &.warning,
    &.success {
      padding: $gap-extra-medium $gap-medium;
    }

    > p {
      text-align: left;
    }
  }
}
</style>
