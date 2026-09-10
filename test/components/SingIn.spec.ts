import { describe, beforeEach, it, expect } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { mount, flushPromises } from '@vue/test-utils'
import waitForExpect from 'wait-for-expect'
import SignIn from '@/components/SignIn.vue'
import { useAuthStore } from '@/stores/auth'

describe('SignIn', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(SignIn, {
      global: {
        plugins: [createTestingPinia()]
      }
    })
  })

  it('should match the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render form fields', () => {
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[id="signin-email"]').exists()).toBe(true)
    expect(wrapper.find('input[id="signin-password"]').exists()).toBe(true)
    expect(wrapper.find('input[id="signin-remember"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('should log in', async () => {
    const authStore = useAuthStore()
    wrapper.find('input[id="signin-email"]').setValue('foo@bar.com')
    wrapper.find('input[id="signin-password"]').setValue('password123')

    await wrapper.find('form').trigger('submit')

    await waitForExpect(async () => {
      await flushPromises()
      expect(authStore.login).toHaveBeenCalledTimes(1)
    })
  })
})
