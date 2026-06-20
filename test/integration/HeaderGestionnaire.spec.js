import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HeaderGestionnaire from '../../src/components/layout/HeaderGestionnaire.vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { useNotificationsStore } from '../../src/stores/notifications.store'
import { reinitialiserDb } from '../../src/mocks/db'

describe('HeaderGestionnaire integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    reinitialiserDb()
  })

  it('affiche le badge et ouvre le dropdown', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    reinitialiserDb()

    const notificationsStore = useNotificationsStore()
    notificationsStore.notifierGestionnaire('TEST', 'Nouvelle alerte de test')
    const attendu = notificationsStore.compteurGestionnaire

    const router = createRouter({ history: createMemoryHistory(), routes: [] })
    const wrapper = mount(HeaderGestionnaire, { global: { plugins: [pinia, router] } })

    // badge présent et égal au nombre de notifications gestionnaire non lues
    const badge = wrapper.find('.notif-badge')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe(String(attendu))

    // le dropdown s'ouvre au clic
    await wrapper.find('.notif-btn').trigger('click')
    expect(wrapper.find('.notif-dropdown').exists()).toBe(true)
  })
})
