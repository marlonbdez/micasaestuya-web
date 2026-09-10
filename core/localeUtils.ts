import { locales } from './constants/Locales'

export const i18nLocales = locales.map((l) => ({
  code: l.code,
  language: l.language,
  name: `${l.language} (${l.country})`,
  files: l.files
}))

// El código de país sale del propio locale (es-CU → cu) en vez de guardarse
// aparte: así no pueden desincronizarse.
export const localeList = () =>
  locales.map((l) => ({
    ...l,
    countryCode: l.code.split('-')[1].toLowerCase()
  }))

export const getLocale = (code: string) =>
  localeList().find((entry) => entry.code === code)
