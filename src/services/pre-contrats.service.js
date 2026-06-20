import api from './api'

export const preContratsService = {
  creer: (payload) => api.post('/pre-contrats/gestionnaire/create', payload),

  valider: (id) => api.patch(`/pre-contrats/locataire/statut/${id}/valider`),
  invalider: (id) => api.patch(`/pre-contrats/locataire/statut/${id}/invalider`),
  modifier: (id) => api.patch(`/pre-contrats/gestionnaire/statut/${id}/modifier`),

  getParLocataire: (params) =>
    api.get('/pre-contrats/locataire', { params }),
  getParGestionnaire: (params) =>
    api.get('/pre-contrats/gestionnaire', { params }),
}

