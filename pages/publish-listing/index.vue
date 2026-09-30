<script setup lang="ts">
import { storeToRefs } from 'pinia'
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

// Antes de pintar el formulario: los valores iniciales salen del borrador.
listingDraftStore.hydrate()
const { draft } = storeToRefs(listingDraftStore)

// Las fotos se guardan como ids en el borrador; los ficheros, en IndexedDB.
const photoIds = computed({
  get: () => draft.value.photos,
  set: (ids) => listingDraftStore.update({ photos: ids })
})

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

const onSubmit = () => {
  if (isLogged.value) return publish()
  isWaitingForLogin.value = true
  authStore.showAuthModal()
}
</script>

<template>
  <main class="publish-listing">
    <h1 class="publish-listing__title">{{ t('publish_listing.title') }}</h1>
    <p class="publish-listing__intro">{{ t('publish_listing.intro') }}</p>

    <ListingForm
      :initial-values="draft"
      :submit-label="t('publish_listing.submit')"
      :submitting="isPublishing"
      :error="publishFailed ? t('publish_listing.errors.publish') : ''"
      require-terms
      @change="listingDraftStore.update"
      @submit="onSubmit"
    >
      <template #photos>
        <ListingPhotos v-model:new-ids="photoIds" />
      </template>
    </ListingForm>
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
}
</style>
