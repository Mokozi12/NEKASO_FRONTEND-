import { onMounted, computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard.store'
import { useVisitesGestionnaireStore } from '@/stores/visitesGestionnaire.store'
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
    const visitesStore = useVisitesGestionnaireStore()
    if (visitesStore.visites.length === 0) {
      visitesStore.charger()
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
    const visitesStore = useVisitesGestionnaireStore()
    const nbContrats = visitesStore.aContractualiser.length
    if (nbContrats > 0) {
      const v = visitesStore.aContractualiser[0]
      const locataireNom = v.client ? `${v.client.prenom || ''} ${v.client.nom || ''}`.trim() || 'Un client' : 'Un client'
      const bienNom = v.bien?.intitule || 'un bien'
      return `${nbContrats} contrat(s) en attente : Le locataire ${locataireNom} souhaite un contrat pour le bien ${bienNom}.`
    }
    
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
    aContractualiserListe: computed(() => {
      const store = useVisitesGestionnaireStore()
      return store.aContractualiser.map(v => ({
        id: v.id,
        nom: v.client ? `${v.client.prenom || ''} ${v.client.nom || ''}`.trim() || 'Client' : 'Client',
        bien: v.bien?.intitule || 'Bien',
        dateHeure: v.dateCreation
      }))
    }),
  }
}
