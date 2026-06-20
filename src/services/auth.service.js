import api from './api'

/*
  SERVICE D'AUTHENTIFICATION
  
  Ce service gère la communication avec les endpoints /auth
  du backend Spring Boot NEKASO.
  
  Contrat API :
  - POST /api/auth/login
  - Authentification requise : NON
  - Réponse 200 : { token, user: { id, nom, prenom, role, telephone, statut, dateCreation } }
  - Réponse 401 : { message: "Téléphone ou mot de passe incorrect" }
  - Réponse 400 : { message: "Les champs téléphone et motDePasse sont obligatoires" }
*/

export const authService = {
  /**
   * Connecter un gestionnaire avec son téléphone et mot de passe.
   *
   * @param {string} telephone - Numéro de téléphone du gestionnaire (ex: "771234567")
   * @param {string} motDePasse - Mot de passe du gestionnaire
   *
   * @returns {Promise<Object>} Réponse du serveur contenant le token et les infos utilisateur
   *   - token: string (JWT token à stocker)
   *   - user: Object (id, nom, prenom, role, telephone, statut, dateCreation)
   *
   * @throws {Error} Erreur 400 si champs manquants
   * @throws {Error} Erreur 401 si identifiants incorrects
   * @throws {Error} Erreur réseau si serveur injoignable
   */
  login: (telephone, motDePasse) => {
    // Validation minimale côté client
    if (!telephone || !motDePasse) {
      return Promise.reject(new Error('Le téléphone et le mot de passe sont obligatoires'))
    }

    // Nettoyage du numéro : on retire tous les espaces pour correspondre au format backend (ex: "771234567")
    const telClean = telephone.replace(/\s+/g, '')

    // Appel API au backend — POST /api/v1/auth/login
    return api
      .post('/v1/auth/login', {
        telephone: telClean,
        motDePasse,
      })
      .then((response) => response.data)
  },

  /**
   * Inscription d'un nouveau locataire — POST /api/v1/auth/register
   * Body attendu : { telephone, motDePasse, prenom, nom }
   */
  register: ({ telephone, motDePasse, prenom, nom }) => {
    if (!telephone || !motDePasse || !prenom || !nom) {
      return Promise.reject(new Error('Tous les champs sont obligatoires'))
    }

    // Nettoyage du numéro
    const telClean = telephone.replace(/\s+/g, '')

    return api
      .post('/v1/auth/register', { telephone: telClean, motDePasse, prenom, nom })
      .then((response) => response.data)
  },
}
