/**
 * Tests unitaires — visites.store.js (workflow corrigé)
 * Couvre : signalement (EN_ATTENTE sans créneau), validation (créneau + agent),
 *          règle d'annulation (§1), acceptation client, clôture avec contrat.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useVisitesStore } from '@/stores/visites.store'
import { useContratsStore } from '@/stores/contrats.store'
import { reinitialiserDb, db, STATUT_VISITE } from '@/mocks/db'

beforeEach(() => {
  setActivePinia(createPinia())
  reinitialiserDb()
})

describe('visites.store — filtres', () => {
  it('classe les visites du seed par statut', () => {
    const store = useVisitesStore()
    // Seed : 2 EN_ATTENTE (v1, v4), 2 VALIDEE (v2, v5), 1 CONFIRMEE (v3)
    expect(store.enAttente.length).toBe(2)
    expect(store.validees.length).toBe(2)
    expect(store.confirmees.length).toBe(1)
  })
})

describe('visites.store — signalement (§6-bis)', () => {
  it('creerDemande crée une visite EN_ATTENTE sans créneau', async () => {
    const store = useVisitesStore()
    const avant = db.visites.length
    await store.creerDemande(2, 3)
    expect(db.visites.length).toBe(avant + 1)
    const nouvelle = db.visites[db.visites.length - 1]
    expect(nouvelle.statut).toBe(STATUT_VISITE.EN_ATTENTE)
    expect(nouvelle.creneau).toBeNull()
    expect(nouvelle.agentId).toBeNull()
  })
})

describe('visites.store — validation (§2)', () => {
  it('valider affecte un créneau + un agent et passe en VALIDEE', async () => {
    const store = useVisitesStore()
    // v1 (id 1) est EN_ATTENTE
    await store.valider(1, { date: '2026-06-22', heure: '15:00', agentId: 1 })
    const v = db.visites.find((x) => x.id === 1)
    expect(v.statut).toBe(STATUT_VISITE.VALIDEE)
    expect(v.creneau).toEqual({ date: '2026-06-22', heure: '15:00' })
    expect(v.agentId).toBe(1)
  })
})

describe('visites.store — règle d\'annulation (§1)', () => {
  it('une visite EN_ATTENTE ne peut PAS être annulée', async () => {
    const store = useVisitesStore()
    const v1 = store.visites.find((v) => v.id === 1) // EN_ATTENTE
    expect(store.peutAnnuler(v1)).toBe(false)
    await store.annulerClient(1)
    expect(db.visites.find((x) => x.id === 1).statut).toBe(STATUT_VISITE.EN_ATTENTE)
  })

  it('une visite VALIDEE peut être annulée', async () => {
    const store = useVisitesStore()
    const v2 = store.visites.find((v) => v.id === 2) // VALIDEE
    expect(store.peutAnnuler(v2)).toBe(true)
    await store.annulerClient(2)
    expect(db.visites.find((x) => x.id === 2).statut).toBe(STATUT_VISITE.ANNULEE)
  })
})

describe('visites.store — acceptation client (§5)', () => {
  it('accepterClient passe une visite VALIDEE en CONFIRMEE', async () => {
    const store = useVisitesStore()
    await store.accepterClient(2) // v2 VALIDEE
    expect(db.visites.find((x) => x.id === 2).statut).toBe(STATUT_VISITE.CONFIRMEE)
  })
})

describe('visites.store — clôture (§6)', () => {
  it('clôture AVEC_CONTRAT crée un pré-contrat pré-rempli', async () => {
    const store = useVisitesStore()
    const contratsStore = useContratsStore()
    const avant = db.contrats.length
    // v3 (id 3) est CONFIRMEE
    const contrat = await store.cloturer(3, { issue: 'AVEC_CONTRAT', compteRendu: 'RAS' })
    expect(db.visites.find((x) => x.id === 3).statut).toBe(STATUT_VISITE.CLOTUREE_AVEC_CONTRAT)
    expect(db.contrats.length).toBe(avant + 1)
    expect(contrat.statut).toBe('PRE_CONTRAT_ENVOYE')
    // v3 du seed appartient au client 1
    expect(contratsStore.getContratHydrate(contrat.id).clientId).toBe(1)
  })

  it('clôture SANS_CONTRAT ne crée pas de contrat', async () => {
    const store = useVisitesStore()
    const avant = db.contrats.length
    await store.cloturer(3, { issue: 'SANS_CONTRAT', compteRendu: 'Pas intéressé' })
    expect(db.visites.find((x) => x.id === 3).statut).toBe(STATUT_VISITE.CLOTUREE_SANS_CONTRAT)
    expect(db.contrats.length).toBe(avant)
  })
})
