import api from './api'

export const visitesService = {
  getListe: (params) => api.get('/visites/gestionnaire/demande', { params }),
  approuver: (id) => api.patch(`/visites/gestionnaire/demande/${id}/statut/CONFIRMEE`),
  refuser: (id) => api.patch(`/visites/gestionnaire/demande/${id}/statut/REFUSEE`),
}
