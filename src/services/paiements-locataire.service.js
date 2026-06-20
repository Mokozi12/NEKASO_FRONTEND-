import api from './api'

export const paiementsLocataireService = {
  getHistorique: (contratId, params) =>
    api.get(`/paiements/locataire/historiques-paiements/contrat/${contratId}`, { params }),
}

