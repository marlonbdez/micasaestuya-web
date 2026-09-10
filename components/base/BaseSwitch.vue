<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md'].includes(value)
  },
  iconOn: {
    type: String,
    default: 'moon'
  },
  iconOff: {
    type: String,
    default: 'sun'
  },
  ariaLabel: {
    type: String,
    default: 'switch'
  }
})

const emit = defineEmits<{
  'update:model-value': [value: boolean]
}>()

const updateModelValue = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    const value = event.target.value !== 'true'
    emit('update:model-value', value)
  }
}
</script>

<template>
  <label class="switch" :class="size">
    <input
      v-bind="$attrs"
      :value="modelValue"
      class="switch__input"
      type="checkbox"
      :aria-label="ariaLabel"
      checked
      @input="updateModelValue"
    />
    <span class="switch__slider" :class="size">
      <div class="slider__icon" :class="[size, modelValue ? 'on' : 'off']">
        <BaseIcon v-if="modelValue" :icon="iconOn" :size="size" />
        <BaseIcon v-else :icon="iconOff" :size="size" />
      </div>
    </span>
  </label>
</template>

<style lang="scss" scoped>
.switch {
  position: relative;
  display: inline-block;

  &.sm {
    width: 2.625rem;
    height: 1.375rem;
  }

  &.md {
    width: 3.5rem;
    height: 2rem;
  }

  &__input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  &__slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--switch-background-color);
    transition: 0.4s;
    border-radius: 2rem;
  }
}

.slider__icon {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--switch-icon-background-color);
  transition: 0.4s;
  border-radius: 50%;
  top: 0.0625rem;

  &.sm {
    width: 1.25rem;
    height: 1.25rem;
  }

  &.md {
    height: 1.875rem;
    width: 1.875rem;
  }

  &.off {
    left: 0.0625rem;
  }

  &.sm.on {
    left: 1.3125rem;
  }

  &.md.on {
    left: 1.5625rem;
  }
}

input:checked + .switch__slider {
  background-color: var(--switch-active-background-color);
}

input:focus + .switch__slider {
  box-shadow: 0 0 0.0625rem var(--switch-active-border-color);
}
</style>
