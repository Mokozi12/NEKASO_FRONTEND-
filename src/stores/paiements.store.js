import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { paiementsService } from '@/services/paiements.service'
import { mockPaiements } from '@/services/mockData'

export const usePaiementsStore = defineStore('paiements', () => {
  const paiements = ref([])
  const chargement = ref(false)
  const erreur = ref(null)

  const payes = computed(() => paiements.value.filter((p) => p.statut === 'PAYE'))
  const enRetard = computed(() => paiements.value.filter((p) => p.statut === 'EN_RETARD'))
  const totalMois = computed(() => payes.value.reduce((total, p) => total + p.montant, 0))

  async function charger() {
    chargement.value = true
    erreur.value = null
    try {
      const res = await paiementsService.getListe()
      // L'API retourne un tableau de paiements
      paiements.value = res.data
    } catch (e) {
      // Si le backend est indisponible, on bascule sur des données mock
      console.warn('Erreur chargement paiements, utilisation des données mock', e)
      paiements.value = mockPaiements
      erreur.value =
        'Impossible de charger les paiements depuis le serveur. Données locales affichées.'
    } finally {
      chargement.value = false
    }
  }

  async function enregistrer(data) {
    try {
      const res = await paiementsService.enregistrer(data)
      // Après enregistrement, on recharge la liste
      await charger()
      return res.data
    } catch (e) {
      // Propager l'erreur pour que le composant l'affiche
      throw e
    }
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

  return {
    paiements,
    chargement,
    erreur,
    payes,
    enRetard,
    totalMois,
    charger,
    enregistrer,
    telechargerQuittance,
  }
})
