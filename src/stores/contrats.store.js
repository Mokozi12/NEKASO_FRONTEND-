import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { contratsService } from '@/services/contrats.service'
import { mockContrats, mockCandidats, mockBiens } from '@/services/mockData'

export const useContratsStore = defineStore('contrats', () => {

  /* ───── État principal ───── */
  const contrats   = ref([])
  const chargement = ref(false)
  const erreur     = ref(null)

  /* ───── Candidats (visites confirmées) et biens disponibles ───── */
  const candidats       = ref([])
  const biensDisponibles = ref([])

  /* ───── Filtres par statut ───── */
  const enCours  = computed(() => contrats.value.filter(c => c.statut === 'EN_COURS'))
  const expires  = computed(() => contrats.value.filter(c => c.statut === 'EXPIRE'))
  const archives = computed(() => contrats.value.filter(c => c.statut === 'ARCHIVE'))

  /* ───── Helpers pour le tableau ───── */
  /**
   * Calcule la durée du contrat en mois à partir des dates début/fin
   */
  function calculerDureeMois(dateDebut, dateFin) {
    if (!dateDebut || !dateFin) return null
    const d = new Date(dateDebut)
    const f = new Date(dateFin)
    const mois = (f.getFullYear() - d.getFullYear()) * 12 + (f.getMonth() - d.getMonth())
    return mois > 0 ? mois : 1
  }

  /* ───── Chargement des contrats ───── */
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

  /* ───── Chargement des candidats pour le wizard ───── */
  async function chargerCandidats() {
    try {
      // TODO : const res = await contratsService.getCandidats()
      // candidats.value = res.data
      await new Promise(r => setTimeout(r, 200))
      candidats.value = mockCandidats
    } catch (e) {
      console.error('Erreur chargement candidats:', e)
    }
  }

  /* ───── Chargement des biens disponibles ───── */
  async function chargerBiens() {
    try {
      // TODO : const res = await biensService.getMesBiens()
      await new Promise(r => setTimeout(r, 200))
      biensDisponibles.value = mockBiens
    } catch (e) {
      console.error('Erreur chargement biens:', e)
    }
  }

  /* ───── Création d'un nouveau contrat ───── */
  async function creer(contratData) {
    try {
      // TODO : await contratsService.creer(contratData)
      const nouveauContrat = {
        id: contrats.value.length + 1,
        ...contratData,
        statut: 'EN_COURS',
        dateSignature: new Date().toISOString().split('T')[0],
        cheminPDF: `/contrats/contrat_${contrats.value.length + 1}.pdf`
      }
      contrats.value.push(nouveauContrat)
      return nouveauContrat
    } catch (e) {
      throw new Error('Impossible de créer le contrat.')
    }
  }

  /* ───── Téléchargement PDF ───── */
  async function telechargerPDF(id) {
    try {
      const res = await contratsService.telechargerPDF(id)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const lien = document.createElement('a')
      lien.href = url
      lien.setAttribute('download', `contrat_${id}.pdf`)
      document.body.appendChild(lien)
      lien.click()
      lien.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Erreur téléchargement PDF:', e)
      // En mode mock, on simule juste un clic
      console.log(`Téléchargement simulé du contrat #${id}`)
    }
  }

  return {
    contrats, chargement, erreur,
    candidats, biensDisponibles,
    enCours, expires, archives,
    calculerDureeMois,
    charger, chargerCandidats, chargerBiens, creer, telechargerPDF
  }
})
