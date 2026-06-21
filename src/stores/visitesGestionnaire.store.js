import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { visitesService } from '@/services/visites.service'
import { preContratsService } from '@/services/pre-contrats.service'
import { listeOuVide, trierParDateDecroissante } from '@/utils/apiResponse'
import { mapVisites, mapPreContrats } from '@/services/mappers'

export const useVisitesGestionnaireStore = defineStore('visitesGestionnaire', () => {
  const visites = ref([])
  const preContrats = ref([])
  const preContratsCreesLocalement = ref(new Set())
  const chargement = ref(false)
  const erreur = ref(null)

  const enAttente  = computed(() => visites.value.filter((v) => v.statut === 'EN_ATTENTE'))
  const proposees  = computed(() => visites.value.filter((v) => v.statut === 'PROPOSEE'))
  const confirmees = computed(() => visites.value.filter((v) => v.statut === 'CONFIRMEE'))
  const terminees  = computed(() => visites.value.filter((v) => v.statut === 'TERMINEE'))
  const aContractualiser = computed(() =>
    terminees.value.filter((v) => visiteAvecContrat(v) && !preContratExiste(v)),
  )
  const termineesSansSuite = computed(() =>
    terminees.value.filter((v) => !visiteAvecContrat(v) || preContratExiste(v)),
  )
  const refusees   = computed(() => visites.value.filter((v) => ['REFUSEE', 'ANNULEE'].includes(v.statut)))

  function choixCloture(v) {
    return String(v?.clotureVisite ?? v?.choixCloture ?? v?.choix ?? '').toUpperCase()
  }

  function visiteAvecContrat(v) {
    const choix = choixCloture(v)
    if (choix === 'AVEC_CONTRAT') return true
    if (choix === 'SANS_CONTRAT') return false
    if (v?.avecContrat === true || v?.demandeContrat === true || v?.souhaiteContrat === true) return true

    const statutBien = String(v?.bien?.statutBien ?? v?.statutBien ?? '').toUpperCase()
    return ['RESERVE', 'RESERVEE', 'CONFIRME', 'CONFIRMEE', 'BLOQUE', 'BLOQUEE'].includes(statutBien)
  }

  function preContratExiste(v) {
    if (preContratsCreesLocalement.value.has(String(v.id))) return true
    return preContrats.value.some((p) => {
      if (p.demandeVisiteId != null && Number(p.demandeVisiteId) === Number(v.id)) return true
      return (
        p.bienId != null &&
        v.bienId != null &&
        Number(p.bienId) === Number(v.bienId) &&
        p.locataireId != null &&
        v.locataireId != null &&
        Number(p.locataireId) === Number(v.locataireId)
      )
    })
  }

  async function chargerContextePreContrats() {
    try {
      const pcs = mapPreContrats(await listeOuVide(preContratsService.getParGestionnaire({ page: 0, size: 200 })))
      preContrats.value = pcs
      const annuaire = new Map()
      for (const pc of pcs) {
        const loc = pc.locataire
        if (pc.locataireId != null && loc && (loc.nom || loc.prenom || loc.telephone)) {
          annuaire.set(String(pc.locataireId), {
            id: pc.locataireId,
            nom: loc.nom || '',
            prenom: loc.prenom || '',
            telephone: loc.telephone || '',
          })
        }
      }
      return annuaire
    } catch (e) {
      preContrats.value = []
      return new Map()
    }
  }

  async function charger(params = {}) {
    chargement.value = true
    erreur.value = null
    try {
      const [liste, annuaire] = await Promise.all([
        listeOuVide(visitesService.getListe({ page: 0, size: 50, ...params })),
        chargerContextePreContrats(),
      ])
      const enrichies = mapVisites(liste).map((v) => ({
        ...v,
        client:
          v.client ||
          annuaire.get(String(v.locataireId)) ||
          { id: v.locataireId, nom: `Locataire #${v.locataireId}`, prenom: '', telephone: '' },
      }))
      visites.value = trierParDateDecroissante(enrichies, 'dateCreation')
    } catch (e) {
      erreur.value = 'Impossible de charger les visites.'
      console.error('Erreur chargement visites gestionnaire:', e?.response?.status, e?.response?.data)
    } finally {
      chargement.value = false
    }
  }

  async function changerStatut(id, statut) {
    await visitesService.changerStatut(id, statut)
    await charger()
  }

  async function refuser(id) {
    await visitesService.refuser(id)
    await charger()
  }

  async function proposerCreneau(id, { creneauVisite, idAgent }) {
    const numericIdAgent = Number(idAgent)
    if (isNaN(numericIdAgent)) {
      throw new Error("Erreur de synchronisation : L'identifiant de l'agent est invalide. Veuillez rafraîchir la page (F5) pour mettre à jour la liste des agents.")
    }
    await visitesService.proposerCreneau(id, { creneauVisite, IdAgent: numericIdAgent })
    await charger()
  }

  async function proposerPrecontrat(id, payload) {
    await preContratsService.creer({
      ...payload,
      demandeVisiteId: Number(id),
    })
    preContratsCreesLocalement.value.add(String(id))
    await charger()
  }

  return {
    visites,
    chargement,
    erreur,
    enAttente,
    proposees,
    confirmees,
    terminees,
    aContractualiser,
    termineesSansSuite,
    refusees,
    visiteAvecContrat,
    preContratExiste,
    charger,
    changerStatut,
    refuser,
    proposerCreneau,
    proposerPrecontrat,
  }
})
