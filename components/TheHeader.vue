<script setup lang="ts">
import { useI18n } from 'vue-i18n'

withDefaults(defineProps<{ minimal?: boolean }>(), { minimal: false })

const { t } = useI18n()
const localePath = useLocalePath()
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
              <span class="header__publish-full">{{
                t('header.publish')
              }}</span>
              <span class="header__publish-short">{{
                t('header.publish_short')
              }}</span>
            </BaseCta>
          </li>
          <li class="header__item">
            <UserMenu />
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
  z-index: $zindex-fixed;
  background: var(--bg);
  border-bottom: px-to-rem(1) solid var(--border);

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $gap-extra-medium;
    min-height: px-to-rem(66);

    &::before,
    &::after {
      content: none;
    }
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
  }

  // BaseCta en modo enlace es texto subrayado; en el header es navegación.
  &__link {
    @include font-outfit-medium;
    padding: $gap-small $gap-extra-small;
    color: var(--text-2);
    letter-spacing: normal;
    text-decoration: none;

    &:hover,
    &:focus {
      color: var(--text);
      text-decoration: none;
    }
  }

  &__publish-short {
    display: none;

    @include media-breakpoint-down(xs) {
      display: inline;
    }
  }

  &__publish-full {
    @include media-breakpoint-down(xs) {
      display: none;
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
    letter-spacing: normal;
    text-decoration: none;
    white-space: nowrap;

    &:hover,
    &:focus {
      background: var(--primary-button-color-hover);
      color: var(--primary-button-text-color);
      text-decoration: none;
    }
  }
}
</style>
