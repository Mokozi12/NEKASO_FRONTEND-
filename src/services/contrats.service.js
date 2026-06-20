import api from './api'

/*
  contrat-bail-controller
  - POST  /api/contrats/gestionnaire/creer            body: { preContratId }
  - GET   /api/contrats/locataire/{locataireId}       (page, size, sort)
  - GET   /api/contrats/gestionnaire/{gestionnaireId} (page, size, sort)
*/
export const contratsService = {
  // Édite le contrat de bail définitif à partir d'un pré-contrat validé.
  creer: (preContratId) => api.post('/contrats/gestionnaire/creer', { preContratId }),

  getParLocataire: (locataireId, params) =>
    api.get(`/contrats/locataire/${locataireId}`, { params }),
  getParGestionnaire: (gestionnaireId, params) =>
    api.get(`/contrats/gestionnaire/${gestionnaireId}`, { params }),
}
