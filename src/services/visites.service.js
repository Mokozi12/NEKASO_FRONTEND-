import api from './api'

export const visitesService = {
  getListe: (params) => api.get('/visites/gestionnaire/demande', { params }),

  changerStatut: (id, statut) =>
    api.patch(`/visites/gestionnaire/demande/${id}/statut/${statut}`),

  refuser: (id) => api.patch(`/visites/gestionnaire/demande/${id}/statut/REFUSEE`),

  confirmer: (id, idBien, idAgent) =>
    api.patch(`/visites/gestionnaire/demande/${id}/confirmer/bien/${idBien}/agent/${idAgent}`),
}
