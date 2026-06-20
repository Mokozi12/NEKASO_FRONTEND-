/**
 * Tests unitaires — demandesLocation.store.js (logique corrigée §7, §8)
 * Couvre : regroupement par bien, FIFO, validation (annulation des autres),
 *          demande express directe.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDemandesLocationStore } from '@/stores/demandesLocation.store'
import { reinitialiserDb, db, STATUT_DEMANDE } from '@/mocks/db'

beforeEach(() => {
  setActivePinia(createPinia())
  reinitialiserDb()
})

describe('demandesLocation.store — regroupement par bien (§8)', () => {
  it('regroupe les demandes par bien', () => {
    const store = useDemandesLocationStore()
    const groupeBien2 = store.demandesDuBien(2)
    // Seed : 3 demandes EN_ATTENTE sur le bien 2 (Studio Plateau)
    expect(groupeBien2.demandes.length).toBe(3)
    expect(groupeBien2.nbEnAttente).toBe(3)
  })

  it('marque le premier arrivé comme prioritaire (FIFO §8-bis)', () => {
    const store = useDemandesLocationStore()
    const groupeBien2 = store.demandesDuBien(2)
    // La demande la plus ancienne du bien 2 est id 1 (2026-06-10)
    expect(groupeBien2.prioritaireId).toBe(1)
  })
})

describe('demandesLocation.store — validation (§8)', () => {
  it('valider une demande annule les autres du même bien et crée un pré-contrat', async () => {
    const store = useDemandesLocationStore()
    const nbContratsAvant = db.contrats.length

    // On valide la demande id 1 (bien 2). Les demandes 2 et 3 (même bien) doivent être annulées.
    const contrat = await store.validerDemande(1)

    expect(db.demandes.find((d) => d.id === 1).statut).toBe(STATUT_DEMANDE.VALIDEE)
    expect(db.demandes.find((d) => d.id === 2).statut).toBe(STATUT_DEMANDE.ANNULEE)
    expect(db.demandes.find((d) => d.id === 3).statut).toBe(STATUT_DEMANDE.ANNULEE)

    // Le bien passe en réservé
    expect(db.biens.find((b) => b.id === 2).statutBien).toBe('RESERVE')

    // Un pré-contrat est créé pour le retenu (client 2)
    expect(db.contrats.length).toBe(nbContratsAvant + 1)
    expect(contrat.clientId).toBe(2)
    expect(contrat.statut).toBe('PRE_CONTRAT_ENVOYE')
  })

  it('toutAnnuler annule toutes les demandes en attente d\'un bien', async () => {
    const store = useDemandesLocationStore()
    await store.toutAnnuler(2)
    const restantes = db.demandes.filter(
      (d) => d.bienId === 2 && d.statut === STATUT_DEMANDE.EN_ATTENTE,
    )
    expect(restantes.length).toBe(0)
  })
})

describe('demandesLocation.store — demande express (§7-bis)', () => {
  it('creerDemandeDirecte ajoute une demande EN_ATTENTE de source DIRECTE', async () => {
    const store = useDemandesLocationStore()
    const avant = db.demandes.length
    await store.creerDemandeDirecte(4, 1)
    expect(db.demandes.length).toBe(avant + 1)
    const nouvelle = db.demandes[db.demandes.length - 1]
    expect(nouvelle.statut).toBe(STATUT_DEMANDE.EN_ATTENTE)
    expect(nouvelle.source).toBe('DIRECTE')
    expect(nouvelle.bienId).toBe(4)
  })
})
