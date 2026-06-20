import api from './api'

export const biensService = {
  getGestionnaireBiens: (params) => api.get('/biens/gestionnaire', { params }),

  getMesBiens: (params) => api.get('/biens/gestionnaire/mes-biens', { params }),

  getDisponibles: (params) => api.get('/biens/locataire/biens_disponibles', { params }),

  test: () => api.get('/biens/test'),

  creer: (formData) => api.post('/biens/gestionnaire/create', formData),

  modifier: (id, formData) => api.patch(`/biens/gestionnaire/update-bien/${id}`, formData),
}

