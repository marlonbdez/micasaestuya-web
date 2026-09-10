<script setup lang="ts">
defineProps({
  size: {
    type: String,
    default: 'xs',
    validator: (value: string) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  }
})
</script>

<template>
  <span class="spinner" :class="size" />
</template>

<style lang="scss" scoped>
.spinner {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border: 0.25rem solid transparent;
    border-top-color: var(--color-text-primary);
    border-radius: 50%;
    animation: spinner-rotate 1s ease infinite;
  }

  &.xs {
    padding: 0 0.75rem;

    &::after {
      width: 0.75rem;
      height: 0.75rem;
      border-width: 0.1875rem;
    }
  }

  &.sm {
    padding: 0 1.5rem;

    &::after {
      width: 1.5rem;
      height: 1.5rem;
      border-width: 0.375rem;
    }
  }

  &.lg {
    padding: 0 2.5rem;

    &::after {
      width: 2.5rem;
      height: 2.5rem;
      border-width: 0.625rem;
    }
  }

  &.xl {
    padding: 0 4rem;

    &::after {
      width: 4rem;
      height: 4rem;
      border-width: 1rem;
    }
  }
}

@keyframes spinner-rotate {
  from {
    transform: rotate(0turn);
  }

  to {
    transform: rotate(1turn);
  }
}
</style>
