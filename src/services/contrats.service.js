import api from './api'

export const contratsService = {
  getListe: () => api.get('/contrats/gestionnaire'),

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