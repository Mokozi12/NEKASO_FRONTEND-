import api from './api'

/*
  demande-location-controller — OPTION A
  - GET    /api/demandes/demandes-locations                       (statut, page, size)  [gestionnaire]
  - GET    /api/demandes/mes-demandes                             (statut, page, size)  [locataire, token]
  - POST   /api/demandes/bien/{idBien}                                                  [locataire, token]
  - PATCH  /api/demandes/demande/{idDemande}/statut/{nouveauStatut}
*/
export const demandesLocationService = {
  // Toutes les demandes (vue gestionnaire).
  getListe: (params) => api.get('/demandes/demandes-locations', { params }),

  // Demandes du locataire connecté (token JWT, OPTION A).
  getParLocataire: (params) => api.get('/demandes/mes-demandes', { params }),

  // Le locataire demande à louer un bien (token JWT, OPTION A).
  creer: (idBien) => api.post(`/demandes/bien/${idBien}`),

  // Changement de statut (générique).
  changerStatut: (id, statut) => api.patch(`/demandes/demande/${id}/statut/${statut}`),

  // Raccourcis lisibles.
  valider: (id) => api.patch(`/demandes/demande/${id}/statut/ACCEPTEE`),
  refuser: (id) => api.patch(`/demandes/demande/${id}/statut/REFUSEE`),
  annuler: (id) => api.patch(`/demandes/demande/${id}/statut/ANNULEE`),
}
