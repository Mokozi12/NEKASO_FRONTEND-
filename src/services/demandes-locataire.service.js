import api from './api'

export const demandesLocataireService = {
  // GET /api/demandes/locataire/{id}?statut=EN_ATTENTE
  async getDemandes(idLocataire, params) {
    const res = await api.get(`/demandes/locataire/${idLocataire}`, { params })
    return res.data
  },

  // POST /api/demandes/locataire/{idLocataire}/bien/{idBien}
  async creer(idLocataire, idBien) {
    const res = await api.post(`/demandes/locataire/${idLocataire}/bien/${idBien}`)
    return res.data
  },
}
