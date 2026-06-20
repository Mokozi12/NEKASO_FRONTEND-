import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import HeaderGestionnaire from '@/components/layout/HeaderGestionnaire.vue'
import { reinitialiserDb } from '@/mocks/db'

describe('HeaderGestionnaire snapshot', () => {
  beforeEach(() => {
    // Base mock déterministe pour un snapshot stable
    reinitialiserDb()
  })

  it('render snapshot stable', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    reinitialiserDb()
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', name: 'dashboard', meta: {} }],
    })
    await router.push('/')
    await router.isReady()
    const wrapper = mount(HeaderGestionnaire, { global: { plugins: [pinia, router] } })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
