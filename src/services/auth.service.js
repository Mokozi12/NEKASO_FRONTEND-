import api from './api'

// ✅ Le contrat API attend { telephone, motDePasse }
export const authService = {
  login: (data) => api.post('/auth/login', data)
}
