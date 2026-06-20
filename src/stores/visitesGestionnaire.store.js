import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { visitesService } from '@/services/visites.service'
import { preContratsService } from '@/services/pre-contrats.service'
import { listeOuVide } from '@/utils/apiResponse'
import { mapVisites, mapPreContrats } from '@/services/mappers'

export const useVisitesGestionnaireStore = defineStore('visitesGestionnaire', () => {
  const visites = ref([])
  const chargement = ref(false)
  const erreur = ref(null)

  const enAttente  = computed(() => visites.value.filter((v) => v.statut === 'EN_ATTENTE'))
  const validees   = computed(() => visites.value.filter((v) => ['VALIDEE', 'CONFIRMEE'].includes(v.statut)))
  const confirmees = computed(() => visites.value.filter((v) => v.statut === 'CONFIRMEE'))
  const cloturees  = computed(() =>
    visites.value.filter((v) =>
      ['CLOTUREE_AVEC_CONTRAT', 'CLOTUREE_SANS_CONTRAT'].includes(v.statut),
    ),
  )

  async function chargerAnnuaireLocataires() {
    try {
      const pcs = mapPreContrats(await listeOuVide(preContratsService.getParGestionnaire({ page: 0, size: 200 })))
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
      return new Map()
    }
  }

  async function charger(params = {}) {
    chargement.value = true
    erreur.value = null
    try {
      const [liste, annuaire] = await Promise.all([
        listeOuVide(visitesService.getListe({ page: 0, size: 50, ...params })),
        chargerAnnuaireLocataires(),
      ])
      visites.value = mapVisites(liste).map((v) => ({
        ...v,
        client:
          v.client ||
          annuaire.get(String(v.locataireId)) ||
          { id: v.locataireId, nom: `Client #${v.locataireId}`, prenom: '', telephone: '' },
      }))
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

  async function confirmer(id, idBien, idAgent) {
    await visitesService.confirmer(id, idBien, idAgent)
    await charger()
  }

  return {
    visites,
    chargement,
    erreur,
    enAttente,
    validees,
    confirmees,
    cloturees,
    charger,
    changerStatut,
    refuser,
    confirmer,
  }
})
