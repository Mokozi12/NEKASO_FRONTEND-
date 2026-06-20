import api from './api'

/*
  pre-contrat-controller
  - POST   /api/pre-contrats/gestionnaire/create
           body: { dateDebutPrevu, jourEcheancePaiement, conditions, demandeLocationId, demandeVisiteId }
  - PATCH  /api/pre-contrats/statut/{id}/valider     (le locataire valide)
  - PATCH  /api/pre-contrats/statut/{id}/modifier
  - PATCH  /api/pre-contrats/statut/{id}/invalider
  - GET    /api/pre-contrats/locataire/{locataireId}        (page, size, sort)
  - GET    /api/pre-contrats/gestionnaire/{gestionnaireId}  (page, size, sort)
*/
export const preContratsService = {
  creer: (payload) => api.post('/pre-contrats/gestionnaire/create', payload),

  valider: (id) => api.patch(`/pre-contrats/statut/${id}/valider`),
  modifier: (id) => api.patch(`/pre-contrats/statut/${id}/modifier`),
  invalider: (id) => api.patch(`/pre-contrats/statut/${id}/invalider`),

  getParLocataire: (locataireId, params) =>
    api.get(`/pre-contrats/locataire/${locataireId}`, { params }),
  getParGestionnaire: (gestionnaireId, params) =>
    api.get(`/pre-contrats/gestionnaire/${gestionnaireId}`, { params }),
}
