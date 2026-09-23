<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { getLocale } from '~/core/localeUtils'
withDefaults(defineProps<{ minimal?: boolean }>(), { minimal: false })

const authStore = useAuthStore()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const SOURCE_CODE_URL = 'https://github.com/marlonbdez/micasaestuya-web'
</script>

<template>
  <footer class="footer">
    <div class="container">
      <nav v-if="!minimal" class="footer__links">
        <div class="footer__group">
          <h4 class="footer__group-title">{{ t('footer.about.title') }}</h4>
          <ul class="footer__group-list">
            <li class="footer__group-list-item">
              <BaseCta is-link to="/about-us">
                {{ t('footer.about.who_we_are') }}
              </BaseCta>
            </li>
            <li class="footer__group-list-item">
              <BaseCta is-link to="/sitemap">
                {{ t('footer.about.sitemap') }}
              </BaseCta>
            </li>
            <li class="footer__group-list-item">
              <BaseCta
                is-external-url
                :to="SOURCE_CODE_URL"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ t('footer.about.source_code') }}
              </BaseCta>
            </li>
          </ul>
        </div>
        <div class="footer__group">
          <h4 class="footer__group-title">{{ t('footer.help.title') }}</h4>
          <ul class="footer__group-list">
            <li class="footer__group-list-item">
              <BaseCta is-link to="/faq">{{ t('footer.help.faq') }}</BaseCta>
            </li>
            <li class="footer__group-list-item">
              <BaseCta is-link to="mailto:micasaestuya@gmail.com">
                {{ t('footer.help.contact') }}
              </BaseCta>
            </li>
          </ul>
        </div>
        <div class="footer__group">
          <h4 class="footer__group-title">{{ t('footer.legal.title') }}</h4>
          <ul class="footer__group-list">
            <li class="footer__group-list-item">
              <BaseCta is-link to="/privacy-policy">
                {{ t('footer.legal.privacy') }}
              </BaseCta>
            </li>
            <li class="footer__group-list-item">
              <BaseCta is-link to="/cookie-policy">
                {{ t('footer.legal.cookies') }}
              </BaseCta>
            </li>
            <li class="footer__group-list-item">
              <BaseCta is-link to="/terms-and-conditions">
                {{ t('footer.legal.terms') }}
              </BaseCta>
            </li>
          </ul>
        </div>
        <div class="footer__group">
          <h4 class="footer__group-title">{{ t('footer.hosts.title') }}</h4>
          <ul class="footer__group-list">
            <li class="footer__group-list-item">
              <BaseCta is-link :to="localePath('publish-listing')">
                {{ t('footer.hosts.publish') }}
              </BaseCta>
            </li>
            <li class="footer__group-list-item">
              <BaseCta is-link to="#">{{ t('footer.hosts.share') }}</BaseCta>
            </li>
          </ul>
        </div>
      </nav>

      <div class="footer__bottom">
        <p class="footer__copyright">
          &copy; {{ new Date().getFullYear() }} micasaestuya.
        </p>
        <div class="footer__actions">
          <BaseCta
            data-cy="footer-i18n-button"
            variant="flat"
            :aria-label="t('header.change_locale')"
            @click="authStore.showLocaleModal"
          >
            <BaseIcon icon="globe" size="sm" />
            {{ getLocale(locale)?.language }}
            ({{ getLocale(locale)?.countryCode.toLocaleUpperCase() }})
          </BaseCta>
          <a
            class="footer__github-mark"
            :href="SOURCE_CODE_URL"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t('footer.github_label')"
          >
            <BaseIcon icon="github" size="sm" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  position: relative;
  background-color: var(--bg-2);
  border-top: px-to-rem(1) solid var(--border);
  margin: 0;
  padding-top: $gap-huge;

  &__links {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $gap-large;
    margin-bottom: $gap-large;

    @include media-breakpoint-up(sm) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  &__group {
    &-title {
      @include font-outfit-semibold;
      font-size: $font-size-xs;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      color: var(--text-3);
      margin: 0 0 $gap-extra-small;
    }

    &-list {
      display: flex;
      flex-direction: column;
      gap: $gap-small;
      list-style: none;
      padding: 0;
      margin: 0;

      &-item a {
        @include font-outfit-regular;
        font-size: $font-size-sm;
        letter-spacing: normal;
        color: var(--text-2);
        text-decoration: none;

        &:hover,
        &:focus {
          color: var(--text);
          text-decoration: underline;
        }
      }
    }
  }

  &__bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $gap-small;
    padding: $gap-extra-medium 0;
    border-top: px-to-rem(1) solid var(--border);

    @include media-breakpoint-up(sm) {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  &__copyright {
    font-size: $font-size-sm;
    color: var(--text-3);
    margin: 0;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $gap-extra-tiny;
  }

  &__github-mark {
    display: flex;
    padding: $gap-small;
    color: var(--text-2);
    opacity: 0.7;

    &:hover,
    &:focus {
      opacity: 1;
    }
  }
}
</style>
