import api from './api'

export const visitesService = {
  getListe:  ()   => api.get('/visites/gestionnaire'),
  approuver: (id) => api.patch(`/visites/${id}/approuver`),
  refuser:   (id) => api.patch(`/visites/${id}/refuser`)
}