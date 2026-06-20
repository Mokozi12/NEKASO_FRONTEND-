import api from './api'

export const demandesLocationService = {
  getListe: (params) => api.get('/demandes/gestionnaire/demandes-locations', { params }),

  changerStatut: (idDemande, statut) =>
    api.patch(`/demandes/gestionnaire/demande/${idDemande}/statut/${statut}`),

  valider: (id) => api.patch(`/demandes/gestionnaire/demande/${id}/statut/VALIDEE`),
  refuser: (id) => api.patch(`/demandes/gestionnaire/demande/${id}/statut/REFUSEE`),
  annuler: (id) => api.patch(`/demandes/gestionnaire/demande/${id}/statut/ANNULEE`),
}

