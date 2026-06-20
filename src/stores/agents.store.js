import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAgentsStore = defineStore('agents', () => {
  const agents = ref([])

  const creneauxDisponibles = computed(() => [])

  function agentsDisponibles(date, heure) {
    return []
  }

  async function reserverCreneau(agentId, date, heure) {
    console.warn("reserverCreneau: Endpoint backend manquant")
  }

  async function libererCreneau(agentId, date, heure) {
    console.warn("libererCreneau: Endpoint backend manquant")
  }

  return {
    agents,
    creneauxDisponibles,
    agentsDisponibles,
    reserverCreneau,
    libererCreneau,
  }
})
