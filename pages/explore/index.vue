<script setup lang="ts">
defineI18nRoute({
  paths: {
    'es-CU': '/explorar',
    'es-DO': '/explorar',
    'en-CU': '/explore',
    'en-DO': '/explore'
  }
})

definePageMeta({ middleware: ['auth'] })

const { t } = useI18n()
const localePath = useLocalePath()
const { items, loading, failed, hasMore, loadMore } = useListingExplore()

onMounted(loadMore)
</script>

<template>
  <main class="container explore">
    <section class="explore__intro">
      <h1 class="explore__title">{{ t('explore.title') }}</h1>
      <p class="explore__subtitle">{{ t('explore.subtitle') }}</p>
    </section>

    <h2 class="explore__heading">{{ t('explore.heading') }}</h2>

    <ul v-if="items.length || (hasMore && !failed)" class="explore__grid">
      <li v-for="listing in items" :key="listing.id">
        <ListingCard :listing="listing" />
      </li>
      <template v-if="!items.length">
        <li v-for="n in 6" :key="n">
          <BaseSkeleton class="explore__skeleton" />
        </li>
      </template>
    </ul>

    <div v-else-if="!failed" class="explore__empty">
      <p>{{ t('explore.empty') }}</p>
      <BaseCta is-link :to="localePath('publish-listing')">
        {{ t('header.publish') }}
      </BaseCta>
    </div>

    <BaseAlert v-if="failed" variant="error">
      {{ t('explore.error') }}
    </BaseAlert>

    <div class="explore__more">
      <BaseSpinner v-if="loading && items.length" size="md" />
      <BaseCta v-else-if="failed" variant="secondary" @click="loadMore">
        {{ t('explore.retry') }}
      </BaseCta>
      <BaseCta
        v-else-if="items.length && hasMore"
        variant="secondary"
        @click="loadMore"
      >
        {{ t('explore.load_more') }}
      </BaseCta>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.explore {
  padding-top: $gap-large;
  padding-bottom: $gap-huge;

  &__intro {
    max-width: px-to-rem(640);
    margin-bottom: $gap-large;
  }

  &__title {
    @include font-outfit-semibold;
    margin: 0 0 $gap-small;
    font-size: px-to-rem(32);
    line-height: 1.2;
  }

  &__subtitle {
    margin: 0;
    color: var(--text-2);
    line-height: 1.6;
  }

  &__heading {
    @include font-outfit-semibold;
    margin: 0 0 $gap-medium;
    font-size: $font-size-lg;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(px-to-rem(260), 1fr));
    gap: $gap-extra-medium;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__skeleton {
    aspect-ratio: 4 / 5;
    border-radius: var(--radius);
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $gap-medium;
    padding: $gap-huge 0;
    color: var(--text-2);
    text-align: center;
  }

  &__more {
    display: flex;
    justify-content: center;
    margin-top: $gap-large;
  }
}
</style>
