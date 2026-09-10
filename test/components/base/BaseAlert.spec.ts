import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import BaseAlert from '@/components/base/BaseAlert.vue'

describe('BaseAlert.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(BaseAlert, {
      propsData: {
        variant: 'info'
      },
      slots: {
        default: 'Lorem ipsum dolor sit amet'
      }
    })
  })

  it('should match the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should change the class according variant prop', async () => {
    expect(wrapper.classes()).toContain('info')

    await wrapper.setProps({ variant: 'success' })
    expect(wrapper.classes()).toContain('success')

    await wrapper.setProps({ variant: 'warning' })
    expect(wrapper.classes()).toContain('warning')

    await wrapper.setProps({ variant: 'error' })
    expect(wrapper.classes()).toContain('error')
  })

  it('should render the slot content', () => {
    expect(wrapper.text()).toContain('Lorem ipsum dolor sit amet')
  })
})
