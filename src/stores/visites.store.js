import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { visitesService } from '@/services/visites.service'
import { mockVisites } from '@/services/mockData'

export const useVisitesStore = defineStore('visites', () => {

  const visites    = ref([])
  const chargement = ref(false)
  const erreur     = ref(null)

  const enAttente  = computed(() => visites.value.filter(v => v.statut === 'EN_ATTENTE'))
  const confirmees = computed(() => visites.value.filter(v => v.statut === 'CONFIRMEE'))
  const refusees   = computed(() => visites.value.filter(v => v.statut === 'REFUSEE'))

  async function charger() {
    chargement.value = true
    erreur.value = null
    try {
      // TODO quand backend prêt :
      // const res = await visitesService.getListe()
      // visites.value = res.data
      await new Promise(r => setTimeout(r, 400))
      visites.value = mockVisites
    } catch (e) {
      erreur.value = 'Impossible de charger les visites.'
    } finally {
      chargement.value = false
    }
  }

  async function approuver(id) {
    // TODO : await visitesService.approuver(id)
    visites.value = visites.value.map(v =>
      v.id === id ? { ...v, statut: 'CONFIRMEE' } : v
    )
  }

  async function refuser(id) {
    // TODO : await visitesService.refuser(id)
    visites.value = visites.value.map(v =>
      v.id === id ? { ...v, statut: 'REFUSEE' } : v
    )
  }

  return { visites, chargement, erreur, enAttente, confirmees, refusees, charger, approuver, refuser }
})
