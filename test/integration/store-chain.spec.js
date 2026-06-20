/**
 * Tests d'intégration — Interactions entre stores (workflow corrigé).
 * Couvre la chaîne : demande → validation → pré-contrat → activation → bien loué,
 * et le cycle de vie d'un bien.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBiensStore } from '@/stores/biens.store'
import { useVisitesStore } from '@/stores/visites.store'
import { useDemandesLocationStore } from '@/stores/demandesLocation.store'
import { useContratsStore } from '@/stores/contrats.store'
import { reinitialiserDb, db, STATUT_VISITE } from '@/mocks/db'

beforeEach(() => {
  setActivePinia(createPinia())
  reinitialiserDb()
})

describe('Biens + Visites — chaîne de signalement', () => {
  it('créer une demande de visite pour un bien crée une visite EN_ATTENTE', async () => {
    const visitesStore = useVisitesStore()
    const avant = db.visites.length
    await visitesStore.creerDemande(2, 1)
    expect(db.visites.length).toBe(avant + 1)
    expect(db.visites[db.visites.length - 1].statut).toBe(STATUT_VISITE.EN_ATTENTE)
  })
})

describe('DemandesLocation + Contrats + Biens — du choix au bail actif', () => {
  it('valider une demande crée un pré-contrat et réserve le bien', async () => {
    const demandesStore = useDemandesLocationStore()
    const contrat = await demandesStore.validerDemande(1) // bien 2
    expect(db.biens.find((b) => b.id === 2).statutBien).toBe('RESERVE')
    expect(contrat.statut).toBe('PRE_CONTRAT_ENVOYE')
  })

  it('valider client + enregistrer gestionnaire active le contrat et loue le bien', async () => {
    const demandesStore = useDemandesLocationStore()
    const contratsStore = useContratsStore()

    const contrat = await demandesStore.validerDemande(1) // bien 2, client 2
    await contratsStore.validerParClient(contrat.id)
    await contratsStore.enregistrerEtActiver(contrat.id)

    const actif = contratsStore.getContratHydrate(contrat.id)
    expect(actif.statut).toBe('ACTIF')
    expect(actif.echeances.length).toBeGreaterThan(0)
    expect(db.biens.find((b) => b.id === 2).statutBien).toBe('LOUE')
  })
})

describe('Visites — validation puis acceptation', () => {
  it('valider puis accepter une visite la rend CONFIRMEE', async () => {
    const store = useVisitesStore()
    await store.valider(1, { date: '2026-06-22', heure: '15:00', agentId: 1 })
    await store.accepterClient(1)
    expect(db.visites.find((v) => v.id === 1).statut).toBe(STATUT_VISITE.CONFIRMEE)
  })
})

describe('Biens — cycle de vie', () => {
  it('DISPONIBLE → LOUE → DISPONIBLE', () => {
    const store = useBiensStore()
    store.louer(2)
    expect(db.biens.find((b) => b.id === 2).statutBien).toBe('LOUE')
    store.remettreDispo(2)
    expect(db.biens.find((b) => b.id === 2).statutBien).toBe('DISPONIBLE')
  })

  it('archiver est irréversible via le store', async () => {
    const store = useBiensStore()
    store.archiver(2)
    expect(db.biens.find((b) => b.id === 2).statutBien).toBe('ARCHIVE')
  })
})
