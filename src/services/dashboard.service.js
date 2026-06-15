import api from './api'
import { mockStats, mockBiens, mockPaiements, mockVisites } from './mockData'
import { enrichDashboardStats } from '@/utils/dashboard.mapper'
import { getToken } from './storage'

const USE_MOCK_ONLY = import.meta.env.VITE_USE_MOCK === 'true'

function getMockDashboard() {
  const apiShape = {
    totalBiens: mockStats.totalBiens,
    biensLoues: mockStats.biensLoues,
    biensDisponibles: mockStats.biensDisponibles,
    biensReserves: mockStats.biensReserves,
    revenusMois: mockStats.revenusMois,
    loyersEnRetard: mockStats.loyersEnRetard,
    visitesEnAttente: mockStats.visitesEnAttente,
    demandesLocationEnAttente: mockStats.demandesLocationEnAttente,
    contratsExpirantBientot: mockStats.contratsExpirantBientot,
    notificationsNonLues: mockStats.notificationsNonLues,
    revenusParMois: mockStats.revenusParMois.map((m) => ({
      mois: m.mois,
      montant: m.encaisse ?? m.montant,
    })),
  }

  const enriched = enrichDashboardStats(apiShape, {
    paiements: mockPaiements,
    visites: mockVisites,
    biens: mockBiens,
  })

  return {
    ...enriched,
    variationRevenus: mockStats.variationRevenus,
    variationOccupation: mockStats.variationOccupation,
    variationLoyersRetard: mockStats.variationLoyersRetard,
    revenusParMois: mockStats.revenusParMois,
    montantLoyersEnRetard: mockStats.montantLoyersEnRetard,
  }
}

/**
 * Charge le tableau de bord depuis l'API NEKASO :
 * - GET /dashboard/stats
 * - GET /paiements/gestionnaire (liste loyers en retard)
 * - GET /visites/gestionnaire (visites en attente)
 * - GET /biens/gestionnaire (répartition portefeuille)
 */
export const dashboardService = {
  async load() {
    if (USE_MOCK_ONLY) {
      return getMockDashboard()
    }

    const token = getToken()
    if (!token) {
      return getMockDashboard()
    }

    try {
      const [statsRes, paiementsRes, visitesRes, biensRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/paiements/gestionnaire'),
        api.get('/visites/gestionnaire/demande'),
        api.get('/biens/gestionnaire'),
      ])

      return enrichDashboardStats(statsRes.data, {
        paiements: paiementsRes.data,
        visites: visitesRes.data,
        biens: biensRes.data,
      })
    } catch {
      return getMockDashboard()
    }
  },
}
