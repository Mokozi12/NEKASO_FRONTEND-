import api from './api'

export const contratsService = {
  getListe: () => api.get('/contrats/gestionnaire'),

  /*
    Récupère la liste des candidats (visites confirmées)
    pour le wizard de création de contrat.
  */
  getCandidats: () => api.get('/visites/confirmees'),

  /*
    Crée un nouveau contrat de bail.
    Le backend génère automatiquement le PDF.
  */
  creer: (data) => api.post('/contrats', data),

  /*
    Télécharger un contrat PDF.
    
    responseType: 'blob' est OBLIGATOIRE pour télécharger un fichier.
    Sans ça, Axios essaierait d'interpréter le PDF comme du texte JSON,
    et le fichier serait corrompu.
    
    'blob' signifie "Binary Large Object" : des données binaires brutes.
  */
  telechargerPDF: (id) => api.get(`/contrats/${id}/pdf`, {
    responseType: 'blob'
  })
}