import api from './api'

export const visitesLocataireService = {
  // GET /api/visites/mes_demandes/{idLocataire}
  async getVisites(idLocataire, params) {
    const res = await api.get(`/visites/mes_demandes/${idLocataire}`, { params })
    return res.data
  },

  // GET /api/biens/locataire/biens_disponibles
  async getBiensDisponibles(params) {
    const res = await api.get('/biens/locataire/biens_disponibles', { params })
    return res.data
  },

  // POST /api/visites/locataire/{idLocataire}/bien/{idBien}
  async demander(idLocataire, idBien) {
    const res = await api.post(`/visites/locataire/${idLocataire}/bien/${idBien}`)
    return res.data
  },
}
