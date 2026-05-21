import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { demandesLocationService } from '@/services/demandes-location.service'
import { mockDemandesLocation } from '@/services/mockData'

export const useDemandesLocationStore = defineStore('demandesLocation', () => {

  const demandes   = ref([])
  const chargement = ref(false)
  const erreur     = ref(null)

  const enAttente = computed(() => demandes.value.filter(d => d.statut === 'EN_ATTENTE'))
  const validees  = computed(() => demandes.value.filter(d => d.statut === 'VALIDEE'))
  const refusees  = computed(() => demandes.value.filter(d => d.statut === 'REFUSEE'))

  async function charger() {
    chargement.value = true
    erreur.value = null
    try {
      // TODO : const res = await demandesLocationService.getListe()
      // demandes.value = res.data
      await new Promise(r => setTimeout(r, 400))
      demandes.value = mockDemandesLocation
    } catch (e) {
      erreur.value = 'Impossible de charger les demandes de location.'
    } finally {
      chargement.value = false
    }
  }

  async function valider(id, data) {
    // TODO : await demandesLocationService.valider(id, data)
    demandes.value = demandes.value.map(d =>
      d.id === id ? { ...d, statut: 'VALIDEE' } : d
    )
  }

  async function refuser(id) {
    // TODO : await demandesLocationService.refuser(id)
    demandes.value = demandes.value.map(d =>
      d.id === id ? { ...d, statut: 'REFUSEE' } : d
    )
  }

  return { demandes, chargement, erreur, enAttente, validees, refusees, charger, valider, refuser }
})
