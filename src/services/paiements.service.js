import api from './api'

export const paiementsService = {
  getListe:    ()     => api.get('/paiements/gestionnaire'),
  enregistrer: (data) => api.post('/paiements', data),

  telechargerQuittance: (id) => api.get(`/paiements/${id}/quittance`, {
    responseType: 'blob'
  })
}