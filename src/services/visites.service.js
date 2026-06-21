import api from './api'

/**
 * Service des demandes de visite (interface gestionnaire).
 * Renvoie la réponse Axios brute ; déballage/mapping dans le store.
 * Endpoints : demande-visite-controller.
 */
export const visitesService = {
  /**
   * Liste paginée des demandes de visite (vue gestionnaire).
   * GET /api/visites/gestionnaire/demande
   * @param {{ statut?: string, page?: number, size?: number }} [params]
   * @returns {Promise<import('axios').AxiosResponse>} PageResponse<DemandeVisiteDTOList>
   */
  getListe: (params) => api.get('/visites/gestionnaire/demande', { params }),

  /**
   * Change le statut d'une visite (générique).
   * PATCH /api/visites/gestionnaire/demande/{id}/statut/{statut}
   */
  changerStatut: (id, statut) =>
    api.patch(`/visites/gestionnaire/demande/${id}/statut/${statut}`),

  /** Refuse une demande de visite (→ REFUSEE). */
  refuser: (id) => api.patch(`/visites/gestionnaire/demande/${id}/statut/REFUSEE`),

  /**
   * Propose un créneau (date/heure) et affecte un agent → statut PROPOSEE.
   * POST /api/visites/gestionnaire/demande/{id}/proposer-creneau
   * @param {number|string} id Identifiant de la demande
   * @param {{ creneauVisite: string, IdAgent: number }} payload ProposerCreneauDTO (creneauVisite = "dd/MM/yyyy HH:mm")
   * @returns {Promise<import('axios').AxiosResponse>} CreationRequestResponse
   */
  proposerCreneau: (id, payload) =>
    api.post(`/visites/gestionnaire/demande/${id}/proposer-creneau`, payload),

  /**
   * Propose/génère le pré-contrat suite à une clôture AVEC_CONTRAT → statut TERMINEE.
   * POST /api/visites/gestionnaire/demande/{id}/proposer-precontrat
   * @param {number|string} id Identifiant de la demande
   * @param {object} payload PreContratRequestDTO { dateDebutPrevu, jourEcheancePaiement, conditions }
   * @returns {Promise<import('axios').AxiosResponse>} CreationRequestResponse
   */
  proposerPrecontrat: (id, payload) =>
    api.post(`/visites/gestionnaire/demande/${id}/proposer-precontrat`, payload),
}
