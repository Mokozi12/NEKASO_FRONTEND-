/**
 * Tests unitaires — biens.store.js (branché sur la base mock centrale)
 * Couvre : charger, creer, modifier, archiver, louer, remettreDispo,
 *          réparation/désactivation, supprimerPhoto, computeds.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBiensStore } from '@/stores/biens.store'
import { reinitialiserDb, db } from '@/mocks/db'

beforeEach(() => {
  setActivePinia(createPinia())
  reinitialiserDb()
  global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
})

describe('biens.store — charger()', () => {
  it('expose les biens du seed', async () => {
    const store = useBiensStore()
    await store.charger()
    expect(store.biens.length).toBeGreaterThan(0)
    expect(store.chargement).toBe(false)
  })

  it('passe chargement à true pendant le chargement', async () => {
    const store = useBiensStore()
    const promise = store.charger()
    expect(store.chargement).toBe(true)
    await promise
    expect(store.chargement).toBe(false)
  })
})

describe('biens.store — creer()', () => {
  it('ajoute un nouveau bien DISPONIBLE en tête de liste', async () => {
    const store = useBiensStore()
    await store.creer({
      intitule: 'Villa Almadies',
      typeBien: 'VILLA',
      adresse: 'Almadies, Dakar',
      surface: 200,
      nombrePieces: 5,
      loyer: 800000,
      description: 'Grande villa',
    })
    expect(store.biens[0].statutBien).toBe('DISPONIBLE')
    expect(store.biens[0].intitule).toBe('Villa Almadies')
    expect(store.biens[0].id).toBeTypeOf('number')
  })

  it('associe les URLs de photos lors de la création', async () => {
    const store = useBiensStore()
    const fakeFile = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    await store.creer({
      intitule: 'Avec photo',
      typeBien: 'APPARTEMENT',
      adresse: 'Dakar',
      surface: 60,
      nombrePieces: 2,
      loyer: 200000,
      photos: [fakeFile],
    })
    expect(store.biens[0].photos.length).toBe(1)
    expect(store.biens[0].photos[0].urlPhoto).toBe('blob:mock-url')
  })
})

describe('biens.store — modifier()', () => {
  it('met à jour les champs et conserve le statut', async () => {
    const store = useBiensStore()
    await store.modifier(1, { intitule: 'Appartement Rénové', loyer: 500000 })
    const bien = db.biens.find((b) => b.id === 1)
    expect(bien.intitule).toBe('Appartement Rénové')
    expect(bien.loyer).toBe(500000)
    expect(bien.statutBien).toBe('LOUE')
  })
})

describe('biens.store — transitions de statut', () => {
  it('archiver / louer / remettreDispo', async () => {
    const store = useBiensStore()
    store.archiver(2)
    expect(db.biens.find((b) => b.id === 2).statutBien).toBe('ARCHIVE')
    store.louer(3)
    expect(db.biens.find((b) => b.id === 3).statutBien).toBe('LOUE')
    store.remettreDispo(3)
    expect(db.biens.find((b) => b.id === 3).statutBien).toBe('DISPONIBLE')
  })

  it('mettreEnReparation / desactiver / reactiver (§12)', () => {
    const store = useBiensStore()
    store.mettreEnReparation(4)
    expect(db.biens.find((b) => b.id === 4).statutBien).toBe('EN_REPARATION')
    store.desactiver(4)
    expect(db.biens.find((b) => b.id === 4).statutBien).toBe('DESACTIVE')
    store.reactiver(4)
    expect(db.biens.find((b) => b.id === 4).statutBien).toBe('DISPONIBLE')
  })
})

describe('biens.store — supprimerPhoto()', () => {
  it('supprime la photo par son id', () => {
    const store = useBiensStore()
    // Le bien 1 du seed possède une photo (id 1)
    store.supprimerPhoto(1, 1)
    expect(db.biens.find((b) => b.id === 1).photos.length).toBe(0)
  })
})

describe('biens.store — computed', () => {
  it('reflète les compteurs du seed', () => {
    const store = useBiensStore()
    // Seed : b1 LOUE, b2..b5 DISPONIBLE
    expect(store.totalBiens).toBe(5)
    expect(store.biensLoues.length).toBe(1)
    expect(store.biensDisponibles.length).toBe(4)
    expect(store.biensReserves.length).toBe(0)
  })
})
