import api from './api'

export const demandesLocationService = {
  getListe: ()             => api.get('/demandes-location/gestionnaire'),
  valider:  (id, data)     => api.patch(`/demandes-location/${id}/valider`, data),
  refuser:  (id)           => api.patch(`/demandes-location/${id}/refuser`)
}
