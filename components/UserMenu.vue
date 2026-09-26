<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { AuthModalMode, ThemeType } from '~/core/types'

interface MenuItem {
  id: string
  icon: string
  label: string
  dataCy?: string
  value?: string
  to?: string
  disabled?: boolean
  strong?: boolean
  keepOpen?: boolean
  action?: () => void
}

interface MenuSection {
  narrowOnly?: boolean
  items: MenuItem[]
}

const authStore = useAuthStore()
const { t, locale } = useI18n()
const { isLogged, name, user } = storeToRefs(authStore)
const localePath = useLocalePath()
const colorMode = useColorMode()

const root = ref<HTMLElement | null>(null)
const trigger = ref<{ $el: HTMLElement } | null>(null)
const isOpen = ref(false)

const initial = computed(() => name.value?.charAt(0).toUpperCase())
const fullName = computed(() =>
  [user.value?.firstName, user.value?.lastName].filter(Boolean).join(' ')
)
const localeLabel = computed(() => {
  const [language, country] = locale.value.split('-')
  return `${language.toUpperCase()} (${country})`
})
const isDark = computed(() => colorMode.value === ThemeType.Dark.toLowerCase())

const toggleTheme = () => {
  const next = isDark.value ? ThemeType.Light : ThemeType.Dark
  colorMode.preference = next.toLowerCase()
}

const guestItems = computed<MenuItem[]>(() => [
  {
    id: 'login',
    icon: 'login',
    label: t('header.login'),
    dataCy: 'header-login-button',
    strong: true,
    action: () => authStore.showAuthModal(AuthModalMode.SignIn)
  },
  {
    id: 'sign-up',
    icon: 'person-add',
    label: t('header.sign_up'),
    dataCy: 'header-signup-button',
    action: () => authStore.showAuthModal(AuthModalMode.SignUp)
  }
])

const userItems = computed<MenuItem[]>(() => [
  {
    id: 'my-listings',
    icon: 'house',
    label: t('header.my_listings'),
    value: t('header.coming_soon'),
    dataCy: 'mylistings-dropdown-option',
    disabled: true
  }
])

const sections = computed<MenuSection[]>(() => [
  {
    narrowOnly: true,
    items: [
      {
        id: 'explore',
        icon: 'search',
        label: t('header.explore'),
        to: localePath('index')
      }
    ]
  },
  { items: isLogged.value ? userItems.value : guestItems.value },
  {
    items: [
      {
        id: 'language',
        icon: 'globe',
        label: t('header.language'),
        value: localeLabel.value,
        dataCy: 'header-i18n-button',
        action: () => authStore.showLocaleModal()
      },
      {
        id: 'theme',
        icon: isDark.value ? 'sun' : 'moon',
        label: t('header.theme'),
        value: t(isDark.value ? 'header.theme_dark' : 'header.theme_light'),
        dataCy: 'theme-switcher-button',
        keepOpen: true,
        action: toggleTheme
      }
    ]
  },
  {
    items: [
      {
        id: 'faq',
        icon: 'help',
        label: t('header.faq'),
        to: localePath('faq')
      }
    ]
  },
  ...(isLogged.value
    ? [
        {
          items: [
            {
              id: 'logout',
              icon: 'exit',
              label: t('header.logout'),
              dataCy: 'logout-dropdown-option',
              action: () => authStore.logout()
            }
          ]
        }
      ]
    : [])
])

const close = () => {
  isOpen.value = false
}

const closeAndFocus = () => {
  if (!isOpen.value) return
  close()
  trigger.value?.$el.focus()
}

const select = ({ action, keepOpen }: MenuItem) => {
  if (!keepOpen) close()
  action?.()
}

onClickOutside(root, close)
</script>

