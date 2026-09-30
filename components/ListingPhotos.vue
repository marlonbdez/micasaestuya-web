<script setup lang="ts">
import { useField } from 'vee-validate'
import { MAX_PHOTOS } from '~/composables/useListingForm'

// Las fotos de un alojamiento, como un campo más de ListingForm. Enseña dos
// tipos de foto en una sola lista:
// - `existing`: las que ya están guardadas (URLs). Quitarlas solo las apunta
//   en `removed`; quien guarda las borra de verdad.
// - `newIds`: las que se acaban de elegir, que esperan en IndexedDB a que
//   quien guarda las suba.
const props = withDefaults(defineProps<{ existing?: string[] }>(), {
  existing: () => []
})
const newIds = defineModel<string[]>('newIds', { required: true })
const removed = defineModel<string[]>('removed', { default: () => [] })

const { t } = useI18n()

// Para la api, una foto es el último tramo de su URL.
const apiId = (url: string) => url.split('/').pop() as string

const kept = computed(() =>
  props.existing.filter((url) => !removed.value.includes(apiId(url)))
)

const {
  previews,
  isSaving,
  error,
  load,
  add,
  remove: removeNew
} = useDraftPhotos({
  getIds: () => newIds.value,
  setIds: (ids) => (newIds.value = ids),
  max: () => MAX_PHOTOS - kept.value.length
})

const photos = computed(() => [
  ...kept.value.map((url) => ({ id: url, url: `${url}-thumb` })),
  ...previews.value
])

const removePhoto = (id: string) => {
  if (props.existing.includes(id)) removed.value = [...removed.value, apiId(id)]
  else removeNew(id)
}

// El formulario solo necesita saber si hay alguna. Se revalida solo si ya
// estaba el aviso, para que desaparezca al añadir una foto.
const { setValue, errorMessage } = useField<string[]>('photos')
watch(
  photos,
  (list) =>
    setValue(
      list.map(({ id }) => id),
      !!errorMessage.value
    ),
  { immediate: true }
)

const message = computed(() =>
  error.value
    ? t(`publish_listing.errors.photos.${error.value}`, { max: MAX_PHOTOS })
    : errorMessage.value ?? ''
)

onMounted(load)
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
      :disabled="photos.length >= MAX_PHOTOS || isSaving"
      :label="t('publish_listing.fields.photos_add')"
      :hint="t('publish_listing.fields.photos_hint', { max: MAX_PHOTOS })"
      :error-message="message"
      @select="add"
    />
    <p v-if="isSaving" class="listing-photos__status">
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
          @click="removePhoto(photo.id)"
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
