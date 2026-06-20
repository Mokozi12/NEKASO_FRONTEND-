import api from './api'


export const authService = {
  login: (telephone, motDePasse) => {
    if (!telephone || !motDePasse) {
      return Promise.reject(new Error('Le téléphone et le mot de passe sont obligatoires'))
    }

    const telClean = telephone.replace(/\s+/g, '')

    return api
      .post('/v1/auth/login', {
        telephone: telClean,
        motDePasse,
      })
      .then((response) => response.data)
  },

  register: ({ telephone, motDePasse, prenom, nom }) => {
    if (!telephone || !motDePasse || !prenom || !nom) {
      return Promise.reject(new Error('Tous les champs sont obligatoires'))
    }

    const telClean = telephone.replace(/\s+/g, '')

    return api
      .post('/v1/auth/register', { telephone: telClean, motDePasse, prenom, nom })
      .then((response) => response.data)
  },
}
