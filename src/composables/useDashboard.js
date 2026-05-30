import { onMounted, computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard.store'
import { useFormat } from './useFormat'

const COULEUR_PRIMAIRE = '#1a2234'
const COULEUR_VERT_CLAIR = '#86efac'

export function useDashboard() {
  const dashboardStore = useDashboardStore()
  const { formatMontant } = useFormat()

  onMounted(() => {
    if (!dashboardStore.statsChargees) {
      dashboardStore.charger()
    }
  })

  const statsFormatees = computed(() => {
    if (!dashboardStore.stats) return null
    const s = dashboardStore.stats
    return {
      revenusMois: formatMontant(s.revenusMois),
      montantLoyersEnRetard: formatMontant(s.montantLoyersEnRetard),
      biensLoues: s.biensLoues,
      totalBiens: s.totalBiens,
    }
  })

  const alertePrincipale = computed(() => {
    if (dashboardStore.loyersEnRetard <= 0) return null
    const nb = dashboardStore.loyersEnRetard
    const label = nb > 1 ? 'loyer(s)' : 'loyer'
    return `${nb} ${label} en retard ce mois — ${formatMontant(dashboardStore.montantLoyersEnRetard)} FCFA à recouvrer`
  })

  const donneesGraphiqueBarres = computed(() => {
    const mois = dashboardStore.revenusParMois
    if (!mois.length) return null
    return {
      labels: mois.map((m) => m.mois),
      datasets: [
        {
          label: 'Encaissé',
          data: mois.map((m) => m.encaisse ?? m.montant ?? 0),
          backgroundColor: COULEUR_PRIMAIRE,
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.65,
        },
        {
          label: 'Année précédent',
          data: mois.map((m) => m.anneePrecedente ?? (m.montant ?? 0) * 0.85),
          backgroundColor: COULEUR_VERT_CLAIR,
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.65,
        },
      ],
    }
  })

  const donneesGraphiqueDonut = computed(() => {
    const items = dashboardStore.portefeuille
    if (!items.length) return null
    return {
      labels: items.map((p) => p.type),
      datasets: [
        {
          data: items.map((p) => p.count),
          backgroundColor: items.map((p) => p.color),
          borderColor: '#fff',
          borderWidth: 3,
          hoverOffset: 4,
        },
      ],
    }
  })

  const totalPortefeuille = computed(() =>
    dashboardStore.portefeuille.reduce((acc, p) => acc + p.count, 0),
  )

  function formatVariation(value) {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value}%`
  }

  const variationRevenus = computed(() => dashboardStore.variationRevenus)
  const variationOccupation = computed(() => dashboardStore.variationOccupation)
  const variationLoyersRetard = computed(() => dashboardStore.variationLoyersRetard)
  const trendRevenus = computed(() => (dashboardStore.variationRevenus >= 0 ? 'up' : 'down'))
  const trendOccupation = computed(() =>
    dashboardStore.variationOccupation >= 0 ? 'up' : 'down',
  )
  const trendRetard = computed(() => 'down')

  return {
    dashboardStore,
    chargement: computed(() => dashboardStore.chargement),
    erreur: computed(() => dashboardStore.erreur),
    statsFormatees,
    alertePrincipale,
    donneesGraphiqueBarres,
    donneesGraphiqueDonut,
    totalPortefeuille,
    formatVariation,
    tauxOccupation: computed(() => dashboardStore.tauxOccupation),
    variationRevenus,
    variationOccupation,
    variationLoyersRetard,
    trendRevenus,
    trendOccupation,
    trendRetard,
  }
}
