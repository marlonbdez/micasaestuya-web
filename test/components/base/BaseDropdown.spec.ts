import { describe, it, expect, afterEach } from 'vitest'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import { clickOutside } from '../../helpers/click-outside'
import BaseDropdown from '@/components/base/BaseDropdown.vue'

enableAutoUnmount(afterEach)

const mountDropdown = () =>
  mount(BaseDropdown, {
    props: { id: 'dropdown', options: [{ id: 'one', value: 'One' }] },
    slots: { selector: '<button>Open</button>' },
    attachTo: document.body
  })

describe('BaseDropdown', () => {
  it('opens from its selector', async () => {
    const wrapper = mountDropdown()

    await wrapper.find('.dropdown__selector').trigger('click')

    expect(wrapper.find('.dropdown__content').exists()).toBe(true)
  })

  it('closes when clicking outside', async () => {
    const wrapper = mountDropdown()
    await wrapper.find('.dropdown__selector').trigger('click')

    await clickOutside()

    expect(wrapper.find('.dropdown__content').exists()).toBe(false)
  })
})
