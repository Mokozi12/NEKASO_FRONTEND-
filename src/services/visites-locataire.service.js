import api from './api'

/*
  demande-visite-controller (côté locataire) — OPTION A : sans id, le backend
  identifie le locataire via le token JWT (sub).
  - POST  /api/visites/bien/{idBien}
  - GET   /api/visites/mes_demandes          (statut, page, size)
*/
export const visitesLocataireService = {
  // Demandes de visite du locataire connecté.
  getVisites: (params) => api.get('/visites/mes_demandes', { params }),

  // Le locataire demande une visite pour un bien.
  demander: (idBien) => api.post(`/visites/bien/${idBien}`),
}
