import api from './api'

export const biensService = {
  /**
   * GET /api/biens/gestionnaire
   * Récupère tous les biens du gestionnaire connecté.
   */
  getMesBiens: (params) => api.get('/biens/gestionnaire', { params }),

  /**
   * POST /api/biens
   * Crée un nouveau bien avec photos (multipart/form-data).
   * @param {FormData} formData - Les données du bien + photos[]
   */
  creer: (formData) => api.post('/biens/create', formData),

  /**
   * PUT /api/biens/{id}
   * Modifie un bien existant (multipart/form-data pour les nouvelles photos).
   * @param {number} id - Identifiant du bien
   * @param {FormData} formData - Champs à modifier + nouvelles photos
   */
  modifier: (id, formData) => {
    // Le backend n'accepte pas multipart pour PUT → on convertit en JSON
    const json = {}
    if (formData instanceof FormData) {
      formData.forEach((value, key) => {
        if (!(value instanceof File)) json[key] = value
      })
    } else {
      Object.assign(json, formData)
    }
    return api.put(`/biens/${id}`, json)
  },

  /**
   * PATCH /api/biens/{id}/archiver
   * Archive un bien (le rend invisible, l'historique est conservé).
   * @param {number} id - Identifiant du bien
   */
  archiver: (id) => api.patch(`/biens/${id}/archiver`),

  /**
   * DELETE /api/biens/{id}/photos/{photoId}
   * Supprime une photo spécifique d'un bien.
   * @param {number} bienId - Identifiant du bien
   * @param {number} photoId - Identifiant de la photo
   */
  supprimerPhoto: (bienId, photoId) => api.delete(`/biens/${bienId}/photos/${photoId}`),
}
