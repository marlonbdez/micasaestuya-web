<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { getLocale } from '~/core/localeUtils'
withDefaults(defineProps<{ minimal?: boolean }>(), { minimal: false })

const authStore = useAuthStore()
const { locale } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <nav v-if="!minimal" class="footer__links">
        <div class="footer__group">
          <h4 class="footer__group-title">Sobre nosotros</h4>
          <ul class="footer__group-list">
            <li class="footer__group-list-item">
              <BaseCta is-link to="/about-us">Quiénes somos</BaseCta>
            </li>
            <li class="footer__group-list-item">
              <BaseCta is-link to="/sitemap">Mapa web</BaseCta>
            </li>
            <li class="footer__group-list-item">
              <BaseCta
                is-external-url
                to="https://github.com/marlonbdez/micasaestuya-web"
                target="_blank"
                rel="noopener noreferrer"
              >
                Código fuente
              </BaseCta>
            </li>
          </ul>
        </div>
        <div class="footer__group">
          <h4 class="footer__group-title">Ayuda</h4>
          <ul class="footer__group-list">
            <li class="footer__group-list-item">
              <BaseCta is-link to="/faq">Preguntas frecuentes</BaseCta>
            </li>
            <li class="footer__group-list-item">
              <BaseCta is-link to="mailto:micasaestuya@gmail.com">
                Contacta con micasaestuya
              </BaseCta>
            </li>
          </ul>
        </div>
        <div class="footer__group">
          <h4 class="footer__group-title">Legales</h4>
          <ul class="footer__group-list">
            <li class="footer__group-list-item">
              <BaseCta is-link to="/ad-quality-policy">
                Política de calidad del anuncio
              </BaseCta>
            </li>
            <li class="footer__group-list-item">
              <BaseCta is-link to="/privacy-policy"
                >Política de privacidad</BaseCta
              >
            </li>
            <li class="footer__group-list-item">
              <BaseCta is-link to="/cookie-policy">Política de cookies</BaseCta>
            </li>
            <li class="footer__group-list-item">
              <BaseCta is-link to="/terms-and-conditions">
                Condiciones generales
              </BaseCta>
            </li>
          </ul>
        </div>
        <div class="footer__group">
          <h4 class="footer__group-title">Particulares</h4>
          <ul class="footer__group-list">
            <li class="footer__group-list-item">
              <BaseCta is-link :to="localePath('post-ad-basic-info')">
                Pon tu anuncio gratis
              </BaseCta>
            </li>
            <li class="footer__group-list-item">
              <BaseCta is-link to="#">Compartir en redes sociales</BaseCta>
            </li>
          </ul>
        </div>
      </nav>

      <div class="footer__bottom">
        <p class="footer__copyright">
          &copy; {{ new Date().getFullYear() }} mi casa es tuya.
        </p>
        <div class="footer__actions">
          <BaseCta
            data-cy="footer-i18n-button"
            variant="flat"
            aria-label="Change country and language"
            @click="authStore.showLocaleModal"
          >
            <BaseIcon icon="globe" size="sm" />
            {{ getLocale(locale).language }}
            ({{ getLocale(locale).countryCode.toLocaleUpperCase() }})
            <span class="sr-only">Change country and language</span>
          </BaseCta>
          <a
            class="footer__github-mark"
            href="https://github.com/marlonbdez/micasaestuya-web"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver el código fuente en GitHub"
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
  background-color: var(--footer-background-color);
  margin: 0;

  &__links {
    display: flex;
    flex-wrap: wrap;
  }

  &__group {
    flex: 1 1 50%;
    padding: $gap-medium 0;

    @include media-breakpoint-up(sm) {
      flex: 1 1 20%;
    }

    &-title {
      @include font-roboto-condensed-regular;
      margin-bottom: $gap-extra-medium;
    }

    &-list {
      list-style: none;
      padding: 0;
      margin: 0;

      &-item {
        margin-bottom: $gap-medium;

        a {
          @include font-roboto-condensed-light;
          color: var(--footer-link-color);
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  &__bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $gap-medium 0;
    border-top: 0.0625rem solid var(--border-color);

    @include media-breakpoint-up(sm) {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  &__copyright {
    @include font-roboto-condensed-light;
    margin: 0;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $gap-medium;
  }

  &__github-mark {
    display: flex;
    color: var(--footer-link-color);
    opacity: 0.7;

    &:hover,
    &:focus {
      opacity: 1;
    }
  }
}
</style>
