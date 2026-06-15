import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { biensPublicsService } from '@/services/biens-publics.service'

export const useBiensPublicsStore = defineStore('biensPublics', () => {
  const biens = ref([])
  const bienCourant = ref(null)
  const chargement = ref(false)
  const erreur = ref(null)

  const biensDisponibles = computed(() =>
    biens.value.filter((b) => (b.statutBien || b.statut)?.toUpperCase() === 'DISPONIBLE'),
  )
  const biensEnVedette = computed(() => biensDisponibles.value.slice(0, 3))
  const totalBiens = computed(() => biens.value.length)

  // GET /api/biens/locataire/biens_disponibles
  async function chargerBiens(params = {}) {
    chargement.value = true
    erreur.value = null
    try {
      biens.value = await biensPublicsService.getAll(params)
    } catch (e) {
      erreur.value = 'Impossible de charger les biens.'
      console.error('Erreur chargement biens publics:', e.response?.status, e.response?.data)
    } finally {
      chargement.value = false
    }
  }

  // Pas de GET /biens/{bienId} → on charge tous les biens disponibles et on filtre par ID
  async function chargerBienParId(id) {
    chargement.value = true
    erreur.value = null
    try {
      // Cherche d'abord dans les biens déjà chargés
      let trouve = biens.value.find((b) => String(b.id) === String(id))
      if (!trouve) {
        const tous = await biensPublicsService.getAll()
        biens.value = tous
        trouve = tous.find((b) => String(b.id) === String(id))
      }
      bienCourant.value = trouve || null
      if (!bienCourant.value) erreur.value = 'Bien introuvable.'
    } catch (e) {
      erreur.value = 'Impossible de charger ce bien.'
      console.error('Erreur chargerBienParId:', e.response?.status, e.response?.data)
    } finally {
      chargement.value = false
    }
  }

  // GET /api/biens/locataire/biens_disponibles (avec filtres)
  async function rechercher(filtres) {
    chargement.value = true
    erreur.value = null
    try {
      biens.value = await biensPublicsService.getAll(filtres)
    } catch (e) {
      erreur.value = 'Erreur lors de la recherche.'
      console.error('Erreur recherche biens:', e.response?.status, e.response?.data)
    } finally {
      chargement.value = false
    }
  }

  return { biens, bienCourant, chargement, erreur, biensDisponibles, biensEnVedette, totalBiens, chargerBiens, chargerBienParId, rechercher }
})
