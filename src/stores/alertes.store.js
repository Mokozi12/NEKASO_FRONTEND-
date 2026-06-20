import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAlertesStore = defineStore('alertes', () => {
  const alertes = ref([])

  const pourGestionnaire = computed(() => alertes.value)
  const nouvelles = computed(() => alertes.value)
  const enReparation = computed(() => alertes.value)
  const mesAlertes = computed(() => alertes.value)

  async function creerAlerte(payload) {
    console.warn("creerAlerte: Endpoint backend manquant", payload)
  }

  async function mettreEnReparation(id, note = '') {
    console.warn("mettreEnReparation: Endpoint backend manquant")
  }

  function ajouterSuivi(id, message) {
    console.warn("ajouterSuivi: Endpoint backend manquant")
  }

  function desactiverBien(bienId) {
    console.warn("desactiverBien: Endpoint backend manquant")
  }

  async function marquerResolue(id, remettreDispo = true) {
    console.warn("marquerResolue: Endpoint backend manquant")
  }

  return {
    alertes,
    pourGestionnaire,
    nouvelles,
    enReparation,
    mesAlertes,
    creerAlerte,
    mettreEnReparation,
    ajouterSuivi,
    desactiverBien,
    marquerResolue,
  }
})
