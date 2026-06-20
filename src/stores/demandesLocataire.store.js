import { defineStore } from 'pinia'
import { ref } from 'vue'
import { demandesLocataireService } from '@/services/demandes-locataire.service'

export const useDemandesLocataireStore = defineStore('demandesLocataire', () => {
  const demandes = ref([])
  const chargement = ref(false)

  async function chargerDemandes(params = {}) {
    chargement.value = true
    try {
      const data = await demandesLocataireService.getDemandes(params)
      demandes.value = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Erreur chargement demandes locataire:', e)
    } finally {
      chargement.value = false
    }
  }

  return { demandes, chargement, chargerDemandes }
})
