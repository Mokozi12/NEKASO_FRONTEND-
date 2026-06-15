import api from './api'

// Endpoints réels disponibles côté backend :
// POST   /api/demandes/locataire/{id_Locataire}/bien/{id_Bien}
// GET    /api/demandes/locataire/{id_Locataire}
// PATCH  /api/demandes/demande/{id_Demande}/accepter
// PATCH  /api/demandes/demande/{id_Demande}/refuser
// PATCH  /api/demandes/demande/{id_Demande}/annuler
// ⚠️  GET /api/demandes/gestionnaire n'existe pas → la vue gestionnaire utilise des données mock

export const demandesLocationService = {
  valider: (id) => api.patch(`/demandes/demande/${id}/accepter`),
  refuser: (id) => api.patch(`/demandes/demande/${id}/refuser`),
  annuler: (id) => api.patch(`/demandes/demande/${id}/annuler`),
  creer: (idLocataire, idBien) => api.post(`/demandes/locataire/${idLocataire}/bien/${idBien}`),
}
