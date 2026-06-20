import api from './api'

/*
  demande-visite-controller (côté gestionnaire)
  - GET    /api/visites/gestionnaire/demande                                           (statut, page, size)
  - PATCH  /api/visites/gestionnaire/demande/{id}/statut/{statut}
  - PATCH  /api/visites/gestionnaire/demande/{id}/confirmer/bien/{idBien}/agent/{idAgent}
*/
export const visitesService = {
  getListe: (params) => api.get('/visites/gestionnaire/demande', { params }),

  changerStatut: (id, statut) =>
    api.patch(`/visites/gestionnaire/demande/${id}/statut/${statut}`),

  // Raccourcis lisibles pour les statuts courants.
  refuser: (id) => api.patch(`/visites/gestionnaire/demande/${id}/statut/REFUSEE`),

  // Confirme une visite en lui affectant un bien + un agent.
  confirmer: (id, idBien, idAgent) =>
    api.patch(`/visites/gestionnaire/demande/${id}/confirmer/bien/${idBien}/agent/${idAgent}`),
}
