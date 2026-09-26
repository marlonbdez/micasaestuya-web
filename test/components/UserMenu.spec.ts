import { describe, it, expect, vi, afterEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import { clickOutside } from '../helpers/click-outside'
import UserMenu from '@/components/UserMenu.vue'
import { useAuthStore } from '@/stores/auth'
import { AuthModalMode } from '~/core/types'

enableAutoUnmount(afterEach)

const user = {
  id: '1',
  email: 'ana@ejemplo.com',
  firstName: 'Ana',
  lastName: 'Gómez'
}
vi.mock(
  '../../node_modules/@nuxtjs/i18n/dist/runtime/composables/index.js',
  () => ({
    useLocalePath: () => (route: string) => `/${route}`
  })
)
vi.mock(
  '../../node_modules/@nuxtjs/color-mode/dist/runtime/composables.js',
  () => ({
    useColorMode: () => ({ value: 'light', preference: 'light' })
  })
)

const mountMenu = (logged = false) =>
  mount(UserMenu, {
    attachTo: document.body,
    global: {
      plugins: [
        createTestingPinia({
          initialState: { auth: { user: logged ? user : null } }
        })
      ],
      stubs: {
        BaseCta: { template: '<button><slot /></button>' },
        BaseIcon: true
      }
    }
  })

type Wrapper = ReturnType<typeof mountMenu>

const byCy = (wrapper: Wrapper, id: string) => wrapper.find(`[data-cy="${id}"]`)

describe('UserMenu', () => {
  it('starts closed and opens from the trigger', async () => {
    const wrapper = mountMenu()
    expect(wrapper.find('#user-menu-panel').exists()).toBe(false)
    expect(
      byCy(wrapper, 'header-menu-button').attributes('aria-expanded')
    ).toBe('false')

    await byCy(wrapper, 'header-menu-button').trigger('click')

    expect(wrapper.find('#user-menu-panel').exists()).toBe(true)
    expect(
      byCy(wrapper, 'header-menu-button').attributes('aria-expanded')
    ).toBe('true')
  })

  it('closes with Escape', async () => {
    const wrapper = mountMenu()
    await byCy(wrapper, 'header-menu-button').trigger('click')

    await wrapper.trigger('keydown.esc')

    expect(wrapper.find('#user-menu-panel').exists()).toBe(false)
  })

  it('closes when clicking outside', async () => {
    const wrapper = mountMenu()
    await byCy(wrapper, 'header-menu-button').trigger('click')

    await clickOutside()

    expect(wrapper.find('#user-menu-panel').exists()).toBe(false)
  })

  describe('without session', () => {
    it('offers login and sign up, not logout', async () => {
      const wrapper = mountMenu()
      await byCy(wrapper, 'header-menu-button').trigger('click')

      expect(byCy(wrapper, 'header-login-button').exists()).toBe(true)
      expect(byCy(wrapper, 'header-signup-button').exists()).toBe(true)
      expect(byCy(wrapper, 'logout-dropdown-option').exists()).toBe(false)
    })

    it('opens the auth modal on the sign-up tab', async () => {
      const wrapper = mountMenu()
      const authStore = useAuthStore()
      await byCy(wrapper, 'header-menu-button').trigger('click')

      await byCy(wrapper, 'header-signup-button').trigger('click')

      expect(authStore.showAuthModal).toHaveBeenCalledWith(AuthModalMode.SignUp)
      expect(wrapper.find('#user-menu-panel').exists()).toBe(false)
    })

    it('opens the auth modal on the sign-in tab', async () => {
      const wrapper = mountMenu()
      const authStore = useAuthStore()
      await byCy(wrapper, 'header-menu-button').trigger('click')

      await byCy(wrapper, 'header-login-button').trigger('click')

      expect(authStore.showAuthModal).toHaveBeenCalledWith(AuthModalMode.SignIn)
    })
  })

  describe('with session', () => {
    it('shows who is logged in and offers logout, not login', async () => {
      const wrapper = mountMenu(true)
      await byCy(wrapper, 'header-menu-button').trigger('click')

      expect(wrapper.text()).toContain('Ana Gómez')
      expect(wrapper.text()).toContain('ana@ejemplo.com')
      expect(byCy(wrapper, 'logout-dropdown-option').exists()).toBe(true)
      expect(byCy(wrapper, 'header-login-button').exists()).toBe(false)
    })

    it('logs out and closes the menu', async () => {
      const wrapper = mountMenu(true)
      const authStore = useAuthStore()
      await byCy(wrapper, 'header-menu-button').trigger('click')

      await byCy(wrapper, 'logout-dropdown-option').trigger('click')

      expect(authStore.logout).toHaveBeenCalledTimes(1)
      expect(wrapper.find('#user-menu-panel').exists()).toBe(false)
    })

    it('keeps "my listings" disabled until the listings endpoint exists', async () => {
      const wrapper = mountMenu(true)
      await byCy(wrapper, 'header-menu-button').trigger('click')

      expect(
        byCy(wrapper, 'mylistings-dropdown-option').attributes('disabled')
      ).toBeDefined()
    })
  })
})
