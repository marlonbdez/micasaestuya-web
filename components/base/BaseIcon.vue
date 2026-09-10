<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  }
})
</script>

<template>
  <nuxt-icon filled :name="icon" class="icon" :class="size" />
</template>

<style lang="scss" scoped>
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(svg) {
  vertical-align: middle;
  margin-bottom: 0 !important;
}

.xs :deep(svg) {
  font-size: 0.75rem;
}

.sm :deep(svg) {
  font-size: 1.125rem;
}

.md :deep(svg) {
  font-size: 1.5rem;
}

.lg :deep(svg) {
  font-size: 2rem;
}

.xl :deep(svg) {
  font-size: 4.6875rem;
}
</style>
