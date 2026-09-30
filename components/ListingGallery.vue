<script setup lang="ts">
const props = defineProps<{ photos: string[] }>()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const dialog = ref<HTMLDialogElement>()

// 5 fotos forman el mosaico completo, 3 una grande y dos pequeñas, y con
// menos, una sola.
const shown = computed(() =>
  props.photos.slice(
    0,
    props.photos.length >= 5 ? 5 : props.photos.length >= 3 ? 3 : 1
  )
)

// El visor vive en la URL (`?fotos`): así el botón Atrás lo cierra en vez de
// sacarte de la página.
const isOpen = computed(() => 'fotos' in route.query)
const open = () => router.push({ query: { fotos: null } })
const close = () => router.back()

const sync = (value: boolean) =>
  value ? dialog.value?.showModal() : dialog.value?.close()

watch(isOpen, sync)
onMounted(() => sync(isOpen.value))

const alt = (index: number) =>
  t('listing.photo_alt', { position: index + 1, total: props.photos.length })
</script>

<template>
  <div class="listing-gallery">
    <ul
      :class="`listing-gallery__grid listing-gallery__grid--${shown.length}`"
      @click="open"
    >
      <li v-for="(photo, index) in shown" :key="photo">
        <img class="listing-gallery__photo" :src="photo" :alt="alt(index)" />
      </li>
    </ul>
    <BaseCta
      v-if="photos.length > 1"
      class="listing-gallery__count"
      variant="secondary"
      size="sm"
      @click="open"
    >
      {{ t('listing.photos_count', { count: photos.length }, photos.length) }}
    </BaseCta>

    <dialog
      ref="dialog"
      class="listing-gallery__dialog"
      @cancel.prevent="close"
    >
      <BaseCta
        class="listing-gallery__close"
        variant="flat"
        :aria-label="t('modals.close')"
        @click="close"
      >
        <BaseIcon icon="close" />
      </BaseCta>
      <ul class="listing-gallery__all">
        <li v-for="(photo, index) in photos" :key="photo">
          <img
            class="listing-gallery__photo"
            :src="photo"
            :alt="alt(index)"
            loading="lazy"
          />
        </li>
      </ul>
    </dialog>
  </div>
</template>

<style lang="scss" scoped>
.listing-gallery {
  position: relative;
  margin-bottom: $gap-extra-medium;

  &__grid,
  &__all {
    display: grid;
    gap: $gap-small;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__grid {
    cursor: pointer;

    li:not(:first-child) {
      display: none;
    }

    @include media-breakpoint-up(md) {
      height: px-to-rem(400);
      overflow: hidden;
      border-radius: var(--radius);

      li:not(:first-child) {
        display: block;
      }

      &--3 {
        grid-template-columns: 2fr 1fr;
      }

      &--5 {
        grid-template-columns: 2fr 1fr 1fr;
      }

      &--3 li:first-child,
      &--5 li:first-child {
        grid-row: span 2;
      }
    }
  }

  &__photo {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: var(--bg-3);
  }

  &__grid &__photo {
    aspect-ratio: 3 / 2;

    @include media-breakpoint-up(md) {
      aspect-ratio: auto;
    }
  }

  &__count {
    position: absolute;
    right: $gap-medium;
    bottom: $gap-medium;
  }

  &__dialog {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    background: var(--bg);
    color: var(--text);
    overscroll-behavior: contain;
  }

  // Con el visor abierto, la página de detrás no se desplaza.
  :global(body:has(.listing-gallery__dialog[open])) {
    overflow: hidden;
  }

  &__close {
    position: sticky;
    top: 0;
    z-index: 1;
    margin: $gap-small;
    background: var(--bg);
  }

  &__all {
    max-width: px-to-rem(900);
    margin: 0 auto;
    padding: 0 $gap-medium $gap-large;

    img {
      border-radius: var(--radius);
    }
  }
}
</style>
