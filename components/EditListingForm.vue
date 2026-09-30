<script setup lang="ts">
import { array, string } from 'yup'
import { MAX_PHOTOS, useListingForm } from '~/composables/useListingForm'
import type { IListingDetail } from '~/core/types'
import { toCreateInput } from '~/stores/listingDraft'

const props = defineProps<{ listing: IListingDetail }>()

const { t } = useI18n()
const localePath = useLocalePath()

// La foto de la api es una URL; lo que hay que mandar para quitarla es el
// último tramo, que es el id que puso la api.
const photoId = (url: string) => url.split('/').pop() as string

// Las que ya tenía siguen en R2; las que se quitan se borran al guardar, no
// antes: hasta entonces se puede cambiar de idea.
const kept = ref([...props.listing.photos])
const removed = ref<string[]>([])
const newIds = ref<string[]>([])

const {
  handleSubmit,
  errors,
  defineField,
  isRegionComplete,
  focusFirstInvalid
} = useListingForm(
  {
    title: props.listing.title,
    region: props.listing.region,
    description: props.listing.description,
    tasks: [...props.listing.tasks],
    capacity: String(props.listing.capacity),
    whatsapp: props.listing.whatsapp
  },
  {
    schema: {
      photos: array()
        .of(string())
        .min(1, () => t('publish_listing.errors.photos_required'))
    },
    values: { photos: [...props.listing.photos] }
  }
)

const [title] = defineField('title')
const [region] = defineField('region')
const [description] = defineField('description')
const [tasks] = defineField('tasks')
const [capacity] = defineField('capacity')
const [whatsapp] = defineField('whatsapp')
const [photos] = defineField('photos')

const {
  previews,
  isSaving: isSavingPhoto,
  error: photoError,
  add: addPhotos,
  remove: removeNewPhoto
} = useDraftPhotos({
  getIds: () => newIds.value,
  setIds: (ids) => (newIds.value = ids),
  max: () => MAX_PHOTOS - kept.value.length
})

const { save, discardPhotos } = useListingEdit(props.listing.id)

const shown = computed(() => [
  ...kept.value.map((url) => ({ id: url, url: `${url}-thumb` })),
  ...previews.value
])

watch(
  shown,
  (list) => {
    photos.value = list.map(({ id }) => id)
  },
  { immediate: true }
)

const removePhoto = (id: string) => {
  if (!kept.value.includes(id)) return removeNewPhoto(id)
  kept.value = kept.value.filter((url) => url !== id)
  removed.value.push(photoId(id))
}

const isSaving = ref(false)
const saveFailed = ref(false)

const onSubmit = handleSubmit(
  async () => {
    isSaving.value = true
    saveFailed.value = false
    try {
      await save(
        toCreateInput({
          title: title.value,
          region: region.value,
          photos: [],
          description: description.value,
          tasks: tasks.value,
          capacity: Number(capacity.value),
          whatsapp: whatsapp.value
        }),
        removed.value,
        newIds.value
      )
      newIds.value = []
      await navigateTo(localePath('my-listings'))
    } catch (error) {
      console.error('Unable to save the listing', error)
      saveFailed.value = true
    } finally {
      isSaving.value = false
    }
  },
  ({ errors: invalid }) => focusFirstInvalid(invalid)
)

// Si se sale sin guardar, las fotos nuevas que ya se habían preparado sobran.
onBeforeUnmount(() => {
  if (newIds.value.length) discardPhotos(newIds.value).catch(() => {})
})
</script>

<template>
  <h1 class="edit-form__title">{{ t('edit_listing.title') }}</h1>

  <form class="edit-form" novalidate @submit.prevent="onSubmit">
    <ListingFields
      @region-complete="(value: boolean) => (isRegionComplete = value)"
    >
      <ListingPhotos
        :photos="shown"
        :max="MAX_PHOTOS"
        :disabled="shown.length >= MAX_PHOTOS || isSavingPhoto"
        :saving="isSavingPhoto"
        :error-message="
          photoError
            ? t(`publish_listing.errors.photos.${photoError}`, {
                max: MAX_PHOTOS
              })
            : errors.photos ?? ''
        "
        @select="addPhotos"
        @remove="removePhoto"
      />
    </ListingFields>

    <BaseAlert v-if="saveFailed" variant="error">
      {{ t('edit_listing.save_error') }}
    </BaseAlert>

    <div class="edit-form__submit">
      <BaseCta type="submit" size="lg" :disabled="isSaving">
        <BaseSpinner v-if="isSaving" />
        {{ t('edit_listing.submit') }}
      </BaseCta>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.edit-form {
  display: flex;
  flex-direction: column;
  gap: $gap-large;

  &__title {
    @include font-outfit-semibold;
    font-size: px-to-rem(30);
    margin: 0 0 $gap-large;
  }

  &__submit {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $gap-medium;
  }
}
</style>
