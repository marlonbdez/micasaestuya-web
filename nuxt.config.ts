// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { defineNuxtConfig } from 'nuxt/config'
import { defaultLocale } from './core/constants/Locales'
import { i18nLocales } from './core/localeUtils'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: [
    '@nuxtjs/eslint-module',
    'nuxt-icons',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    '@nuxtjs/i18n',
    '@sentry/nuxt/module'
  ],
  sentry: {
    sourceMapsUploadOptions: {
      org: process.env.NUXT_PUBLIC_SENTRY_ORG_SLUG,
      project: process.env.NUXT_PUBLIC_SENTRY_PROJECT_SLUG,
      authToken: process.env.NUXT_SENTRY_AUTH_TOKEN,
      release: {
        name: `${process.env.npm_package_name}@${process.env.npm_package_version}`
      }
    }
  },
  eslint: {
    cache: true,
    cacheLocation: '.nuxt/eslint/.eslintcache'
  },
  veeValidate: {
    autoImports: true
  },
  app: {
    head: {
      title: 'micasaestuya · alojamiento a cambio de colaboración',
      meta: [
        {
          name: 'description',
          content:
            'Alojamiento y comida a cambio de unas horas de colaboración. Gratis, en Cuba y República Dominicana.'
        }
      ],
      link: [
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
          href: '/fonts/roboto-300.woff2'
        },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
          href: '/fonts/roboto-400.woff2'
        },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
          href: '/fonts/roboto-700.woff2'
        },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
          href: '/fonts/roboto-condensed-300.woff2'
        },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
          href: '/fonts/roboto-condensed-400.woff2'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap'
        }
      ],
      htmlAttrs: {
        lang: 'en'
      }
    }
  },
  typescript: {
    strict: true
  },
  runtimeConfig: {
    apiSecret: process.env.NUXT_API_SECRET,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    }
  },
  devServer: {},
  css: ['~/assets/scss/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss/abstract/_functions.scss" as *;
            @use "@/assets/scss/tokens/_breakpoints.scss" as *;
            @use "@/assets/scss/tokens/_radius.scss" as *;
            @use "@/assets/scss/tokens/_spacing.scss" as *;
            @use "@/assets/scss/tokens/_typography.scss" as *;
            @use "@/assets/scss/tokens/_zindex.scss" as *;
            @use "@/assets/scss/abstract/_mixins.scss" as *;
          `
        }
      }
    },
    build: {
      sourcemap: 'hidden'
    }
  },
  ssr: false,
  nitro: {
    preset: 'static'
  },
  i18n: {
    strategy: 'prefix',
    defaultLocale,
    lazy: true,
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      fallbackLocale: defaultLocale
    },
    locales: i18nLocales
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '-mode',
    storageKey: 'nuxt-color-mode'
  }
})
