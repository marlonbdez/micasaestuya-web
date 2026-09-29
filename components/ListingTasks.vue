<script setup lang="ts">
import type { CollaborationTask } from '~/core/types'

const props = defineProps<{
  tasks: CollaborationTask[]
  limit?: number
}>()

const { t } = useI18n()

const shown = computed(() => props.tasks.slice(0, props.limit))
const hidden = computed(() => props.tasks.length - shown.value.length)
</script>

<template>
  <ul class="listing-tasks">
    <li v-for="task in shown" :key="task" class="listing-tasks__item">
      {{ t(`publish_listing.tasks.${task.toLowerCase()}`) }}
    </li>
    <li v-if="hidden > 0" class="listing-tasks__item">
      {{ t('listing.more_tasks', { count: hidden }) }}
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.listing-tasks {
  display: flex;
  flex-wrap: wrap;
  gap: $gap-small;
  margin: 0;
  padding: 0;
  list-style: none;

  &__item {
    padding: $gap-extra-tiny $gap-extra-small;
    border-radius: var(--radius-pill);
    background: var(--bg-2);
    color: var(--text-2);
    font-size: $font-size-sm;
  }
}
</style>
