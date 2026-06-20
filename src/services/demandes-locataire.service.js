import api from './api'

/*
  demande-location-controller (côté locataire) — OPTION A : sans id, le backend
  identifie le locataire via le token JWT (sub).
  - GET   /api/demandes/mes-demandes          (statut, page, size)
  - POST  /api/demandes/bien/{idBien}
*/
export const demandesLocataireService = {
  // Demandes de location du locataire connecté.
  getDemandes: (params) => api.get('/demandes/mes-demandes', { params }),

  // Le locataire soumet une demande de location pour un bien.
  creer: (idBien) => api.post(`/demandes/bien/${idBien}`),
}
