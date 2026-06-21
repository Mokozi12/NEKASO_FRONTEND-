import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { agentsService } from '@/services/agents.service'
import { unwrap, pageMeta } from '@/utils/apiResponse'

export const useAgentsStore = defineStore('agents', () => {
  const agents = ref([])
  const chargement = ref(false)
  let seq = 1

  const creneauxDisponibles = computed(() => [])

  function agentsDisponibles() {
    return agents.value
  }

  async function charger(params = { page: 0, size: 100 }) {
    chargement.value = true
    try {
      const res = await agentsService.getListe(params)
      const liste = pageMeta(res).items
      const sessionAvecId = agents.value.filter((a) => a.idAgent != null)
      const telsConnus = new Set(sessionAvecId.map((a) => a.telephone))
      const depuisServeur = liste
        .filter((a) => !telsConnus.has(a.telephone))
        .map((a, i) => {
          const vraiId = a.idAgentImmobilier ?? a.id
          return {
            id: vraiId ?? `srv-${i}`,
            idAgent: vraiId ?? null,
            nom: a.nom,
            prenom: a.prenom,
          telephone: a.telephone,
          disponibilites: [],
        }
      })
      agents.value = [...sessionAvecId, ...depuisServeur]
    } catch (e) {
      console.error('charger agents:', e?.response?.status, e?.response?.data)
    } finally {
      chargement.value = false
    }
  }

  async function creerAgent(data) {
    const payload = { nom: data.nom, prenom: data.prenom, telephone: data.telephone }
    chargement.value = true
    try {
      const res = await agentsService.creer(payload)
      const cree = unwrap(res) || {}
      const disponibilites = (data.disponibilites || [])
        .filter((c) => c.date && c.heure)
        .map((c, i) => ({ id: `c-${seq}-${i}`, date: c.date, heure: c.heure, reserve: false }))
      
      const vraiId = cree.idAgentImmobilier ?? cree.id
      agents.value.unshift({
        id: vraiId ?? `loc-${seq}`,
        idAgent: vraiId ?? null,
        nom: cree.nom ?? payload.nom,
        prenom: cree.prenom ?? payload.prenom,
        telephone: cree.telephone ?? payload.telephone,
        disponibilites,
      })
      seq++
      return cree
    } finally {
      chargement.value = false
    }
  }

  function ajouterCreneau(agentId, creneau) {
    const a = agents.value.find((x) => x.id === agentId)
    if (!a) return
    a.disponibilites = a.disponibilites || []
    a.disponibilites.push({ id: `c-${seq++}`, date: creneau.date, heure: creneau.heure, reserve: false })
  }

  async function reserverCreneau() {}
  async function libererCreneau() {}

  return {
    agents,
    chargement,
    creneauxDisponibles,
    agentsDisponibles,
    charger,
    creerAgent,
    ajouterCreneau,
    reserverCreneau,
    libererCreneau,
  }
})
