import api from './api'

export default {
  // Récupérer le profil du gestionnaire connecté
  getProfile() {
    return api.get('/gestionnaires/profile')
  },

  // Modifier le profil du gestionnaire
  updateProfile(data) {
    return api.put('/gestionnaires/profile', data)
  },

  // Changer le mot de passe
  changePassword(data) {
    return api.patch('/gestionnaires/change-password', data)
  }
}
