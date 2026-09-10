<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'

withDefaults(defineProps<{ minimal?: boolean }>(), { minimal: false })

const authStore = useAuthStore()
const { t } = useI18n()
const { isLogged, name } = storeToRefs(authStore)
const localePath = useLocalePath()

const userOptions = computed(() => [
  {
    id: 'my-ads',
    dataTestId: 'myads-dropdown-option',
    value: t('MY_ADS'),
    icon: 'pin',
    callback: () => navigateTo({ path: '/properties' })
  },
  {
    id: 'logout',
    dataTestId: 'logout-dropdown-option',
    value: t('LOGOUT'),
    icon: 'exit',
    callback: () => authStore.logout()
  }
])
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="brand">
        <TheLogo />
      </div>
      <nav v-if="!minimal" class="nav">
        <ul class="menu">
          <li class="menu-item visible-sm">
            <BaseCta
              variant="ghost"
              :to="localePath('post-ad-basic-info')"
              :aria-label="$t('header.advertise_property')"
            >
              <BaseIcon icon="megaphone" size="sm" />
              {{ $t('header.advertise_property') }}
            </BaseCta>
          </li>
          <li v-if="!isLogged" class="menu-item">
            <BaseCta
              data-cy="header-login-button"
              variant="flat"
              :aria-label="$t('header.login')"
              @click="authStore.showAuthModal"
            >
              <BaseIcon icon="person" size="sm" />
              {{ $t('header.login') }}
            </BaseCta>
          </li>
          <li class="menu-item menu-item--separator-left">
            <ThemeSwitcher />
          </li>
          <li class="menu-item menu-item--separator-left">
            <BaseCta
              data-cy="header-i18n-button"
              variant="flat"
              aria-label="Change country and language"
              @click="authStore.showLocaleModal"
            >
              <BaseIcon icon="globe" size="sm" />
              <span class="sr-only">Change country and language</span>
            </BaseCta>
          </li>
          <li v-if="isLogged" class="menu-item menu-item--separator-left">
            <BaseDropdown id="user-options" :options="userOptions">
              <template #selector>
                <BaseCta
                  data-cy="header-logged-user-dropdown"
                  variant="flat"
                  aria-label="Logged user options"
                  class="header-logged-button"
                >
                  {{ name.charAt(0).toUpperCase() }}
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
  position: relative;
  border-bottom: 0.0625rem solid var(--border-color);
  margin: 0;

  .container {
    display: flex;
    align-items: center;
    height: 4.125rem;
  }

  .brand {
    width: 40%;
  }

  .nav {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 60%;
  }

  .menu {
    display: flex;
    align-items: center;
    padding: 0;
  }

  .menu-item {
    display: flex;
    align-items: center;
    margin-right: $gap-extra-tiny;
    line-height: 1.375rem;

    @include media-breakpoint-up(sm) {
      margin-right: $gap-tiny;
    }

    &:last-child {
      margin-right: 0;
    }

    &--separator-left::before,
    &--separator-right::after {
      content: '';
      display: block;
      margin-right: $gap-small;
      margin-left: $gap-small;
      width: 0.0625rem;
      height: 1.5rem;
      background-color: var(--header-divider);
    }
  }

  .header-logged-button {
    width: 2.5rem;
    height: 2.5rem;
    min-height: auto;
    border-radius: 50%;
    font-weight: bold;
    font-size: 1rem;
    line-height: 2.5rem;
    text-align: center;
    padding: 0;
    color: var(--header-logged-user-color);
    background-color: var(--header-logged-user-background-color);

    &:hover,
    &:focus,
    &:not(:disabled):focus,
    &:not(:disabled):hover {
      color: var(--header-logged-user-color-hover);
      background-color: var(--header-logged-user-background-color-hover);
    }
  }
}
</style>
