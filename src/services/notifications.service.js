import api from './api'

export const notificationsService = {
  getListe:   ()   => api.get('/notifications'),
  marquerLue: (id) => api.patch(`/notifications/${id}/lire`),
  toutLire:   ()   => api.patch('/notifications/tout-lire')
}
