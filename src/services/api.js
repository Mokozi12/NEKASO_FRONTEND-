import axios from 'axios'
import { getToken, removeToken, removeUser } from './storage'
import { isExpired } from '@/utils/jwt'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    const token = getToken() || import.meta.env.VITE_DEV_TOKEN

    if (token) {
      if (isExpired(token)) {
        removeToken()
        removeUser()
        try {
          window.location.href = '/login'
        } catch (e) {}
        return Promise.reject(new Error('Token expiré'))
      }

      config.headers.Authorization = `Bearer ${token}`
      config.headers['X-Requested-With'] = 'XMLHttpRequest'
      config.headers['Cache-Control'] = 'no-store'
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401 && getToken()) {
      removeToken()
      removeUser()
      try {
        window.location.href = '/login'
      } catch (e) {}
    }

    if (error.response?.status === 403) {
      console.error("Accès refusé : vous n'avez pas les droits nécessaires")
    }

    if (!error.response) {
      console.error('Impossible de contacter le serveur. Vérifiez votre connexion.')
    }

    return Promise.reject(error)
  },
)

export default api
