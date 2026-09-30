<script setup lang="ts">
import { MAX_PHOTOS } from '~/composables/useListingForm'
import type { IListingFormValues } from '~/composables/useListingForm'
import type { IListingCreateInput } from '~/core/types'
import { useAuthStore } from '~/stores/auth'

defineI18nRoute({
  paths: {
    'es-CU': '/mis-alojamientos/[id]/editar',
    'es-DO': '/mis-alojamientos/[id]/editar',
    'en-CU': '/my-listings/[id]/edit',
    'en-DO': '/my-listings/[id]/edit'
  }
})

definePageMeta({
  layout: 'minimal',
  middleware: [
    'auth',
    () => {
      if (useAuthStore().isLogged) return
      return navigateTo(useLocalePath()('explore'), { replace: true })
    }
  ]
})

const { t } = useI18n()
const localePath = useLocalePath()
const authStore = useAuthStore()
const listingId = useRoute().params.id as string

const { listing, status, load } = useListingDetail(listingId)
const { save, discardPhotos } = useListingEdit(listingId)

// Un alojamiento ajeno se trata como si no existiera, igual que hace la api.
const isOwner = computed(() => listing.value?.owner.id === authStore.user?.id)

// Las fotos que ya tenía están en R2 y se ven por su URL; las que se quitan se
// borran al guardar, no antes: hasta entonces se puede cambiar de idea. Las
// nuevas se preparan en el navegador igual que al publicar.
const kept = ref<string[]>([])
const removed = ref<string[]>([])
const newIds = ref<string[]>([])

watch(listing, (loaded) => {
  if (loaded) kept.value = [...loaded.photos]
})

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

const photos = computed(() => [
  ...kept.value.map((url) => ({ id: url, url: `${url}-thumb` })),
  ...previews.value
])

const removePhoto = (id: string) => {
  if (!kept.value.includes(id)) return removeNewPhoto(id)
  kept.value = kept.value.filter((url) => url !== id)
  // Para la api, una foto es el último tramo de su URL.
  removed.value.push(id.split('/').pop() as string)
}

const initialValues = computed<IListingFormValues | null>(() =>
  listing.value
    ? {
        title: listing.value.title,
        region: listing.value.region,
        description: listing.value.description,
        tasks: [...listing.value.tasks],
        capacity: String(listing.value.capacity),
        whatsapp: listing.value.whatsapp
      }
    : null
)

const isSaving = ref(false)
const saveFailed = ref(false)

const onSubmit = async (input: IListingCreateInput) => {
  isSaving.value = true
  saveFailed.value = false
  try {
    await save(input, removed.value, newIds.value)
    newIds.value = []
    await navigateTo(localePath('my-listings'))
  } catch (error) {
    console.error('Unable to save the listing', error)
    saveFailed.value = true
  } finally {
    isSaving.value = false
  }
}

// Si se sale sin guardar, las fotos nuevas que ya se habían preparado sobran.
onBeforeUnmount(() => {
  if (newIds.value.length) discardPhotos(newIds.value).catch(console.error)
})

useHead(() => ({ title: t('edit_listing.title') }))

onMounted(load)
</script>

<template>
  <main class="edit-listing">
    <BaseCta is-link class="edit-listing__back" :to="localePath('my-listings')">
      <BaseIcon icon="chevron-left" size="sm" />
      {{ t('edit_listing.back') }}
    </BaseCta>

    <div v-if="status === 'loading'">
      <BaseSkeleton class="edit-listing__skeleton" />
    </div>

    <div v-else-if="status === 'error'" class="edit-listing__state">
      <BaseAlert variant="error">{{ t('edit_listing.load_error') }}</BaseAlert>
      <BaseCta variant="secondary" @click="load">
        {{ t('explore.retry') }}
      </BaseCta>
    </div>

    <p
      v-else-if="status === 'not-found' || !isOwner"
      class="edit-listing__state"
    >
      {{ t('edit_listing.not_found') }}
    </p>

    <template v-else-if="initialValues">
      <h1 class="edit-listing__title">{{ t('edit_listing.title') }}</h1>
      <ListingForm
        :initial-values="initialValues"
        :photos="photos"
        :photo-saving="isSavingPhoto"
        :photo-error="photoError"
        :submit-label="t('edit_listing.submit')"
        :submitting="isSaving"
        :error="saveFailed ? t('edit_listing.save_error') : ''"
        @add-photos="addPhotos"
        @remove-photo="removePhoto"
        @submit="onSubmit"
      />
    </template>
  </main>
</template>

<style lang="scss" scoped>
.edit-listing {
  max-width: px-to-rem(680);
  margin: 0 auto;
  padding: $gap-large $gap-medium $gap-extra-huge;

  &__back {
    display: inline-flex;
    align-items: center;
    margin-bottom: $gap-large;
    color: var(--text);
    text-decoration: none;
  }

  &__title {
    @include font-outfit-semibold;
    font-size: px-to-rem(30);
    margin: 0 0 $gap-large;
  }

  &__skeleton {
    height: px-to-rem(480);
    border-radius: var(--radius);
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
}
</style>
