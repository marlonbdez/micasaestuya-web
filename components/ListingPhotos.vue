<script setup lang="ts">
export interface IListingPhoto {
  id: string
  url: string
}

defineProps<{
  photos: IListingPhoto[]
  max: number
  disabled: boolean
  saving: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  select: [files: File[]]
  remove: [id: string]
}>()

const { t } = useI18n()
</script>

<template>
  <fieldset class="listing-photos">
    <legend class="listing-photos__legend">
      {{ t('publish_listing.fields.photos') }}
    </legend>
    <BaseFileInput
      id="listing-photos"
      accept="image/*"
      multiple
      :disabled="disabled"
      :label="t('publish_listing.fields.photos_add')"
      :hint="t('publish_listing.fields.photos_hint', { max })"
      :error-message="errorMessage"
      @select="(files: File[]) => emit('select', files)"
    />
    <p v-if="saving" class="listing-photos__status">
      <BaseSpinner />
      {{ t('publish_listing.fields.photos_saving') }}
    </p>
    <ul v-if="photos.length" class="listing-photos__list">
      <li
        v-for="(photo, index) in photos"
        :key="photo.id"
        class="listing-photos__item"
      >
        <img
          class="listing-photos__image"
          :src="photo.url"
          :alt="t('publish_listing.fields.photos_alt', { position: index + 1 })"
        />
        <span v-if="index === 0" class="listing-photos__badge">
          {{ t('publish_listing.fields.photos_main') }}
        </span>
        <BaseCta
          variant="ghost"
          size="sm"
          type="button"
          class="listing-photos__remove"
          :aria-label="t('publish_listing.fields.photos_remove')"
          @click="emit('remove', photo.id)"
        >
          <BaseIcon icon="close" size="xs" />
        </BaseCta>
      </li>
    </ul>
  </fieldset>
</template>

<style lang="scss" scoped>
.listing-photos {
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;

  &__legend {
    @include font-outfit-light;
    color: var(--input-text-color);
    font-size: $font-size-md;
    padding: 0;
    margin: 0 0 $gap-small;
  }

  &__status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $gap-small;
    color: var(--text-2);
    margin: $gap-medium 0 0;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(px-to-rem(120), 1fr));
    gap: $gap-small;
    list-style: none;
    padding: 0;
    margin: $gap-medium 0 0;
  }

  &__item {
    position: relative;
    border-radius: var(--radius-sm);
    overflow: hidden;
    background: var(--bg-2);
  }

  // La proporción la fija la rejilla, no la foto: si no, cada miniatura
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
    padding: $gap-tiny $gap-small;
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
}
</style>
