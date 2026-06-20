import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  db,
  uid,
  delai,
  todayISO,
  getClient,
  STATUT_ECHEANCE,
} from '@/mocks/db'
import { useNotificationsStore } from '@/stores/notifications.store'
import { paiementsService } from '@/services/paiements.service'
import { mapPaiements } from '@/services/mappers'
import { pageMeta } from '@/utils/apiResponse'

/*
  Store des PAIEMENTS (§10, §11).

  Les paiements sont structurés AUTOUR DES CONTRATS : on n'enregistre jamais un
  paiement « isolé », toujours rattaché à un contrat et à une ÉCHÉANCE.

  Lors de l'enregistrement, le système présélectionne automatiquement l'échéance
  correspondante (la prochaine échéance à payer). Le gestionnaire n'a qu'à
  valider → le client reçoit une notification.
*/
export const usePaiementsStore = defineStore('paiements', () => {
  const paiements = computed(() => db.paiements)

  /* ───── Backend : historique réel des paiements d'un contrat ─────
     GET /api/paiements/historiques-paiements/contrat/{contratId} */
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

  /* Enregistre un paiement réel : POST .../create/{idContrat}/{mois}/{methode} */
  async function enregistrerPaiementBackend(contratId, mois, methodePaiement) {
    await paiementsService.enregistrer(contratId, mois, methodePaiement)
    await chargerHistorique(contratId)
  }

  function paiementsParContrat(contratId) {
    return db.paiements
      .filter((p) => p.contratId === contratId)
      .slice()
      .sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement))
  }

  /* §11 : échéance à présélectionner = 1re échéance non payée (ordre chronologique). */
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

  /* Enregistre un paiement rattaché à une échéance puis notifie le client. */
  async function enregistrerPaiement(
    contratId,
    echeanceId,
    { montant, methodePaiement = 'ESPECES', reference = '', datePaiement } = {},
  ) {
    await delai()
    const contrat = db.contrats.find((c) => c.id === contratId)
    if (!contrat) return null
    const echeance = contrat.echeances.find((e) => e.id === echeanceId)

    const paiement = {
      id: uid('paiements'),
      contratId,
      echeanceId,
      montant: montant ?? echeance?.montant ?? contrat.montantLoyer,
      datePaiement: datePaiement || todayISO(),
      methodePaiement,
      reference: reference || genererReference(methodePaiement),
      statut: 'PAYE',
    }
    db.paiements.push(paiement)

    // Marque l'échéance comme payée
    if (echeance) echeance.statut = STATUT_ECHEANCE.PAYE

    // Notifie le client
    const client = getClient(contrat.clientId)
    useNotificationsStore().notifierClient(
      contrat.clientId,
      'PAIEMENT',
      `Votre paiement de ${formatMontant(paiement.montant)} FCFA (${echeance?.libelle || 'échéance'}) a été enregistré.`,
    )
    void client
    return paiement
  }

  return {
    paiements,
    paiementsParContrat,
    echeanceCourante,
    echeancesAPayer,
    enregistrerPaiement,
    // Backend
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
