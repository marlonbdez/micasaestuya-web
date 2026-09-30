<script setup lang="ts">
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

// Un alojamiento ajeno se trata como si no existiera, igual que hace la api.
const isOwner = computed(() => listing.value?.owner.id === authStore.user?.id)

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

    <EditListingForm v-else-if="listing" :listing="listing" />
  </main>
</template>

<style lang="scss" scoped>
.edit-listing {
  max-width: px-to-rem(680);
  margin: 0 auto;
  padding: $gap-large $gap-medium $gap-extra-huge;

  &__back {
    margin-bottom: $gap-large;
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
