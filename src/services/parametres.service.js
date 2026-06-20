import api from './api'

export default {
  getProfile() {
    return api.get('/gestionnaires/profile')
  },

  updateProfile(data) {
    return api.put('/gestionnaires/profile', data)
  },

  changePassword(data) {
    return api.patch('/gestionnaires/change-password', data)
  }
}
