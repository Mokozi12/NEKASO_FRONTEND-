import api from './api'

export const demandesLocataireService = {
  getDemandes: (params) => api.get('/demandes/locataire', { params }),

  creer: (idBien) => api.post(`/demandes/locataire/bien/${idBien}`),

  changerStatut: (idDemande, statut) =>
    api.patch(`/demandes/locataire/demande/${idDemande}/statut/${statut}`),
}

