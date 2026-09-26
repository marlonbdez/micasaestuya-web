import * as Sentry from '@sentry/nuxt'

Sentry.init({
  dsn: process.env.NUXT_PUBLIC_SENTRY_DSN,
  debug: true,
  environment: process.env.NUXT_PUBLIC_SENTRY_ENVIRONMENT,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true
    })
  ],
  tracesSampleRate: 0.2,
  tracePropagationTargets: ['localhost', 'https://www.micasaestuya.com'],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
})
