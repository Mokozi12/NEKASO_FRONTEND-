/*
  Ce fichier configure Axios, la librairie qui fait les requêtes HTTP.
  Pense à Axios comme à un messager entre Vue.js et Spring Boot.
  Ce fichier configure ce messager une fois pour toutes.
*/
import axios from 'axios'

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
    'Content-Type': 'application/json'
  }
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
    // On lit le token depuis localStorage
    const token = localStorage.getItem('nekaso_token')
    
    if (token) {
      // On ajoute le token dans le header Authorization
      // Spring Boot lira ce header pour identifier l'utilisateur
      // "Bearer" est un standard : c'est le type de token
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // IMPORTANT : toujours retourner config, sinon la requête ne part pas
    return config
  },
  (error) => {
    // Si l'intercepteur lui-même a une erreur, on la propage
    return Promise.reject(error)
  }
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
    if (error.response?.status === 401 && localStorage.getItem('nekaso_token')) {
      localStorage.removeItem('nekaso_token')
      localStorage.removeItem('nekaso_user')
    }
    
    // Erreur 403 = Authentifié mais accès interdit (mauvais rôle)
    // Par exemple un locataire qui essaierait d'accéder au dashboard gestionnaire
    if (error.response?.status === 403) {
      console.error('Accès refusé : vous n\'avez pas les droits nécessaires')
    }
    
    // Erreur réseau = Spring Boot est éteint ou injoignable
    if (!error.response) {
      console.error('Impossible de contacter le serveur. Vérifiez votre connexion.')
    }
    
    // IMPORTANT : toujours rejeter l'erreur pour qu'elle remonte
    // jusqu'au try/catch dans les stores ou les composants
    return Promise.reject(error)
  }
)

export default api