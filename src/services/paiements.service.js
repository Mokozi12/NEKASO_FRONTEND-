import api from './api'

/*
  paiement-controller
  - POST  /api/paiements/gestionnaire/create/{idContrat}/{mois}/{methodePaiement}
  - GET   /api/paiements/historiques-paiements/contrat/{contratId}   (page, size)
*/
export const paiementsService = {
  // Enregistre un paiement pour un contrat (mois = "Juin", méthode = "OM"/"WAVE"/...).
  enregistrer: (idContrat, mois, methodePaiement) =>
    api.post(
      `/paiements/gestionnaire/create/${idContrat}/${encodeURIComponent(mois)}/${methodePaiement}`,
    ),

  // Historique des paiements d'un contrat.
  getHistorique: (contratId, params) =>
    api.get(`/paiements/historiques-paiements/contrat/${contratId}`, { params }),
}
