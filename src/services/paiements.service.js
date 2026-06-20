import api from './api'

export const paiementsService = {
  enregistrer: (idContrat, mois, methodePaiement) =>
    api.post(
      `/paiements/gestionnaire/create/${idContrat}/${encodeURIComponent(mois)}/${methodePaiement}`,
    ),

  getHistorique: (contratId, params) =>
    api.get(`/paiements/gestionnaire/historiques-paiements/contrat/${contratId}`, { params }),
}

