/*
  Ce fichier configure Axios, la librairie qui fait les requêtes HTTP.
  Pense à Axios comme à un messager entre Vue.js et Spring Boot.
  Ce fichier configure ce messager une fois pour toutes.
*/
import axios from 'axios'
import { getToken, removeToken, removeUser } from './storage'
import { isExpired } from '@/utils/jwt'

/*
  On crée une "instance" Axios avec une configuration de base.
  baseURL : toutes les requêtes commenceront par cette URL.
  Grâce à import.meta.env.VITE_API_URL, Axios lira automatiquement :
  - .env.development en développement : http://localhost:8080/api
  - .env.production en production : https://nekaso-backend.railway.app/api
  
  timeout : si Spring Boot ne répond pas en 10 secondes,
  Axios annule la requête et retourne une erreur.
  Sans timeout, l'application pourrait rester bloquée indéfiniment.
*/
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/*
  INTERCEPTEUR DE REQUÊTE
  
  Un intercepteur est comme un douanier qui inspecte chaque requête
  AVANT qu'elle parte vers Spring Boot.
  
  Ici, on ajoute automatiquement le token JWT dans chaque requête.
  Sans cet intercepteur, il faudrait ajouter le token manuellement
  dans chaque fonction de chaque service. On oublierait forcément.
  
  request.use prend une fonction qui reçoit la config de la requête,
  la modifie, et la retourne.
*/
api.interceptors.request.use(
  (config) => {
    // Laisse le navigateur définir Content-Type + boundary pour les FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    // Lecture centralisée du token (sessionStorage > localStorage > env dev)
    const token = getToken() || import.meta.env.VITE_DEV_TOKEN

    if (token) {
      // Si le token est expiré, on force la déconnexion et on empêche la requête
      if (isExpired(token)) {
        removeToken()
        removeUser()
        try {
          window.location.href = '/login'
        } catch (e) {}
        return Promise.reject(new Error('Token expiré'))
      }

      config.headers.Authorization = `Bearer ${token}`
      // Indique qu'il s'agit d'une requête XHR (utile côté serveur)
      config.headers['X-Requested-With'] = 'XMLHttpRequest'
      // Empêche la mise en cache côté navigateur pour les routes authentifiées
      config.headers['Cache-Control'] = 'no-store'
    }

    // IMPORTANT : toujours retourner config, sinon la requête ne part pas
    return config
  },
  (error) => {
    // Si l'intercepteur lui-même a une erreur, on la propage
    return Promise.reject(error)
  },
)

/*
  INTERCEPTEUR DE RÉPONSE
  
  Cet intercepteur inspecte chaque réponse de Spring Boot
  APRÈS qu'elle arrive, avant qu'elle soit traitée par le service.
  
  Il a deux fonctions : une pour les succès, une pour les erreurs.
*/
api.interceptors.response.use(
  // Fonction pour les réponses réussies (status 200-299)
  // On ne fait rien de spécial, on la retourne telle quelle
  (response) => response,

  // Fonction pour les erreurs (status 400+)
  (error) => {
    // Erreur 401 = Non authentifié (token absent, invalide ou expiré)
    // On déconnecte l'utilisateur et le redirige vers le login
    if (error.response?.status === 401 && getToken()) {
      // Nettoyage centralisé
      removeToken()
      removeUser()
      try {
        // redirige vers la page de connexion
        window.location.href = '/login'
      } catch (e) {
        // noop
      }
    }

    // Erreur 403 = Authentifié mais accès interdit (mauvais rôle)
    // Par exemple un locataire qui essaierait d'accéder au dashboard gestionnaire
    if (error.response?.status === 403) {
      console.error("Accès refusé : vous n'avez pas les droits nécessaires")
    }

    // Erreur réseau = Spring Boot est éteint ou injoignable
    if (!error.response) {
      console.error('Impossible de contacter le serveur. Vérifiez votre connexion.')
    }

    // IMPORTANT : toujours rejeter l'erreur pour qu'elle remonte
    // jusqu'au try/catch dans les stores ou les composants
    return Promise.reject(error)
  },
)

export default api
