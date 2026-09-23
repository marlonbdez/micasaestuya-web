<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useListingDraftStore } from '~/stores/listingDraft'

defineI18nRoute({
  paths: {
    'es-CU': '/publicar-alojamiento/publicado',
    'es-DO': '/publicar-alojamiento/publicado',
    'en-CU': '/publish-listing/published',
    'en-DO': '/publish-listing/published'
  }
})

definePageMeta({
  // `published` solo vive en memoria: tras una recarga no hay nada que
  // confirmar, y se vuelve al formulario en vez de pintar una tarjeta vacía.
  // useLocalePath() va dentro: definePageMeta se extrae fuera del setup.
  middleware() {
    if (useListingDraftStore().published) return
    return navigateTo(useLocalePath()('publish-listing'), { replace: true })
  }
})

const { t } = useI18n()
const localePath = useLocalePath()
const { published } = storeToRefs(useListingDraftStore())
</script>

<template>
  <main v-if="published" class="listing-published">
    <span class="listing-published__icon">
      <BaseIcon icon="check" size="xl" />
    </span>

    <h1 class="listing-published__title">
      {{ t('publish_listing.published.title') }}
    </h1>
    <p class="listing-published__text">
      {{
        t('publish_listing.published.text', { region: published.region.term })
      }}
    </p>

    <article class="listing-published__card">
      <div class="listing-published__card-image">
        <BaseIcon icon="house" size="xl" />
      </div>
      <div class="listing-published__card-body">
        <h2 class="listing-published__card-title">{{ published.title }}</h2>
        <p class="listing-published__card-meta">
          {{ published.region.term }} ·
          {{
            t(
              'publish_listing.published.capacity',
              { count: published.capacity },
              published.capacity
            )
          }}
        </p>
      </div>
    </article>

    <!--
      "Ver mi alojamiento" falta a propósito: la página de detalle todavía no
      existe, y un botón que no lleva a ningún sitio confunde más que ayuda.
    -->
    <BaseCta
      is-link
      class="listing-published__explore"
      :aria-label="t('publish_listing.published.explore')"
      :to="localePath('index')"
    >
      {{ t('publish_listing.published.explore') }}
    </BaseCta>
  </main>
</template>

<style lang="scss" scoped>
.listing-published {
  max-width: px-to-rem(480);
  margin: 0 auto;
  padding: $gap-extra-huge $gap-medium;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $gap-medium;
  text-align: center;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: px-to-rem(64);
    height: px-to-rem(64);
    border-radius: 50%;
    background: var(--success-message-background-color);

    // check.svg trae su propio relleno gris claro, que no se lee sobre verde.
    :deep(svg path) {
      fill: var(--text);
    }
  }

  &__title {
    @include font-outfit-semibold;
    font-size: px-to-rem(26);
    margin: 0;
  }

  &__text {
    color: var(--text-2);
    line-height: 1.6;
    margin: 0;
  }

  &__card {
    width: 100%;
    margin-top: $gap-small;
    border: px-to-rem(1) solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    text-align: left;
    background: var(--bg);
  }

  &__card-image {
    display: flex;
    align-items: center;
    justify-content: center;
    height: px-to-rem(140);
    background: var(--bg-3);
  }

  &__card-body {
    padding: $gap-extra-small $gap-medium;
  }

  &__card-title {
    @include font-outfit-semibold;
    font-size: $font-size-md;
    margin: 0 0 $gap-extra-tiny;
  }

  &__card-meta {
    font-size: $font-size-sm;
    color: var(--text-2);
    margin: 0;
  }

  // BaseCta en modo enlace es texto subrayado; aquí tiene que leerse como el
  // botón principal de la pantalla, igual que en el prototipo.
  &__explore {
    @include font-outfit-semibold;
    margin-top: $gap-small;
    padding: $gap-extra-small $gap-extra-medium;
    border-radius: var(--radius-pill);
    background: var(--primary-button-color);
    color: var(--primary-button-text-color);
    text-decoration: none;

    &:hover,
    &:focus {
      background: var(--primary-button-color-hover);
      color: var(--primary-button-text-color);
      text-decoration: none;
    }
  }
}
</style>
