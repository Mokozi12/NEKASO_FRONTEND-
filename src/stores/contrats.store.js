import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { contratsService } from '@/services/contrats.service'
import { mockContrats } from '@/services/mockData'

export const useContratsStore = defineStore('contrats', () => {

  const contrats   = ref([])
  const chargement = ref(false)
  const erreur     = ref(null)

  const enCours  = computed(() => contrats.value.filter(c => c.statut === 'EN_COURS'))
  const expires  = computed(() => contrats.value.filter(c => c.statut === 'EXPIRE'))
  const archives = computed(() => contrats.value.filter(c => c.statut === 'ARCHIVE'))

  async function charger() {
    chargement.value = true
    erreur.value = null
    try {
      // TODO : const res = await contratsService.getListe()
      // contrats.value = res.data
      await new Promise(r => setTimeout(r, 400))
      contrats.value = mockContrats
    } catch (e) {
      erreur.value = 'Impossible de charger les contrats.'
    } finally {
      chargement.value = false
    }
  }

  async function telechargerPDF(id) {
    const res = await contratsService.telechargerPDF(id)
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const lien = document.createElement('a')
    lien.href = url
    lien.setAttribute('download', `contrat_${id}.pdf`)
    document.body.appendChild(lien)
    lien.click()
    lien.remove()
  }

  return { contrats, chargement, erreur, enCours, expires, archives, charger, telechargerPDF }
})
