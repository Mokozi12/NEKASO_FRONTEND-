import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { paiementsService } from '@/services/paiements.service'
import { mockPaiements } from '@/services/mockData'

export const usePaiementsStore = defineStore('paiements', () => {

  const paiements  = ref([])
  const chargement = ref(false)
  const erreur     = ref(null)

  const payes    = computed(() => paiements.value.filter(p => p.statut === 'PAYE'))
  const enRetard = computed(() => paiements.value.filter(p => p.statut === 'EN_RETARD'))
  const totalMois = computed(() =>
    payes.value.reduce((total, p) => total + p.montant, 0)
  )

  async function charger() {
    chargement.value = true
    erreur.value = null
    try {
      // TODO : const res = await paiementsService.getListe()
      // paiements.value = res.data
      await new Promise(r => setTimeout(r, 400))
      paiements.value = mockPaiements
    } catch (e) {
      erreur.value = 'Impossible de charger les paiements.'
    } finally {
      chargement.value = false
    }
  }

  async function enregistrer(data) {
    // TODO : await paiementsService.enregistrer(data)
    await charger()
  }

  async function telechargerQuittance(id) {
    const res = await paiementsService.telechargerQuittance(id)
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const lien = document.createElement('a')
    lien.href = url
    lien.setAttribute('download', `quittance_${id}.pdf`)
    document.body.appendChild(lien)
    lien.click()
    lien.remove()
  }

  return { paiements, chargement, erreur, payes, enRetard, totalMois, charger, enregistrer, telechargerQuittance }
})
