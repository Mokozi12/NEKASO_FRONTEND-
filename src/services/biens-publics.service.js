/*
  Biens publics (catalogue locataire, détail).

  ⚠️ Le backend n'expose PAS d'endpoint « un bien par id » : `/api/biens/{id}`
  correspond en réalité à la liste des biens d'un GESTIONNAIRE. Pour le détail
  d'un bien on récupère donc la liste des disponibles et on filtre par id.
*/
import api from './api'
import { unwrapList } from '@/utils/apiResponse'
import { mapBien, mapBiens } from './mappers'

export const biensPublicsService = {
  // GET /api/biens/locataire/biens_disponibles (page, size)
  async getAll(params = {}) {
    const res = await api.get('/biens/locataire/biens_disponibles', { params })
    return mapBiens(unwrapList(res))
  },

  // Pas d'endpoint dédié : on filtre la liste des disponibles.
  async getById(id) {
    const liste = await this.getAll({ page: 0, size: 200 })
    return liste.find((b) => String(b.id) === String(id)) || null
  },

  async rechercher(params = {}) {
    return this.getAll(params)
  },

  mapBien,
}
