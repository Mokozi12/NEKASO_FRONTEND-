/**
 * Tests unitaires — notifications.store.js (ciblage gestionnaire / client)
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications.store'
import { reinitialiserDb, db, SESSION } from '@/mocks/db'

beforeEach(() => {
  setActivePinia(createPinia())
  reinitialiserDb()
  SESSION.clientId = 1
})

describe('notifications.store — ciblage', () => {
  it('pourGestionnaire ne contient que les notifications GESTIONNAIRE', () => {
    const store = useNotificationsStore()
    expect(store.pourGestionnaire.every((n) => n.destinataire === 'GESTIONNAIRE')).toBe(true)
  })

  it('pourClient ne contient que les notifications du client connecté', () => {
    const store = useNotificationsStore()
    expect(
      store.pourClient.every((n) => n.destinataire === 'CLIENT' && n.clientId === 1),
    ).toBe(true)
  })
})

describe('notifications.store — ajout', () => {
  it('notifierGestionnaire ajoute une notification non lue', () => {
    const store = useNotificationsStore()
    const avant = store.compteurGestionnaire
    store.notifierGestionnaire('TEST', 'Message test')
    expect(store.compteurGestionnaire).toBe(avant + 1)
  })

  it('notifierClient ajoute une notification pour un client', () => {
    const store = useNotificationsStore()
    const avant = db.notifications.length
    store.notifierClient(1, 'TEST', 'Bonjour client')
    expect(db.notifications.length).toBe(avant + 1)
    expect(store.pourClient[0].message).toBe('Bonjour client')
  })
})

describe('notifications.store — lecture', () => {
  it('marquerLue marque une notification comme lue', () => {
    const store = useNotificationsStore()
    const cible = store.pourGestionnaire[0]
    store.marquerLue(cible.id)
    expect(db.notifications.find((n) => n.id === cible.id).lue).toBe(true)
  })

  it('toutLireGestionnaire met le compteur à zéro', () => {
    const store = useNotificationsStore()
    store.toutLireGestionnaire()
    expect(store.compteurGestionnaire).toBe(0)
  })
})
