import { defineStore } from 'pinia'
import { ref } from 'vue'
import { visitesLocataireService } from '@/services/visites-locataire.service'

export const useVisitesLocataireStore = defineStore('visitesLocataire', () => {
  const visites = ref([])
  const chargement = ref(false)

  async function chargerVisites(params = {}) {
    chargement.value = true
    try {
      const data = await visitesLocataireService.getVisites(params)
      visites.value = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Erreur chargement visites locataire:', e)
    } finally {
      chargement.value = false
    }
  }

  return { visites, chargement, chargerVisites }
})
