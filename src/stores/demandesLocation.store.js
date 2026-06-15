import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { demandesLocationService } from '@/services/demandes-location.service'

// GET /api/demandes/gestionnaire n'existe pas côté backend.
// La liste gestionnaire sera vide jusqu'à l'implémentation de cet endpoint.

export const useDemandesLocationStore = defineStore('demandesLocation', () => {
  const demandes = ref([])
  const chargement = ref(false)
  const erreur = ref(null)

  const enAttente = computed(() => demandes.value.filter((d) => d.statut === 'EN_ATTENTE'))
  const validees = computed(() => demandes.value.filter((d) => ['VALIDEE', 'ACCEPTEE'].includes(d.statut)))
  const refusees = computed(() => demandes.value.filter((d) => ['REFUSEE', 'REFUSE'].includes(d.statut)))

  async function charger() {
    // Pas d'endpoint GET /demandes/gestionnaire — liste vide en attendant
    demandes.value = []
  }

  // PATCH /api/demandes/demande/{id}/accepter
  async function valider(id) {
    try {
      await demandesLocationService.valider(id)
    } catch (e) {
      console.warn('Erreur API valider demande, mise à jour locale', e)
    }
    demandes.value = demandes.value.map((d) => (d.id === id ? { ...d, statut: 'ACCEPTEE' } : d))
  }

  // PATCH /api/demandes/demande/{id}/refuser
  async function refuser(id) {
    try {
      await demandesLocationService.refuser(id)
    } catch (e) {
      console.warn('Erreur API refuser demande, mise à jour locale', e)
    }
    demandes.value = demandes.value.map((d) => (d.id === id ? { ...d, statut: 'REFUSEE' } : d))
  }

  return { demandes, chargement, erreur, enAttente, validees, refusees, charger, valider, refuser }
})