<template>
  <div ref="root" class="user-menu" @keydown.esc="closeAndFocus">
    <BaseCta
      ref="trigger"
      data-cy="header-menu-button"
      variant="flat"
      class="user-menu__trigger"
      :aria-label="t('header.menu')"
      aria-controls="user-menu-panel"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <BaseIcon icon="menu" size="sm" />
      <span
        class="user-menu__avatar"
        :class="{ 'user-menu__avatar--guest': !isLogged }"
        aria-hidden="true"
      >
        <template v-if="isLogged">{{ initial }}</template>
        <BaseIcon v-else icon="person" size="sm" />
      </span>
    </BaseCta>

    <div v-if="isOpen" id="user-menu-panel" class="user-menu__panel">
      <div v-if="isLogged" class="user-menu__identity">
        <span
          class="user-menu__avatar user-menu__avatar--lg"
          aria-hidden="true"
        >
          {{ initial }}
        </span>
        <span class="user-menu__identity-text">
          <span class="user-menu__name">{{ fullName }}</span>
          <span class="user-menu__email">{{ user?.email }}</span>
        </span>
      </div>

      <ul class="user-menu__list">
        <template v-for="(section, index) in sections" :key="index">
          <li
            v-for="item in section.items"
            :key="item.id"
            class="user-menu__item"
            :class="{ 'user-menu__item--narrow-only': section.narrowOnly }"
          >
            <BaseCta
              variant="flat"
              class="user-menu__row"
              :class="{ 'user-menu__row--strong': item.strong }"
              :is-link="!!item.to"
              :to="item.to"
              :disabled="item.disabled"
              :data-cy="item.dataCy"
              @click="select(item)"
            >
              <BaseIcon :icon="item.icon" size="sm" />
              <span>{{ item.label }}</span>
              <span v-if="item.value" class="user-menu__value">
                {{ item.value }}
              </span>
            </BaseCta>
          </li>
          <li
            v-if="index < sections.length - 1"
            class="user-menu__separator"
            :class="{ 'user-menu__separator--narrow-only': section.narrowOnly }"
            role="separator"
          />
        </template>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-menu {
  position: relative;

  @include media-breakpoint-down(xs) {
    position: static;
  }

  &__trigger.btn.flat {
    gap: $gap-small;
    min-height: px-to-rem(44);
    padding: 0 px-to-rem(6) 0 $gap-medium;
    border: px-to-rem(1) solid var(--border);
    border-radius: var(--radius-pill);
    background-color: var(--bg);
    color: var(--text);

    &:not(:disabled):hover,
    &:not(:disabled):focus {
      background-color: var(--bg-2);
    }

    &:focus-visible {
      outline: px-to-rem(2) solid var(--accent);
      outline-offset: px-to-rem(2);
    }
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: px-to-rem(32);
    height: px-to-rem(32);
    border-radius: 50%;
    background-color: var(--accent);
    color: var(--accent-inv);
    @include font-outfit-semibold;
    font-size: $font-size-md;

    &--guest {
      background-color: var(--bg-3);
      color: var(--text-2);
    }

    &--lg {
      width: px-to-rem(44);
      height: px-to-rem(44);
      font-size: $font-size-lg;
    }
  }

  &__panel {
    position: absolute;
    top: calc(100% + #{$gap-tiny});
    right: 0;
    width: px-to-rem(300);
    padding: $gap-tiny 0;
    background-color: var(--bg);
    border: px-to-rem(1) solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--card-shadow-hover);
    z-index: $zindex-dropdown;

    @include media-breakpoint-down(xs) {
      left: $gap-small;
      right: $gap-small;
      width: auto;
    }
  }

  &__identity {
    display: flex;
    align-items: center;
    gap: $gap-small;
    padding: $gap-small $gap-medium;
    margin-bottom: $gap-tiny;
    border-bottom: px-to-rem(1) solid var(--border);
  }

  &__identity-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__name {
    @include font-outfit-semibold;
    font-size: $font-size-md;
    color: var(--text);
  }

  &__email {
    @include font-outfit-regular;
    font-size: $font-size-sm;
    color: var(--text-2);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__item,
  &__separator {
    &--narrow-only {
      display: none;

      @include media-breakpoint-down(xs) {
        display: block;
      }
    }
  }

  &__separator {
    height: px-to-rem(1);
    margin: $gap-tiny 0;
    background-color: var(--border);
  }

  &__panel .user-menu__row.flat {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: $gap-small;
    width: 100%;
    min-height: px-to-rem(44);
    padding: 0 $gap-medium;
    border-radius: 0;
    background-color: transparent;
    color: var(--text);
    text-decoration: none;
    text-align: left;
    letter-spacing: normal;
    @include font-outfit-medium;
    font-size: $font-size-md;

    :deep(svg) {
      fill: var(--text-2);
    }

    &:not(:disabled):hover,
    &:not(:disabled):focus {
      background-color: var(--bg-2);
      color: var(--text);
      text-decoration: none;
    }

    &:focus-visible {
      outline: px-to-rem(2) solid var(--accent);
      outline-offset: px-to-rem(-2);
    }

    &:disabled {
      opacity: 0.55;
    }
  }

  &__panel .user-menu__row--strong.flat {
    @include font-outfit-semibold;
  }

  &__panel .user-menu__row &__value {
    margin-left: auto;
    @include font-outfit-regular;
    font-size: $font-size-sm;
    color: var(--text-2);
  }
}
</style>
