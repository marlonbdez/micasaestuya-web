<script setup lang="ts">
defineI18nRoute({
  paths: {
    'es-CU': '/publicar-anuncio/fotos',
    'es-DO': '/publicar-anuncio/fotos',
    'en-CU': '/post-ad/photos',
    'en-DO': '/post-ad/photos'
  }
})

const { t } = useI18n()
const {
  previews,
  isSaving,
  errorKey,
  canAddMore,
  maxPhotos,
  load,
  add,
  remove
} = useAdPhotos()

onMounted(load)
</script>

<template>
  <section class="photos-step">
    <h1 class="photos-step__title">
      {{ t('post_ad.photos.title') }}
    </h1>

    <BaseFileInput
      id="ad-photos"
      accept="image/*"
      multiple
      :disabled="!canAddMore || isSaving"
      :label="t('post_ad.photos.add_label')"
      :hint="t('post_ad.photos.hint', { max: maxPhotos })"
      :error-message="errorKey ? t(errorKey, { max: maxPhotos }) : ''"
      @select="add"
    />

    <p v-if="isSaving" class="photos-step__status">
      <BaseSpinner />
      {{ t('post_ad.photos.saving') }}
    </p>

    <ul v-if="previews.length" class="photos-step__grid">
      <li
        v-for="(preview, index) in previews"
        :key="preview.id"
        class="photos-step__item"
      >
        <img
          class="photos-step__image"
          :src="preview.url"
          :alt="t('post_ad.photos.alt', { position: index + 1 })"
        />
        <span v-if="index === 0" class="photos-step__badge">
          {{ t('post_ad.photos.main') }}
        </span>
        <BaseCta
          variant="ghost"
          size="sm"
          class="photos-step__remove"
          :aria-label="t('post_ad.photos.remove')"
          @click="remove(preview.id)"
        >
          <BaseIcon icon="close" size="xs" />
        </BaseCta>
      </li>
    </ul>
    <p v-else class="photos-step__empty">
      {{ t('post_ad.photos.empty') }}
    </p>
  </section>
</template>

<style lang="scss" scoped>
.photos-step {
  &__title {
    @include font-outfit-semibold;
    font-size: $font-size-lg;
    margin: 0 0 $gap-extra-medium;
  }

  &__status,
  &__grid,
  &__empty {
    margin-top: $gap-extra-medium;
  }

  &__status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $gap-small;
    color: var(--text-2);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(px-to-rem(120), 1fr));
    gap: $gap-small;
    list-style: none;
    padding: 0;
  }

  &__item {
    position: relative;
    border-radius: var(--radius-sm);
    overflow: hidden;
    background: var(--bg-2);
  }

  // La proporción la fija la rejilla, no la foto: sin esto cada miniatura
  // tendría una altura distinta.
  &__image {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }

  &__badge {
    position: absolute;
    left: $gap-extra-tiny;
    bottom: $gap-extra-tiny;
    padding: px-to-rem(2) $gap-small;
    border-radius: var(--radius-pill);
    background: var(--warm);
    color: var(--bg);
    font-size: $font-size-sm;
  }

  &__remove {
    position: absolute;
    top: $gap-extra-tiny;
    right: $gap-extra-tiny;
    background: var(--bg);
    border-radius: var(--radius-pill);
  }

  &__empty {
    color: var(--text-3);
    text-align: center;
  }
}
</style>
