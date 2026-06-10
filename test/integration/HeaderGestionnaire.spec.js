import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HeaderGestionnaire from '../../src/components/layout/HeaderGestionnaire.vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { useNotificationsStore } from '../../src/stores/notifications.store'

describe('HeaderGestionnaire integration', () => {
  it('affiche le badge et ouvre le dropdown', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const notificationsStore = useNotificationsStore()
    // Prevent the store from auto-loading mock notifications during component mount
    notificationsStore.charger = async () => {}
    notificationsStore.notifications = [
      { id: 1, titre: 'Loyer impayé — SARL Teranga Tech', dateEnvoi: '2026-04-05', lue: false },
    ]

    const router = createRouter({ history: createMemoryHistory(), routes: [] })

    const wrapper = mount(HeaderGestionnaire, {
      global: {
        plugins: [pinia, router],
      },
    })

    // badge present
    const badge = wrapper.find('.notif-badge')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('1')

    // dropdown should open on click
    await wrapper.find('.notif-btn').trigger('click')
    const dropdown = wrapper.find('.notif-dropdown')
    expect(dropdown.exists()).toBe(true)
  })
})
