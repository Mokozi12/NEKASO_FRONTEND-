import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dashboardService } from '@/services/dashboard.service'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref(null)
  const chargement = ref(false)
  const erreur = ref(null)
  const sourceDonnees = ref('api')

  const statsChargees = computed(() => stats.value !== null)
  const totalBiens = computed(() => stats.value?.totalBiens ?? 0)
  const biensLoues = computed(() => stats.value?.biensLoues ?? 0)
  const revenusMois = computed(() => stats.value?.revenusMois ?? 0)
  const loyersEnRetard = computed(() => stats.value?.loyersEnRetard ?? 0)
  const montantLoyersEnRetard = computed(() => stats.value?.montantLoyersEnRetard ?? 0)
  const visitesEnAttente = computed(() => stats.value?.visitesEnAttente ?? 0)
  const notificationsNonLues = computed(() => stats.value?.notificationsNonLues ?? 0)
  const revenusParMois = computed(() => stats.value?.revenusParMois ?? [])
  const portefeuille = computed(() => stats.value?.portefeuille ?? [])
  const loyersEnRetardListe = computed(() => stats.value?.loyersEnRetardListe ?? [])
  const visitesEnAttenteListe = computed(() => stats.value?.visitesEnAttenteListe ?? [])
  const variationRevenus = computed(() => stats.value?.variationRevenus ?? 0)
  const variationOccupation = computed(() => stats.value?.variationOccupation ?? 0)
  const variationLoyersRetard = computed(() => stats.value?.variationLoyersRetard ?? 0)
  const tauxOccupation = computed(() => stats.value?.tauxOccupation ?? 0)

  async function charger() {
    chargement.value = true
    erreur.value = null
    try {
      const data = await dashboardService.load()
      stats.value = data
      sourceDonnees.value = localStorage.getItem('nekaso_token') ? 'api' : 'demo'
    } catch {
      erreur.value = 'Impossible de charger le tableau de bord'
    } finally {
      chargement.value = false
    }
  }

  function reinitialiser() {
    stats.value = null
    erreur.value = null
    chargement.value = false
  }

  return {
    stats,
    chargement,
    erreur,
    sourceDonnees,
    statsChargees,
    totalBiens,
    biensLoues,
    revenusMois,
    loyersEnRetard,
    montantLoyersEnRetard,
    visitesEnAttente,
    notificationsNonLues,
    revenusParMois,
    portefeuille,
    loyersEnRetardListe,
    visitesEnAttenteListe,
    variationRevenus,
    variationOccupation,
    variationLoyersRetard,
    tauxOccupation,
    charger,
    reinitialiser,
  }
})
