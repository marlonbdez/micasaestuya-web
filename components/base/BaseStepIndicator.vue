<script setup lang="ts">
interface Props {
  current: number
  total: number
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: ''
})

const pad = (value: number) => String(value).padStart(2, '0')

const progress = computed(() => `${(props.current / props.total) * 100}%`)
</script>

<template>
  <div class="step-indicator">
    <p class="step-indicator__heading">
      <span class="step-indicator__current">{{ pad(current) }}</span>
      <span class="step-indicator__total">/ {{ pad(total) }}</span>
      <span v-if="label" class="step-indicator__label">{{ label }}</span>
    </p>
    <div
      class="step-indicator__track"
      role="progressbar"
      :aria-valuenow="current"
      :aria-valuemin="1"
      :aria-valuemax="total"
      :aria-label="label || undefined"
    >
      <div class="step-indicator__fill" :style="{ width: progress }" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.step-indicator {
  &__heading {
    display: flex;
    align-items: baseline;
    gap: $gap-small;
    margin: 0 0 $gap-extra-small;
  }

  &__current {
    @include font-outfit-light;
    font-size: px-to-rem(26);
    line-height: 1;
    color: var(--warm);
  }

  &__total {
    @include font-outfit-light;
    font-size: $font-size-xs;
    color: var(--text-3);
  }

  &__label {
    margin-left: $gap-extra-tiny;
    font-size: $font-size-sm;
    color: var(--text);
  }

  &__track {
    height: px-to-rem(2);
    border-radius: $corner-radius-pill;
    background: var(--border);
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    background: var(--warm);
    border-radius: $corner-radius-pill;
    transition: width var(--transition);
  }
}
</style>
