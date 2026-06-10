import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications.store'

describe('notifications.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('compteur reflète les notifications non lues', () => {
    const store = useNotificationsStore()
    store.notifications = [
      { id: 1, titre: 'A', lue: false },
      { id: 2, titre: 'B', lue: true },
      { id: 3, titre: 'C', lue: false },
    ]
    expect(store.compteur).toBe(2)
  })

  it('marquerLue marque une notification comme lue', async () => {
    const store = useNotificationsStore()
    store.notifications = [{ id: 10, titre: 'X', lue: false }]
    await store.marquerLue(10)
    expect(store.notifications[0].lue).toBe(true)
    expect(store.compteur).toBe(0)
  })

  it('toutLire marque toutes les notifications comme lues', async () => {
    const store = useNotificationsStore()
    store.notifications = [
      { id: 1, titre: 'A', lue: false },
      { id: 2, titre: 'B', lue: false },
    ]
    await store.toutLire()
    expect(store.compteur).toBe(0)
    expect(store.notifications.every((n) => n.lue)).toBe(true)
  })
})
