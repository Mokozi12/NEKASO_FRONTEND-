import api from './api'

/*
  bien-immobilier-controller
  - GET    /api/biens/gestionnaire                         (statut, type, page, size)
  - GET    /api/biens/{gestionnaireId}                     (page, size)
  - GET    /api/biens/locataire/biens_disponibles          (page, size)
  - POST   /api/biens/create                               (multipart/form-data)
  - PATCH  /api/biens/gestionnaire/update-bien/{id}        (multipart/form-data)
*/
export const biensService = {
  // Biens du gestionnaire connecté (filtrables par statut/type).
  getMesBiens: (params) => api.get('/biens/gestionnaire', { params }),

  // Biens d'un gestionnaire donné par son id.
  getParGestionnaire: (gestionnaireId, params) =>
    api.get(`/biens/${gestionnaireId}`, { params }),

  // Catalogue public des biens disponibles (côté locataire).
  getDisponibles: (params) => api.get('/biens/locataire/biens_disponibles', { params }),

  // Création d'un bien (FormData : champs + photos[]).
  creer: (formData) => api.post('/biens/create', formData),

  // Mise à jour d'un bien (FormData : champs + nouvelles photos).
  modifier: (id, formData) => api.patch(`/biens/gestionnaire/update-bien/${id}`, formData),
}
