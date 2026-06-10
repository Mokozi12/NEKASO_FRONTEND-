import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useVisitesStore } from '@/stores/visites.store'

describe('visites.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('computeds enAttente/confirmees/refusees fonctionnent', () => {
    const store = useVisitesStore()
    store.visites = [
      { id: 1, statut: 'EN_ATTENTE' },
      { id: 2, statut: 'CONFIRMEE' },
      { id: 3, statut: 'REFUSEE' },
    ]

    expect(store.enAttente.length).toBe(1)
    expect(store.confirmees.length).toBe(1)
    expect(store.refusees.length).toBe(1)
  })

  it('creer ajoute une visite en EN_ATTENTE', async () => {
    const store = useVisitesStore()
    store.visites = []
    await store.creer({ candidat: { nom: 'Test' }, dateVisite: '2026-06-10', heure: '10:00' })
    expect(store.visites.length).toBe(1)
    expect(store.visites[0].statut).toBe('EN_ATTENTE')
    expect(store.visites[0].candidat.nom).toBe('Test')
  })

  it('reprogrammer met à jour date et heure et remet statut EN_ATTENTE', async () => {
    const store = useVisitesStore()
    store.visites = [{ id: 5, statut: 'CONFIRMEE', dateVisite: '2026-06-01', heureVisite: '09:00' }]
    await store.reprogrammer(5, '2026-06-20', '15:30')
    const v = store.visites.find((x) => x.id === 5)
    expect(v.dateVisite).toBe('2026-06-20')
    expect(v.heureVisite).toBe('15:30')
    expect(v.statut).toBe('EN_ATTENTE')
  })
})
