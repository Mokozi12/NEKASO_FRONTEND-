import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import { mockUser } from '@/services/mockData'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('nekaso_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('nekaso_user') || 'null'))
  const isLoading = ref(false)
  const error = ref(null)

  const utilisateurCourant = computed(() => user.value ?? mockUser)
  const isAuthenticated = computed(() => !!token.value)
  const nomComplet = computed(() => (user.value ? `${user.value.prenom} ${user.value.nom}` : ''))
  const isGestionnaire = computed(() => user.value?.role === 'GESTIONNAIRE')

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
      // Appel au backend NEKASO
      const response = await authService.login(telephone, motDePasse)

      // Réponse 200 : extraction du token et user
      const { token: newToken, user: newUser } = response

      // Stockage en mémoire (ref Pinia)
      token.value = newToken
      user.value = newUser

      // Stockage persistant (localStorage)
      localStorage.setItem('nekaso_token', newToken)
      localStorage.setItem('nekaso_user', JSON.stringify(newUser))

      return { success: true, user: newUser }
    } catch (err) {
      // Gestion des erreurs selon le contrat API
      let errorMessage = "Une erreur inconnue s'est produite"

      if (err.response?.status === 401) {
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
   * Déconnecter l'utilisateur actuel.
   * Supprime le token et les infos utilisateur du localStorage et de la mémoire.
   */
  function logout() {
    token.value = null
    user.value = null
    error.value = null
    localStorage.removeItem('nekaso_token')
    localStorage.removeItem('nekaso_user')
  }

  return {
    token,
    user,
    utilisateurCourant,
    isAuthenticated,
    nomComplet,
    isGestionnaire,
    isLoading,
    error,
    login,
    logout,
  }
})
