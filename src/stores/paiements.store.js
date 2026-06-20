import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { STATUT_ECHEANCE } from '@/utils/constants'
import { paiementsService } from '@/services/paiements.service'
import { mapPaiements } from '@/services/mappers'
import { pageMeta } from '@/utils/apiResponse'

export const usePaiementsStore = defineStore('paiements', () => {

  const historique = ref([])
  const paginationHistorique = ref({ page: 0, size: 5, totalElements: 0, totalPages: 1 })
  const chargementHistorique = ref(false)

  async function chargerHistorique(contratId, params = { page: 0, size: 5 }) {
    chargementHistorique.value = true
    try {
      const res = await paiementsService.getHistorique(contratId, params)
      const meta = pageMeta(res)
      historique.value = mapPaiements(meta.items)
      paginationHistorique.value = {
        page: meta.page,
        size: meta.size,
        totalElements: meta.totalElements,
        totalPages: meta.totalPages,
      }
    } catch (e) {
      if (e?.response?.status === 404) historique.value = []
      else console.error('chargerHistorique:', e)
    } finally {
      chargementHistorique.value = false
    }
  }

  async function enregistrerPaiementBackend(contratId, mois, methodePaiement) {
    await paiementsService.enregistrer(contratId, mois, methodePaiement)
    await chargerHistorique(contratId)
  }



  function echeanceCourante(contrat) {
    if (!contrat?.echeances?.length) return null
    const triees = contrat.echeances
      .slice()
      .sort((a, b) => new Date(a.dateEcheance) - new Date(b.dateEcheance))
    return triees.find((e) => e.statut !== STATUT_ECHEANCE.PAYE) || null
  }

  function echeancesAPayer(contrat) {
    if (!contrat?.echeances?.length) return []
    return contrat.echeances.filter((e) => e.statut !== STATUT_ECHEANCE.PAYE)
  }

  return {
    echeanceCourante,
    echeancesAPayer,
    historique,
    paginationHistorique,
    chargementHistorique,
    chargerHistorique,
    enregistrerPaiementBackend,
  }
})

function genererReference(methode) {
  const prefix = { ORANGE_MONEY: 'OM', WAVE: 'WV', ESPECES: 'ESP', VIREMENT: 'VIR' }[methode] || 'PAY'
  const d = new Date()
  const stamp = `${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getFullYear()).slice(2)}`
  return `${prefix}-${stamp}-${Math.floor(Math.random() * 900 + 100)}`
}

function formatMontant(m) {
  return Number(m || 0).toLocaleString('fr-FR')
}
