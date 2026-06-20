import api from './api'

export const contratsService = {
  creer: (preContratId) => api.post('/contrats/gestionnaire/creer', { preContratId }),

  getParLocataire: (params) =>
    api.get('/contrats/locataire/mes-contrats', { params }),
  getParGestionnaire: (params) =>
    api.get('/contrats/gestionnaire/mes-contrats', { params }),
}

