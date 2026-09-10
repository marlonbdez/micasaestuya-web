import { defineNuxtPlugin } from 'nuxt/app'
import type { IServicesInstance } from '~/core/types'
import { createHttpClient } from '~/core/httpClient'
import AuthModule from '~/core/services/repository/modules/auth'
import RegionModule from '~/core/services/repository/modules/region'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const { apiBase } = config.public

  const baseHttpClient = createHttpClient(apiBase)

  const modules: IServicesInstance = {
    auth: new AuthModule(baseHttpClient),
    region: new RegionModule(baseHttpClient)
  }

  return {
    provide: {
      services: modules
    }
  }
})
