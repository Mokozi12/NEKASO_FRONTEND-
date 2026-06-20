import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '@/services/storage'

/*
  Construit l'objet utilisateur à partir de la charge utile renvoyée par le
  backend au login : { token, nom, prenom, telephone, roles: ["LOCATAIRE"|"GESTIONNAIRE"] }

  OPTION A : les endpoints locataire n'utilisent plus l'id dans l'URL — le backend
  identifie l'utilisateur via le sub du JWT. Le champ `id` est conservé si le
  backend l'envoie, mais il n'est plus nécessaire pour les appels API.
*/
function construireUser(payload) {
  const roles = payload.roles || (payload.role ? [payload.role] : [])
  const role = roles[0] || 'LOCATAIRE'
  return {
    id: payload.id ?? null,
    nom: payload.nom,
    prenom: payload.prenom,
    telephone: payload.telephone,
    role,
    roles,
    statut: payload.statut ?? 'ACTIF',
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getToken())
  const user = ref(getUser())
  const isLoading = ref(false)
  const error = ref(null)

  // Contexte pour la reprise d'action post-authentification (ex: visite ou location)
  const pendingAction = ref(JSON.parse(localStorage.getItem('nekaso_pending_action') || 'null'))

  const utilisateurCourant = computed(() => user.value)
  const isAuthenticated = computed(() => !!token.value)
  const nomComplet = computed(() => (user.value ? `${user.value.prenom} ${user.value.nom}` : ''))
  const isGestionnaire = computed(() => user.value?.role === 'GESTIONNAIRE')
  const userId = computed(() => user.value?.id ?? null)

  /**
   * Connecter un gestionnaire avec son téléphone et mot de passe.
   * Appelle le backend NEKASO via authService.
   *
   * @param {string} telephone - Numéro de téléphone (ex: "771234567")
   * @param {string} motDePasse - Mot de passe
   *
   * Selon le contrat API :
   * - Réponse 200 : stocke le token et les infos utilisateur
   * - Réponse 401 : authentification échouée
   * - Réponse 400 : champs obligatoires manquants
   */
  async function login(telephone, motDePasse) {
    isLoading.value = true
    error.value = null

    try {
      // Appel au backend NEKASO. La charge utile est dans `message`.
      const body = await authService.login(telephone, motDePasse)
      const payload = body?.message ?? body

      const newToken = payload.token
      const newUser = construireUser(payload)

      // Stockage en mémoire (ref Pinia)
      token.value = newToken
      user.value = newUser

      // Stockage persistant via helper (utilise sessionStorage par défaut)
      setToken(newToken)
      setUser(newUser)

      return { success: true, user: newUser }
    } catch (err) {
      // Gestion des erreurs selon le contrat API
      let errorMessage = "Une erreur inconnue s'est produite"

      // ⚠️ Le backend renvoie 404 (et non 401) pour des identifiants incorrects.
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

  /**
   * Inscription d'un nouveau locataire.
   */
  async function register(nom, prenom, telephone, motDePasse) {
    isLoading.value = true
    error.value = null

    try {
      // 1) Inscription (le backend ne renvoie PAS de token ici).
      await authService.register({ telephone, motDePasse, prenom, nom })
      // 2) Connexion automatique pour récupérer le token.
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

  /**
   * Déconnecter l'utilisateur actuel.
   * Supprime le token et les infos utilisateur du localStorage et de la mémoire.
   */
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
