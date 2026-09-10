import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const { isLogged } = storeToRefs(authStore)

  if (!isLogged.value) {
    await authStore.loginWithToken()
  }

  const protectedRoutes = [
    'property-add',
    'property-id-edit',
    'property-id-view'
  ]

  const requiresAuth = protectedRoutes.includes(to.name.toString())

  if (requiresAuth && !isLogged.value) {
    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  }
})
