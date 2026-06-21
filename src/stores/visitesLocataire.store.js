import { defineStore } from 'pinia'
import { ref } from 'vue'
import { visitesLocataireService } from '@/services/visites-locataire.service'
import { listeOuVide } from '@/utils/apiResponse'
import { mapVisites } from '@/services/mappers'

export const useVisitesLocataireStore = defineStore('visitesLocataire', () => {
  const visites = ref([])
  const chargement = ref(false)
  const erreur = ref(null)

  async function chargerVisites(params = {}) {
    chargement.value = true
    erreur.value = null
    try {
      const liste = await listeOuVide(visitesLocataireService.getVisites(params))
      visites.value = mapVisites(liste)
    } catch (e) {
      erreur.value = 'Impossible de charger les visites.'
      console.error('Erreur chargement visites locataire:', e?.response?.status, e?.response?.data)
    } finally {
      chargement.value = false
    }
  }

  async function demander(idBien) {
    const res = await visitesLocataireService.demander(idBien)
    await chargerVisites()
    return res
  }

  async function accepterCreneau(idDemande) {
    const res = await visitesLocataireService.accepterCreneau(idDemande)
    await chargerVisites()
    return res
  }

  async function cloturer(idDemande, choix, payload = {}) {
    const res = await visitesLocataireService.cloturer(idDemande, choix, payload)
    
    // Mémoriser localement pour affichage instantané
    try {
      const clotures = JSON.parse(localStorage.getItem('nekaso_visites_clotures') || '{}')
      clotures[idDemande] = choix
      localStorage.setItem('nekaso_visites_clotures', JSON.stringify(clotures))
    } catch (e) {}

    // Tentative de forcer la synchronisation chez le gestionnaire
    try {
      const { default: api } = await import('@/services/api')
      await api.patch(`/visites/gestionnaire/demande/${idDemande}/statut/TERMINEE`)
    } catch (e) {
      console.warn('Impossible de forcer le statut côté gestionnaire', e)
    }

    await chargerVisites()
    return res
  }

  return { visites, chargement, erreur, chargerVisites, demander, accepterCreneau, cloturer }
})
