import api from './api'

export const contratsLocataireService = {
  getContrats: (params) => api.get('/contrats/mes-contrats', { params }),
}
