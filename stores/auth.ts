import { defineStore } from 'pinia'
import * as Sentry from '@sentry/nuxt'
import type {
  IServicesInstance,
  ILoginInput,
  IRegisterInput,
  IUserInfo
} from '@/core/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as IUserInfo | null,
    token: null as string | null
  }),

  getters: {
    isLogged: (state) => state.user !== null,
    name: (state) => state.user?.firstName?.split(' ')?.[0]
  },

  actions: {
    async register(credentials: IRegisterInput) {
      try {
        const { $services } = useNuxtApp()
        const { token } = await ($services as IServicesInstance).auth.register(
          credentials
        )
        this.token = token
        useAuthToken().value = token
        this.user = await ($services as IServicesInstance).auth.current()
      } catch (error) {
        console.log('Unable to register', error)
        Sentry.captureException(error)
        throw error
      }
    },
    async login(credentials: ILoginInput) {
      try {
        const { $services } = useNuxtApp()
        const { token } = await ($services as IServicesInstance).auth.login(
          credentials
        )
        this.token = token
        useAuthToken(!credentials.remember).value = token
        this.user = await ($services as IServicesInstance).auth.current()
      } catch (error) {
        console.log('Unable to login', error)
        Sentry.captureException(error)
        throw error
      }
    },
    async loginWithToken() {
      const authToken = useAuthToken()
      if (!authToken.value) return
      try {
        this.token = authToken.value
        const { $services } = useNuxtApp()
        this.user = await ($services as IServicesInstance).auth.current()
      } catch (error) {
        console.error('Unable to login with token', error)
        this.token = null
        authToken.value = null
        Sentry.captureException(error)
      }
    },
    logout() {
      useAuthToken().value = null
      this.user = null
      this.token = null
    },
    // Acciones vacías a propósito: AuthModal y LocaleModal se suscriben con
    // $onAction. hideAuthModal avisa de que el modal se cerró, con login o sin él.
    showAuthModal() {},
    hideAuthModal() {},
    showLocaleModal() {}
  }
})
