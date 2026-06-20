import api from './api'
import { unwrapList } from '@/utils/apiResponse'
import { mapBien, mapBiens } from './mappers'

export const biensPublicsService = {
  async getAll(params = {}) {
    const res = await api.get('/biens/locataire/biens_disponibles', { params })
    return mapBiens(unwrapList(res))
  },

  async getById(id) {
    const liste = await this.getAll({ page: 0, size: 200 })
    return liste.find((b) => String(b.id) === String(id)) || null
  },

  async rechercher(params = {}) {
    return this.getAll(params)
  },

  mapBien,
}
