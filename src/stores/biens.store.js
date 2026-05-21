import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { biensService } from '@/services/biens.service'
import { mockBiens } from '@/services/mockData'

export const useBiensStore = defineStore('biens', () => {

  const biens      = ref([])  // La liste des biens
  const chargement = ref(false) // true pendant qu'on attend la réponse
  const erreur     = ref(null)  // Message d'erreur si quelque chose rate

  /*
    Statistiques calculées automatiquement à partir de la liste.
    Pas besoin d'appels API supplémentaires pour ces chiffres,
    on les calcule côté frontend.
  */
  const totalBiens = computed(() => biens.value.length)
  
  const biensDisponibles = computed(() =>
    biens.value.filter(b => b.statutBien === 'DISPONIBLE')
  )
  
  const biensLoues = computed(() =>
    biens.value.filter(b => b.statutBien === 'LOUE')
  )
  
  const biensReserves = computed(() =>
    biens.value.filter(b => b.statutBien === 'RESERVE')
  )

  async function charger() {
    chargement.value = true
    erreur.value = null
    
    try {
      /*
        UTILISATION DES MOCK DATA POUR L'INSTANT
        Quand Spring Boot sera prêt, remplace les 2 lignes suivantes par :
        const res = await biensService.getMesBiens()
        biens.value = res.data
      */
      await new Promise(resolve => setTimeout(resolve, 500)) // Simule le délai réseau
      biens.value = mockBiens
      
    } catch (e) {
      // Si quelque chose rate, on stocke le message d'erreur
      erreur.value = 'Impossible de charger les biens. Réessayez.'
      console.error('Erreur chargement biens:', e)
    } finally {
      // finally s'exécute toujours, qu'il y ait eu une erreur ou non
      // On arrête le chargement dans tous les cas
      chargement.value = false
    }
  }

  async function creer(formData) {
    // Quand Spring Boot sera prêt :
    // await biensService.creer(formData)
    // await charger()
    
    // Pour l'instant avec mockData :
    console.log('Créer bien (mock):', formData)
    await charger()
  }

  async function archiver(id) {
    // await biensService.archiver(id)
    // await charger()
    
    // Mock : filtrer le bien archivé de la liste locale
    biens.value = biens.value.filter(b => b.id !== id)
  }

  return {
    biens, chargement, erreur,
    totalBiens, biensDisponibles, biensLoues, biensReserves,
    charger, creer, archiver
  }
})