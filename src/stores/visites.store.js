import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { visitesService } from '@/services/visites.service'

export const useVisitesStore = defineStore('visites', () => {
  const visites = ref([])
  const chargement = ref(false)
  const erreur = ref(null)

  const enAttente = computed(() => visites.value.filter((v) => v.statut === 'EN_ATTENTE'))
  const confirmees = computed(() => visites.value.filter((v) => v.statut === 'CONFIRMEE'))
  const refusees = computed(() => visites.value.filter((v) => v.statut === 'REFUSEE'))

  // GET /api/visites/gestionnaire/demande
  async function charger() {
    chargement.value = true
    erreur.value = null
    try {
      const res = await visitesService.getListe()
      const data = res.data
      visites.value = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
    } catch (e) {
      erreur.value = 'Impossible de charger les visites.'
      console.error('Erreur chargement visites:', e.response?.status, e.response?.data)
    } finally {
      chargement.value = false
    }
  }

  // PATCH /api/visites/gestionnaire/demande/{id}/statut/CONFIRMEE
  async function confirmer(id) {
    try {
      await visitesService.approuver(id)
    } catch (e) {
      console.warn('Erreur confirmation visite, mise à jour locale', e)
    }
    visites.value = visites.value.map((v) => (v.id === id ? { ...v, statut: 'CONFIRMEE' } : v))
  }

  // PATCH /api/visites/gestionnaire/demande/{id}/statut/REFUSEE
  async function refuser(id) {
    try {
      await visitesService.refuser(id)
    } catch (e) {
      console.warn('Erreur refus visite, mise à jour locale', e)
    }
    visites.value = visites.value.map((v) => (v.id === id ? { ...v, statut: 'REFUSEE' } : v))
  }

  async function reprogrammer(id, nouvelleDate, nouvelleHeure) {
    visites.value = visites.value.map((v) =>
      v.id === id
        ? { ...v, dateCreation: nouvelleDate, heureVisite: nouvelleHeure, statut: 'EN_ATTENTE' }
        : v,
    )
  }

  async function creer(nouvelleVisite) {
    const id = visites.value.length > 0 ? Math.max(...visites.value.map((v) => v.id)) + 1 : 1
    visites.value.push({ id, statut: 'EN_ATTENTE', dateCreation: new Date().toISOString().split('T')[0], ...nouvelleVisite })
  }

  return { visites, chargement, erreur, enAttente, confirmees, refusees, charger, confirmer, refuser, reprogrammer, creer }
})
