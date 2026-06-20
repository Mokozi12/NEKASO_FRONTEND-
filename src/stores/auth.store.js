import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '@/services/storage'
import { parseJwt } from '@/utils/jwt'

function construireUser(payload) {
  const u = payload?.user || payload || {}
  const roles = u.roles || (u.role ? [u.role] : (payload?.roles || (payload?.role ? [payload.role] : [])))
  const role = roles[0] || 'LOCATAIRE'
  return {
    id: u.id ?? payload?.id ?? null,
    nom: u.nom || payload?.nom || '',
    prenom: u.prenom || payload?.prenom || '',
    telephone: u.telephone || payload?.telephone || '',
    role,
    roles,
    statut: u.statut ?? payload?.statut ?? 'ACTIF',
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getToken())
  const user = ref(getUser())

  if (token.value && !user.value) {
    const jwtPayload = parseJwt(token.value)
    if (jwtPayload && jwtPayload.sub) {
      user.value = {
        id: null,
        nom: '',
        prenom: '',
        telephone: jwtPayload.sub,
        role: 'LOCATAIRE',
        roles: ['LOCATAIRE'],
        statut: 'ACTIF'
      }
    }
  }

  const isLoading = ref(false)
  const error = ref(null)

  const pendingAction = ref(JSON.parse(localStorage.getItem('nekaso_pending_action') || 'null'))

  const utilisateurCourant = computed(() => user.value)
  const isAuthenticated = computed(() => !!token.value)
  const nomComplet = computed(() => {
    if (!user.value) return ''
    if (user.value.prenom || user.value.nom) {
      return `${user.value.prenom || ''} ${user.value.nom || ''}`.trim()
    }
    return user.value.telephone || ''
  })
  const isGestionnaire = computed(() => user.value?.role === 'GESTIONNAIRE')
  const userId = computed(() => user.value?.id ?? null)

  async function login(telephone, motDePasse) {
    isLoading.value = true
    error.value = null

    try {
      const body = await authService.login(telephone, motDePasse)
      const payload = body?.message ?? body

      const newToken = payload.token
      const newUser = construireUser(payload)

      token.value = newToken
      user.value = newUser

      setToken(newToken)
      setUser(newUser)

      return { success: true, user: newUser }
    } catch (err) {
      let errorMessage = "Une erreur inconnue s'est produite"

      if (err.response?.status === 401 || err.response?.status === 404) {
        errorMessage = 'Téléphone ou mot de passe incorrect'
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || 'Champs obligatoires manquants'
      } else if (err.response?.status === 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.'
      } else if (!err.response) {
        errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.'
      }

      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  async function register(nom, prenom, telephone, motDePasse) {
    isLoading.value = true
    error.value = null

    try {
      await authService.register({ telephone, motDePasse, prenom, nom })
      const body = await authService.login(telephone, motDePasse)
      const payload = body?.message ?? body
      const newToken = payload.token
      const newUser = construireUser(payload)

      token.value = newToken
      user.value = newUser
      setToken(newToken)
      setUser(newUser)

      return { success: true, user: newUser }
    } catch (err) {
      let errorMessage = "Erreur lors de l'inscription"
      const apiMsg = err.response?.data?.message
      if (typeof apiMsg === 'string') errorMessage = apiMsg
      else if (!err.response) errorMessage = 'Impossible de contacter le serveur.'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    error.value = null
    removeToken()
    removeUser()
    clearPendingAction()
  }

  function setPendingAction(action) {
    pendingAction.value = action
    localStorage.setItem('nekaso_pending_action', JSON.stringify(action))
  }

  function clearPendingAction() {
    pendingAction.value = null
    localStorage.removeItem('nekaso_pending_action')
  }

  return {
    token,
    user,
    utilisateurCourant,
    isAuthenticated,
    nomComplet,
    isGestionnaire,
    userId,
    isLoading,
    error,
    login,
    register,
    logout,
    pendingAction,
    setPendingAction,
    clearPendingAction,
  }
})
