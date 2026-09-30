<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

defineI18nRoute({
  paths: {
    'es-CU': '/mis-alojamientos',
    'es-DO': '/mis-alojamientos',
    'en-CU': '/my-listings',
    'en-DO': '/my-listings'
  }
})

definePageMeta({
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
const { items, status, load, remove } = useMyListings()

const confirming = ref<string | null>(null)
const deleting = ref(false)
const deleteFailed = ref(false)

const ask = (listingId: string) => {
  deleteFailed.value = false
  confirming.value = listingId
}

const confirmRemove = async (listingId: string) => {
  deleting.value = true
  deleteFailed.value = false
  try {
    await remove(listingId)
    confirming.value = null
  } catch (error) {
    console.error('Unable to delete listing', error)
    deleteFailed.value = true
  } finally {
    deleting.value = false
  }
}

onMounted(load)
</script>

<template>
  <main class="container my-listings">
    <section class="my-listings__intro">
      <h1 class="my-listings__title">{{ t('my_listings.title') }}</h1>
      <p class="my-listings__subtitle">{{ t('my_listings.subtitle') }}</p>
    </section>

    <ul v-if="status === 'loading'" class="my-listings__grid">
      <li v-for="n in 3" :key="n">
        <BaseSkeleton class="my-listings__skeleton" />
      </li>
    </ul>

    <div v-else-if="status === 'error'" class="my-listings__state">
      <BaseAlert variant="error">{{ t('my_listings.error') }}</BaseAlert>
      <BaseCta variant="secondary" @click="load">
        {{ t('explore.retry') }}
      </BaseCta>
    </div>

    <div v-else-if="!items.length" class="my-listings__state">
      <p>{{ t('my_listings.empty') }}</p>
      <BaseCta is-link :to="localePath('publish-listing')">
        {{ t('header.publish') }}
      </BaseCta>
    </div>

    <ul v-else class="my-listings__grid">
      <li v-for="listing in items" :key="listing.id" class="my-listings__item">
        <ListingCard :listing="listing" />

        <p v-if="!listing.photos.length" class="my-listings__note">
          {{ t('my_listings.no_photos') }}
        </p>

        <div v-if="confirming === listing.id" class="my-listings__confirm">
          <p>{{ t('my_listings.confirm') }}</p>
          <BaseAlert v-if="deleteFailed" variant="error">
            {{ t('my_listings.delete_error') }}
          </BaseAlert>
          <div class="my-listings__buttons">
            <BaseCta
              variant="secondary"
              size="sm"
              :disabled="deleting"
              @click="confirming = null"
            >
              {{ t('my_listings.cancel') }}
            </BaseCta>
            <BaseCta
              size="sm"
              :disabled="deleting"
              @click="confirmRemove(listing.id)"
            >
              {{ t('my_listings.delete') }}
            </BaseCta>
          </div>
        </div>
        <div v-else class="my-listings__buttons">
          <BaseCta
            is-link
            variant="secondary"
            size="sm"
            :to="
              localePath({
                name: 'edit-listing-id',
                params: { id: listing.id }
              })
            "
          >
            {{ t('my_listings.edit') }}
          </BaseCta>
          <BaseCta variant="ghost" size="sm" @click="ask(listing.id)">
            {{ t('my_listings.delete') }}
          </BaseCta>
        </div>
      </li>
    </ul>
  </main>
</template>

<style lang="scss" scoped>
.my-listings {
  padding-top: $gap-large;
  padding-bottom: $gap-huge;

  &__intro {
    max-width: px-to-rem(640);
    margin-bottom: $gap-large;
  }

  &__title {
    @include font-outfit-semibold;
    margin: 0 0 $gap-small;
    font-size: px-to-rem(32);
    line-height: 1.2;
  }

  &__subtitle {
    margin: 0;
    color: var(--text-2);
    line-height: 1.6;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(px-to-rem(260), 1fr));
    gap: $gap-extra-medium;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: $gap-small;
  }

  &__skeleton {
    aspect-ratio: 4 / 5;
    border-radius: var(--radius);
  }

  &__note,
  &__confirm p {
    margin: 0;
    color: var(--text-2);
    font-size: $font-size-sm;
  }

  &__confirm {
    display: flex;
    flex-direction: column;
    gap: $gap-small;
  }

  &__buttons {
    display: flex;
    gap: $gap-small;
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
