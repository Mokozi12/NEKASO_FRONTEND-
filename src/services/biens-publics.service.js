/**
 * Service pour les biens publics (catalogue, landing, détail).
 * Utilise les données mock en attendant le backend Spring Boot.
 */
import api from './api'

export const biensPublicsService = {
  /**
   * Récupère la liste publique des biens (le backend gère pagination/filtre).
   * @param {Object} params - options de requête (page, size, type, quartier, prixMax...)
   */
  async getAll(params = {}) {
    try {
      const res = await api.get('/biens/locataire/biens_disponibles', { params })
      const data = res.data
      return Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
    } catch (e) {
      throw e
    }
  },

  /**
   * Récupère un bien par son ID.
   */
  async getById(id) {
    try {
      const res = await api.get(`/biens/${id}`)
      return res.data
    } catch (e) {
      throw e
    }
  },

  /**
   * Recherche de biens (déprécié côté client, utiliser getAll avec params).
   */
  async rechercher(params = {}) {
    return this.getAll(params)
  },
}
