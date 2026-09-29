<script setup lang="ts">
defineI18nRoute({
  paths: {
    'es-CU': '/explorar/[id]',
    'es-DO': '/explorar/[id]',
    'en-CU': '/explore/[id]',
    'en-DO': '/explore/[id]'
  }
})

definePageMeta({ middleware: ['auth'] })

const { t } = useI18n()
const localePath = useLocalePath()
const { listing, status, load } = useListingDetail(
  useRoute().params.id as string
)

// wa.me quiere el número solo con dígitos, sin el "+".
const whatsappUrl = computed(() => {
  if (!listing.value) return ''
  const message = t('listing.whatsapp_message', {
    host: listing.value.owner.firstName,
    title: listing.value.title
  })
  return `https://wa.me/${listing.value.whatsapp.replace(
    /\D/g,
    ''
  )}?text=${encodeURIComponent(message)}`
})

onMounted(load)
</script>

<template>
  <main class="container listing">
    <BaseCta is-link class="listing__back" :to="localePath('explore')">
      {{ t('listing.back') }}
    </BaseCta>

    <div v-if="status === 'loading'" class="listing__state">
      <BaseSpinner size="md" />
    </div>

    <div v-else-if="status === 'not-found'" class="listing__state">
      <h1 class="listing__state-title">{{ t('listing.not_found_title') }}</h1>
      <p>{{ t('listing.not_found_text') }}</p>
    </div>

    <div v-else-if="status === 'error'" class="listing__state">
      <BaseAlert variant="error">{{ t('listing.error') }}</BaseAlert>
      <BaseCta variant="secondary" @click="load">
        {{ t('explore.retry') }}
      </BaseCta>
    </div>

    <template v-else-if="listing">
      <ul v-if="listing.photos.length" class="listing__gallery">
        <li v-for="photo in listing.photos" :key="photo">
          <img
            class="listing__photo"
            :src="photo"
            :alt="t('listing.photo_alt', { title: listing.title })"
          />
        </li>
      </ul>
      <div v-else class="listing__no-photos">
        <BaseIcon icon="house" size="xl" />
      </div>

      <div class="listing__layout">
        <article class="listing__content">
          <h1 class="listing__title">{{ listing.title }}</h1>
          <p class="listing__meta">
            {{ listing.region.term }} ·
            {{ t('listing.host', { name: listing.owner.firstName }) }}
          </p>

          <h2 class="listing__heading">{{ t('listing.about') }}</h2>
          <p class="listing__description">{{ listing.description }}</p>

          <h2 class="listing__heading">{{ t('listing.tasks') }}</h2>
          <ListingTasks :tasks="listing.tasks" />

          <h2 class="listing__heading">{{ t('listing.how_title') }}</h2>
          <ol class="listing__steps">
            <li>{{ t('listing.how_1', { host: listing.owner.firstName }) }}</li>
            <li>{{ t('listing.how_2') }}</li>
            <li>{{ t('listing.how_3') }}</li>
          </ol>
        </article>

        <aside class="listing__aside">
          <p class="listing__capacity">
            {{
              t(
                'listing.capacity',
                { count: listing.capacity },
                listing.capacity
              )
            }}
          </p>
          <BaseCta
            is-external-url
            class="listing__whatsapp"
            :to="whatsappUrl"
            target="_blank"
            rel="noopener"
          >
            {{ t('listing.contact') }}
          </BaseCta>
          <p class="listing__note">{{ t('listing.contact_note') }}</p>
          <p class="listing__note">{{ t('listing.adults_note') }}</p>
        </aside>
      </div>
    </template>
  </main>
</template>

<style lang="scss" scoped>
.listing {
  padding-top: $gap-medium;
  padding-bottom: $gap-huge;

  &__back {
    display: inline-block;
    margin-bottom: $gap-medium;
  }

  &__state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $gap-medium;
    padding: $gap-huge 0;
    color: var(--text-2);
    text-align: center;
  }

  &__state-title {
    @include font-outfit-semibold;
    margin: 0;
    color: var(--text);
    font-size: px-to-rem(26);
  }

  &__gallery {
    display: flex;
    gap: $gap-small;
    margin: 0 0 $gap-extra-medium;
    padding: 0 0 $gap-small;
    overflow-x: auto;
    list-style: none;
    scroll-snap-type: x mandatory;

    li {
      flex: 0 0 min(100%, px-to-rem(720));
      scroll-snap-align: start;
    }
  }

  &__photo {
    display: block;
    width: 100%;
    aspect-ratio: 3 / 2;
    border-radius: var(--radius);
    object-fit: cover;
    background: var(--bg-3);
  }

  &__no-photos {
    display: flex;
    align-items: center;
    justify-content: center;
    height: px-to-rem(240);
    margin-bottom: $gap-extra-medium;
    border-radius: var(--radius);
    background: var(--bg-3);
  }

  &__layout {
    display: grid;
    gap: $gap-large;

    @include media-breakpoint-up(md) {
      grid-template-columns: 1fr px-to-rem(320);
      align-items: start;
    }
  }

  &__title {
    @include font-outfit-semibold;
    margin: 0 0 $gap-small;
    font-size: px-to-rem(32);
    line-height: 1.2;
  }

  &__meta {
    margin: 0;
    color: var(--text-2);
  }

  &__heading {
    @include font-outfit-semibold;
    margin: $gap-large 0 $gap-small;
    font-size: $font-size-lg;
  }

  &__description {
    margin: 0;
    line-height: 1.6;
    white-space: pre-line;
  }

  &__steps {
    margin: 0;
    padding-left: $gap-extra-medium;
    line-height: 1.8;
  }

  &__aside {
    display: flex;
    flex-direction: column;
    gap: $gap-medium;
    padding: $gap-extra-medium;
    border: px-to-rem(1) solid var(--border);
    border-radius: var(--radius);
    background: var(--bg);
  }

  &__capacity {
    @include font-outfit-semibold;
    margin: 0;
    font-size: $font-size-lg;
  }

  // BaseCta en modo enlace es texto subrayado; aquí tiene que leerse como un
  // botón, igual que en el prototipo.
  &__whatsapp {
    @include font-outfit-semibold;
    padding: $gap-extra-small $gap-extra-medium;
    border-radius: var(--radius-pill);
    background: var(--whatsapp-button-color);
    color: var(--whatsapp-button-text-color);
    text-align: center;
    text-decoration: none;

    &:hover,
    &:focus {
      background: var(--whatsapp-button-color-hover);
      color: var(--whatsapp-button-text-color);
      text-decoration: none;
    }
  }

  &__note {
    margin: 0;
    color: var(--text-2);
    font-size: $font-size-sm;
    line-height: 1.5;
  }
}
</style>
