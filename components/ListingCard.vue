<script setup lang="ts">
import type { IListingCard } from '~/core/types'

const props = defineProps<{ listing: IListingCard }>()

const { t } = useI18n()
const localePath = useLocalePath()

const thumbnail = computed(() => `${props.listing.photos[0]}-thumb`)
</script>

<template>
  <NuxtLink
    class="listing-card"
    :to="localePath({ name: 'explore-id', params: { id: listing.id } })"
  >
    <img class="listing-card__image" :src="thumbnail" alt="" loading="lazy" />
    <div class="listing-card__body">
      <h3 class="listing-card__title">{{ listing.title }}</h3>
      <p class="listing-card__meta">
        {{ listing.region.term }} ·
        {{
          t('listing.capacity', { count: listing.capacity }, listing.capacity)
        }}
      </p>
      <ListingTasks :tasks="listing.tasks" :limit="3" />
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.listing-card {
  display: block;
  overflow: hidden;
  border: px-to-rem(1) solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
  color: inherit;
  text-decoration: none;
  transition: box-shadow var(--transition);

  &:hover,
  &:focus-visible {
    box-shadow: var(--card-shadow-hover);
  }

  &__image {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    background: var(--bg-3);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: $gap-small;
    padding: $gap-medium;
  }

  &__title {
    @include font-outfit-semibold;
    margin: 0;
    font-size: $font-size-md;
  }

  &__meta {
    margin: 0;
    color: var(--text-2);
    font-size: $font-size-sm;
  }
}
</style>
