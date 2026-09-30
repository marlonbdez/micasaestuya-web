<script setup lang="ts">
import { array, boolean, string } from 'yup'
import { storeToRefs } from 'pinia'
import { MAX_PHOTOS, useListingForm } from '~/composables/useListingForm'
import { useListingDraftStore } from '~/stores/listingDraft'
import { useAuthStore } from '~/stores/auth'

defineI18nRoute({
  paths: {
    'es-CU': '/publicar-alojamiento',
    'es-DO': '/publicar-alojamiento',
    'en-CU': '/publish-listing',
    'en-DO': '/publish-listing'
  }
})

// No protege la página: se rellena sin cuenta. Está para restaurar la sesión
// desde el token guardado; sin él, un usuario ya logueado vería el modal.
definePageMeta({
  layout: 'minimal',
  middleware: ['auth']
})

const { t } = useI18n()
const localePath = useLocalePath()
const listingDraftStore = useListingDraftStore()
const authStore = useAuthStore()
const { isLogged } = storeToRefs(authStore)

// En el setup y antes de useForm: los valores iniciales salen del borrador.
listingDraftStore.hydrate()
const { draft } = storeToRefs(listingDraftStore)

const {
  handleSubmit,
  errors,
  defineField,
  isRegionComplete,
  focusFirstInvalid
} = useListingForm(
  {
    title: draft.value.title,
    region: draft.value.region,
    description: draft.value.description,
    tasks: [...draft.value.tasks],
    capacity: draft.value.capacity === null ? '' : String(draft.value.capacity),
    whatsapp: draft.value.whatsapp
  },
  {
    schema: {
      photos: array()
        .of(string())
        .min(1, () => t('publish_listing.errors.photos_required')),
      accepted: boolean().isTrue(() =>
        t('publish_listing.errors.terms_required')
      )
    },
    values: { photos: [...draft.value.photos], accepted: false }
  }
)

const [title] = defineField('title')
const [region] = defineField('region')
const [description] = defineField('description')
const [tasks] = defineField('tasks')
const [photos] = defineField('photos')
const [capacity] = defineField('capacity')
const [whatsapp] = defineField('whatsapp')
const [accepted] = defineField('accepted')

// El formulario es la vista; el store, lo que sobrevive a una recarga.
watch(title, (value) => listingDraftStore.update({ title: value ?? '' }))
watch(region, (value) => listingDraftStore.update({ region: value ?? null }))
watch(description, (value) =>
  listingDraftStore.update({ description: value ?? '' })
)
watch(tasks, (value) => listingDraftStore.update({ tasks: [...value] }))
watch(capacity, (value) => {
  const parsed = Number(value)
  listingDraftStore.update({
    capacity: value !== '' && Number.isInteger(parsed) ? parsed : null
  })
})
watch(whatsapp, (value) => listingDraftStore.update({ whatsapp: value ?? '' }))
// photos no tiene su propio v-model: useDraftPhotos ya escribe los ids en el
// store (getIds/setIds); esto solo refleja ese cambio en la validación.
watch(
  () => draft.value.photos,
  (ids) => {
    photos.value = [...ids]
  }
)

const {
  previews,
  isSaving,
  error: photoError,
  canAddMore,
  load: loadPhotos,
  add: addPhotos,
  remove: removePhoto
} = useDraftPhotos({
  getIds: () => listingDraftStore.draft.photos,
  setIds: (ids) => listingDraftStore.update({ photos: ids }),
  max: () => MAX_PHOTOS
})

onMounted(loadPhotos)

// --- Publicar -------------------------------------------------------------
// Identificarse no es un paso del formulario: se pide solo al final, y solo si
// hace falta. AuthModal ya escucha `showAuthModal`; aquí se espera a que el
// login ocurra y se sigue solo.
const isPublishing = ref(false)
const publishFailed = ref(false)
const isWaitingForLogin = ref(false)

const publish = async () => {
  isWaitingForLogin.value = false
  isPublishing.value = true
  publishFailed.value = false
  try {
    await listingDraftStore.publish()
    await navigateTo(localePath('publish-listing-published'))
  } catch {
    publishFailed.value = true
  } finally {
    isPublishing.value = false
  }
}

watch(isLogged, (logged) => {
  if (logged && isWaitingForLogin.value) publish()
})

// Si el modal se cierra sin identificarse, se cancela la publicación
// pendiente: un login posterior desde el header no debe publicar por sorpresa.
// Tras un login correcto isLogged ya es true y no se cancela nada.
authStore.$onAction(({ name }) => {
  if (name === 'hideAuthModal' && !isLogged.value) {
    isWaitingForLogin.value = false
  }
})

const onSubmit = handleSubmit(
  () => {
    if (isLogged.value) return publish()
    isWaitingForLogin.value = true
    authStore.showAuthModal()
  },
  ({ errors: invalid }) => focusFirstInvalid(invalid)
)
</script>

<template>
  <main class="publish-listing">
    <h1 class="publish-listing__title">{{ t('publish_listing.title') }}</h1>
    <p class="publish-listing__intro">{{ t('publish_listing.intro') }}</p>

    <form class="publish-listing__form" novalidate @submit.prevent="onSubmit">
      <ListingFields
        @region-complete="(value: boolean) => (isRegionComplete = value)"
      >
        <ListingPhotos
          :photos="previews"
          :max="MAX_PHOTOS"
          :disabled="!canAddMore || isSaving"
          :saving="isSaving"
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

      <BaseCheckbox
        id="listing-terms"
        v-model="accepted"
        :error-message="errors.accepted"
      >
        {{ t('publish_listing.terms') }}
      </BaseCheckbox>

      <BaseAlert v-if="publishFailed" variant="error">
        {{ t('publish_listing.errors.publish') }}
      </BaseAlert>

      <div class="publish-listing__submit">
        <BaseCta
          type="submit"
          size="lg"
          :disabled="isPublishing"
          :aria-label="t('publish_listing.submit')"
        >
          <BaseSpinner v-if="isPublishing" />
          {{ t('publish_listing.submit') }}
        </BaseCta>
      </div>
    </form>
  </main>
</template>

<style lang="scss" scoped>
.publish-listing {
  max-width: px-to-rem(680);
  margin: 0 auto;
  padding: $gap-huge $gap-medium $gap-extra-huge;

  &__title {
    @include font-outfit-semibold;
    font-size: px-to-rem(30);
    margin: 0 0 $gap-small;
  }

  &__intro {
    color: var(--text-2);
    line-height: 1.6;
    margin: 0 0 $gap-extra-large;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $gap-large;
  }

  &__submit {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $gap-medium;
  }
}
</style>
