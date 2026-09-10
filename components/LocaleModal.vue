<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { getLocale } from '~/core/localeUtils'

const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const authStore = useAuthStore()
const isVisible = ref(false)

const hideModal = () => {
  isVisible.value = false
}

const isSelectedLocale = (code: string): boolean => locale.value === code

onMounted(() => {
  authStore.$onAction(({ name }) => {
    if (name === 'showLocaleModal') {
      isVisible.value = true
    }
  })
})
</script>

<template>
  <Transition name="modal-in">
    <div v-if="isVisible" data-cy="locale-modal" class="modal">
      <div v-click-outside="hideModal" class="modal__dialog">
        <div class="modal__header">
          <h2 class="modal__title">{{ $t('modals.locale.title') }}</h2>
          <BaseCta
            class="modal__close"
            variant="flat"
            @click="isVisible = false"
          >
            <BaseIcon icon="close" size="md" />
          </BaseCta>
        </div>
        <div class="modal__content">
          <ul class="modal__list">
            <li
              v-for="{ code } in locales"
              :key="code"
              class="modal__list-item"
              :class="{ 'modal__list-item--selected': isSelectedLocale(code) }"
            >
              <BaseCta
                :href="switchLocalePath(code)"
                is-link
                is-external-link
                class="modal__list-item-content"
                @click="hideModal"
              >
                <BaseIcon
                  class="modal__list-item-icon"
                  :icon="getLocale(code).icon"
                  size="lg"
                />
                <div class="modal__list-item-meta">
                  <span class="modal__list-item-language">
                    {{ getLocale(code).language }}
                  </span>
                  <strong class="modal__list-item-country">
                    {{ getLocale(code).country }}
                  </strong>
                </div>
              </BaseCta>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: $zindex-modal-backdrop;
  backdrop-filter: blur(3px);

  @include media-breakpoint-up(sm) {
    background: var(--background-backdrop);
  }

  &__dialog {
    position: relative;
    background: var(--bg);
    height: 100%;
    border-radius: $corner-radius-sm;
    transition: height var(--transition);

    @include media-breakpoint-up(sm) {
      height: auto;
      margin: auto;
      max-width: px-to-rem(540);
    }
  }

  &__header {
    position: relative;
    height: px-to-rem(56);
    width: 100%;
    padding: $gap-medium;
    border-bottom: px-to-rem(1) solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    @include font-outfit-medium;
    font-size: px-to-rem(20);
    margin: 0;
    text-align: center;
    width: 100%;
  }

  &__content {
    padding: $gap-medium;
    border-radius: $corner-radius-sm;
    width: 100%;
    height: 100%;
    overflow: auto;

    @include media-breakpoint-up(sm) {
      height: auto;
      max-height: px-to-rem(700);
    }
  }

  &__button {
    width: 100%;
    margin-bottom: $gap-extra-medium;
  }

  // -------------------------------------------------------------------------
  // Lista de idiomas/región — BEM dentro de .modal
  // -------------------------------------------------------------------------

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: $gap-small;
  }

  &__list-item {
    flex-basis: 100%;
    padding: $gap-small;
    border-radius: $corner-radius-md;
    background-color: var(--input-background-color);
    transition: background-color var(--transition);
    border: px-to-rem(1) solid transparent;

    @include media-breakpoint-up(sm) {
      flex-basis: calc(50% - #{$gap-small} / 2);
    }

    &:hover {
      background-color: var(--bg-2);
    }

    &--selected {
      border-color: var(--accent);
      background-color: var(--bg-2);
    }

    &-content {
      display: flex;
      align-items: center;
      text-decoration: none;
      padding-left: 0;
    }

    &-meta {
      display: flex;
      flex-direction: column;
      margin-left: $gap-small;
      gap: $gap-tiny;
    }
  }
}
</style>
