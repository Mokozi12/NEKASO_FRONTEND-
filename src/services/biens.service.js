import api from './api'

export const biensService = {
  /*
    Récupère tous les biens appartenant au gestionnaire connecté.
    Spring Boot identifie le gestionnaire grâce au token JWT.
    Réponse : tableau de biens
  */
  getMesBiens: () => api.get('/biens/gestionnaire'),

  /*
    Crée un nouveau bien avec photo.
    
    Pourquoi multipart/form-data et pas JSON ?
    Parce qu'on envoie un fichier image (la photo du bien).
    JSON ne peut pas transporter des fichiers binaires.
    multipart/form-data est le format prévu pour les fichiers.
    
    formData est un objet FormData JavaScript :
    const formData = new FormData()
    formData.append('typeBien', 'APPARTEMENT')
    formData.append('adresse', 'Rue 10, Mermoz')
    formData.append('photo', fichierImage) ← le vrai fichier
  */
  creer: (formData) => api.post('/biens', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  /*
    Modifie un bien existant.
    id : l'identifiant du bien à modifier
    data : les nouvelles données
  */
  modifier: (id, data) => api.put(`/biens/${id}`, data),

  /*
    Archive un bien (le rend invisible dans le catalogue).
    On n'utilise pas DELETE car on veut garder l'historique.
    PATCH = modification partielle d'une ressource
  */
  archiver: (id) => api.patch(`/biens/${id}/archiver`)
}