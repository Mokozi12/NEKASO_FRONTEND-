import api from './api'

/**
 * Service des demandes de visite cote locataire.
 * Les stores gardent la responsabilite du deballage et du mapping.
 */
export const visitesLocataireService = {
  /**
   * GET /api/visites/locataire/mes_demandes
   * @param {{ statut?: string, page?: number, size?: number }} [params]
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  getVisites: (params) => api.get('/visites/locataire/mes_demandes', { params }),

  /**
   * POST /api/visites/locataire/bien/{idBien}
   * @param {number|string} idBien
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  demander: (idBien) => api.post(`/visites/locataire/bien/${idBien}`),

  /**
   * POST /api/visites/locataire/demande/{idDemande}/accepter-creneau
   * @param {number|string} idDemande
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  accepterCreneau: (idDemande) =>
    api.post(`/visites/locataire/demande/${idDemande}/accepter-creneau`),

  /**
   * PATCH /api/visites/locataire/demande/{idDemande}/cloturer?choix=...
   * Le locataire transmet uniquement son choix de suite. Les conditions du
   * pre-contrat sont saisies ensuite par le gestionnaire.
   * @param {number|string} idDemande
   * @param {'AVEC_CONTRAT'|'SANS_CONTRAT'} choix
   * @param {object} [payload]
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  cloturer: (idDemande, choix, payload = {}) =>
    api.patch(`/visites/locataire/demande/${idDemande}/cloturer`, payload, { params: { choix } }),
}
