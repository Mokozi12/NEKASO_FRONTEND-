import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CarteBien from '@/components/biens/CarteBien.vue'

describe('CarteBien snapshot', () => {
  it('render snapshot', () => {
    const wrapper = mount(CarteBien)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
