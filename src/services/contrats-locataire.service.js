import api from './api'

/*
  contrat-bail-controller (côté locataire) — OPTION A : sans id, le backend
  identifie le locataire via le token JWT (sub).
  - GET  /api/contrats/mes-contrats   (page, size, sort)
*/
export const contratsLocataireService = {
  getContrats: (params) => api.get('/contrats/mes-contrats', { params }),
}
