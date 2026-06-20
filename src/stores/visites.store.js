import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { STATUT_VISITE } from '@/utils/constants'
import { visitesLocataireService } from '@/services/visites-locataire.service'
import { visitesService } from '@/services/visites.service'
import { useAuthStore } from '@/stores/auth.store'
import { useBiensStore } from '@/stores/biens.store'

export const useVisitesStore = defineStore('visites', () => {
  const authStore = useAuthStore()
  const biensStore = useBiensStore()

  const visites = ref([])
  const chargement = ref(false)

  function _extraire(res) {
    const body = res?.data ?? res
    if (Array.isArray(body?.data)) return body.data
    if (Array.isArray(body?.items)) return body.items
    if (Array.isArray(body?.content)) return body.content
    if (Array.isArray(body)) return body
    return []
  }

  function normaliser(v) {
    const bienTrouve = biensStore.getBien(v.idBien ?? v.bienId)
    const bienInfo = v.bien || bienTrouve || {
      id: v.idBien ?? v.bienId,
      intitule: v.bienIntitule ?? v.titreBien ?? v.libelleBien ?? `Bien #${v.idBien ?? v.bienId}`,
      adresse: v.bienAdresse ?? v.adresseBien ?? '',
      loyer: v.bienLoyer ?? v.loyerBien ?? 0,
    }

    const locId = v.idLocataire ?? v.locataireId ?? v.locataire?.idLocataire ?? v.clientId ?? v.idClient
    const locataireInfo = v.locataire ?? v.client ?? {
      id: locId,
      nom: v.locataireNom ?? v.nomLocataire ?? v.clientNom ?? v.nomClient ?? '',
      prenom: v.locatairePrenom ?? v.prenomLocataire ?? v.clientPrenom ?? v.prenomClient ?? '',
      telephone: v.locataireTelephone ?? v.telephoneLocataire ?? v.clientTelephone ?? v.telephoneClient ?? '',
    }

    return {
      id: v.idVisite ?? v.id,
      bienId: v.idBien ?? v.bien?.idBien ?? v.bienId,
      clientId: locId,
      agentId: v.idAgent ?? v.agent?.idAgent ?? null,
      statut: v.statut ?? v.statutVisite,
      dateCreation: v.dateCreation ?? v.dateDemande,
      creneau: v.dateCreneau ? { date: v.dateCreneau.split('T')[0], heure: v.heureCreneau } : null,
      compteRendu: v.compteRendu ?? null,
      bien: bienInfo,
      client: (locataireInfo.nom || locataireInfo.prenom || locataireInfo.telephone) ? locataireInfo : null,
      agent: v.agent ?? null,
    }
  }


  async function chargerGestionnaire() {
    chargement.value = true
    try {
      const res = await visitesService.getListe({ size: 100 })
      visites.value = _extraire(res).map(normaliser)
    } catch (e) {
      console.error('chargerGestionnaire visites:', e)
      visites.value = []
    } finally {
      chargement.value = false
    }
  }

  async function chargerLocataire() {
    chargement.value = true
    try {
      const res = await visitesLocataireService.getVisites({ size: 100 })
      visites.value = _extraire(res).map(normaliser)
    } catch (e) {
      console.error('chargerLocataire visites:', e)
      visites.value = []
    } finally {
      chargement.value = false
    }
  }

  const enAttente = computed(() => visites.value.filter(v => v.statut === STATUT_VISITE.EN_ATTENTE))
  const validees = computed(() => visites.value.filter(v => v.statut === STATUT_VISITE.VALIDEE))
  const confirmees = computed(() => visites.value.filter(v => v.statut === STATUT_VISITE.CONFIRMEE))
  const cloturees = computed(() =>
    visites.value.filter(v =>
      [STATUT_VISITE.CLOTUREE_AVEC_CONTRAT, STATUT_VISITE.CLOTUREE_SANS_CONTRAT].includes(v.statut),
    ),
  )
  const mesVisites = computed(() => visites.value)


  async function creerDemande(bienId) {
    try {
      await visitesLocataireService.demander(bienId)
      await chargerLocataire()
    } catch (e) {
      console.error('creerDemande visite:', e)
      throw e
    }
  }

  async function valider(id, { idBien, idAgent }) {
    try {
      await visitesService.confirmer(id, idBien, idAgent)
      await chargerGestionnaire()
    } catch (e) {
      console.error('valider visite:', e)
      throw e
    }
  }

  async function refuser(id) {
    try {
      await visitesService.refuser(id)
      await chargerGestionnaire()
    } catch (e) {
      console.error('refuser visite:', e)
      throw e
    }
  }

  async function changerStatut(id, statut) {
    try {
      await visitesService.changerStatut(id, statut)
      await chargerGestionnaire()
    } catch (e) {
      console.error('changerStatut visite:', e)
      throw e
    }
  }

  async function accepterClient(id) {
    try {
      await visitesService.changerStatut(id, 'CONFIRMEE')
      if (authStore.isGestionnaire) await chargerGestionnaire()
      else await chargerLocataire()
    } catch (e) {
      console.error('accepterClient visite:', e)
      throw e
    }
  }

  function peutAnnuler(visite) {
    return [STATUT_VISITE.VALIDEE, STATUT_VISITE.CONFIRMEE].includes(visite.statut)
  }

  async function annulerClient(id) {
    try {
      await visitesService.changerStatut(id, 'ANNULEE')
      if (authStore.isGestionnaire) await chargerGestionnaire()
      else await chargerLocataire()
    } catch (e) {
      console.error('annulerClient visite:', e)
      throw e
    }
  }

  async function cloturer(id, { issue }) {
    try {
      const statut = issue === 'AVEC_CONTRAT' ? 'CLOTUREE_AVEC_CONTRAT' : 'CLOTUREE_SANS_CONTRAT'
      await visitesService.changerStatut(id, statut)
      await chargerGestionnaire()
    } catch (e) {
      console.error('cloturer visite:', e)
      throw e
    }
    return null
  }

  return {
    visites,
    chargement,
    enAttente,
    validees,
    confirmees,
    cloturees,
    mesVisites,
    chargerGestionnaire,
    chargerLocataire,
    creerDemande,
    valider,
    refuser,
    changerStatut,
    accepterClient,
    annulerClient,
    peutAnnuler,
    cloturer,
  }
})
