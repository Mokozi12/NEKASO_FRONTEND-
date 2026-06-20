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

  return { visites, chargement, erreur, chargerVisites, demander }
})
