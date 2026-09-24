<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'

withDefaults(defineProps<{ minimal?: boolean }>(), { minimal: false })

const authStore = useAuthStore()
const { t, locale } = useI18n()
const { isLogged, name } = storeToRefs(authStore)
const localePath = useLocalePath()

// "es-CU" → "ES (CU)", como en el prototipo.
const localeLabel = computed(() => {
  const [language, country] = locale.value.split('-')
  return `${language.toUpperCase()} (${country})`
})

const userOptions = computed(() => [
  // Deshabilitada hasta que exista el listado de alojamientos del usuario
  // (necesita GET /api/listings en api).
  {
    id: 'my-listings',
    dataTestId: 'mylistings-dropdown-option',
    value: t('header.my_listings'),
    icon: 'house',
    disabled: true
  },
  {
    id: 'logout',
    dataTestId: 'logout-dropdown-option',
    value: t('header.logout'),
    icon: 'exit',
    callback: () => authStore.logout()
  }
])
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <TheLogo />
      <nav v-if="!minimal" class="header__nav">
        <ul class="header__menu">
          <li class="header__item header__item--wide-only">
            <BaseCta
              is-link
              class="header__link"
              :to="localePath('index')"
              :aria-label="t('header.explore')"
            >
              {{ t('header.explore') }}
            </BaseCta>
          </li>
          <li class="header__item">
            <BaseCta
              is-link
              data-cy="header-publish-link"
              class="header__publish"
              :to="localePath('publish-listing')"
              :aria-label="t('header.publish')"
            >
              {{ t('header.publish') }}
            </BaseCta>
          </li>
          <li class="header__item header__item--divider" aria-hidden="true" />
          <li class="header__item">
            <ThemeSwitcher />
          </li>
          <li class="header__item">
            <BaseCta
              data-cy="header-i18n-button"
              variant="flat"
              :aria-label="t('header.change_locale')"
              @click="authStore.showLocaleModal"
            >
              <BaseIcon icon="globe" size="sm" />
              <span class="header__locale">{{ localeLabel }}</span>
            </BaseCta>
          </li>
          <!--
            El prototipo no dibuja login: se pide al publicar. Se queda aquí,
            discreto, porque es la única forma de entrar sin publicar y de
            cerrar sesión.
          -->
          <li v-if="!isLogged" class="header__item">
            <BaseCta
              data-cy="header-login-button"
              variant="flat"
              class="header__login"
              :aria-label="t('header.login')"
              @click="authStore.showAuthModal"
            >
              <BaseIcon icon="person" size="sm" />
              <span class="header__login-label">{{ t('header.login') }}</span>
            </BaseCta>
          </li>
          <li v-else class="header__item">
            <BaseDropdown id="user-options" :options="userOptions">
              <template #selector>
                <BaseCta
                  data-cy="header-logged-user-dropdown"
                  variant="flat"
                  aria-label="Logged user options"
                  class="header__user"
                >
                  {{ name?.charAt(0).toUpperCase() }}
                </BaseCta>
              </template>
            </BaseDropdown>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: $zindex-sticky;
  background: var(--bg);
  border-bottom: px-to-rem(1) solid var(--border);

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $gap-extra-medium;
    min-height: px-to-rem(66);
  }

  &__menu {
    display: flex;
    align-items: center;
    gap: $gap-extra-tiny;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__item {
    display: flex;
    align-items: center;

    // En móvil no cabe todo: "Explorar" es también el logo.
    &--wide-only {
      @include media-breakpoint-down(xs) {
        display: none;
      }
    }

    &--divider {
      width: px-to-rem(1);
      height: px-to-rem(22);
      margin: 0 $gap-extra-tiny;
      background: var(--border);
    }
  }

  // BaseCta en modo enlace es texto subrayado; en el header es navegación.
  &__link {
    @include font-outfit-medium;
    padding: $gap-small $gap-extra-small;
    color: var(--text-2);
    text-decoration: none;

    &:hover,
    &:focus {
      color: var(--text);
      text-decoration: none;
    }
  }

  // La acción principal del sitio: pastilla con el color de acento.
  &__publish {
    @include font-outfit-semibold;
    padding: $gap-small $gap-medium;
    border-radius: var(--radius-pill);
    background: var(--primary-button-color);
    color: var(--primary-button-text-color);
    font-size: $font-size-sm;
    text-decoration: none;
    white-space: nowrap;

    &:hover,
    &:focus {
      background: var(--primary-button-color-hover);
      color: var(--primary-button-text-color);
      text-decoration: none;
    }
  }

  &__locale {
    @include font-outfit-semibold;
    white-space: nowrap;
    font-size: $font-size-xs;
    color: var(--text-2);

    @include media-breakpoint-down(xs) {
      display: none;
    }
  }

  &__login-label {
    font-size: $font-size-sm;
    white-space: nowrap;

    @include media-breakpoint-down(xs) {
      display: none;
    }
  }

  &__user {
    width: px-to-rem(40);
    height: px-to-rem(40);
    min-height: auto;
    border-radius: 50%;
    padding: 0;
    @include font-outfit-semibold;
    font-size: $font-size-md;
    color: var(--header-logged-user-color);
    background-color: var(--header-logged-user-background-color);

    &:not(:disabled):hover,
    &:not(:disabled):focus {
      color: var(--header-logged-user-color-hover);
      background-color: var(--header-logged-user-background-color-hover);
    }
  }
}
</style>
