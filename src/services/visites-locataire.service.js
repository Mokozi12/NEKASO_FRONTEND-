import api from './api'

export const visitesLocataireService = {
  getVisites: (params) => api.get('/visites/locataire/mes_demandes', { params }),

  demander: (idBien) => api.post(`/visites/locataire/bien/${idBien}`),
}
