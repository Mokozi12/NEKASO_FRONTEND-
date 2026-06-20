import api from './api'

/*
  paiement-controller (consultation locataire)
  - GET  /api/paiements/historiques-paiements/contrat/{contratId}   (page, size)
*/
export const paiementsLocataireService = {
  getHistorique: (contratId, params) =>
    api.get(`/paiements/historiques-paiements/contrat/${contratId}`, { params }),
}
