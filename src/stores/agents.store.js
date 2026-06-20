import { defineStore } from 'pinia'
import { computed } from 'vue'
import { db, uid, delai, SESSION, nomComplet } from '@/mocks/db'

/*
  Store des AGENTS de visite (§3).
  Un agent est un membre de l'agence chargé d'effectuer les visites.
  Il possède des créneaux de disponibilité discrets (date + heure).

  Au moment de valider une visite, le gestionnaire :
    1. consulte les créneaux disponibles (croisement des dispos des agents),
    2. affecte un agent disponible sur le créneau choisi.
*/
export const useAgentsStore = defineStore('agents', () => {
  const agents = computed(() =>
    db.agents.filter((a) => a.gestionnaireId === SESSION.gestionnaireId),
  )

  /* Tous les créneaux libres, dédupliqués par (date, heure),
     avec la liste des agents disponibles pour chacun. */
  const creneauxDisponibles = computed(() => {
    const map = new Map()
    agents.value.forEach((agent) => {
      agent.disponibilites
        .filter((d) => !d.reserve)
        .forEach((d) => {
          const cle = `${d.date}__${d.heure}`
          if (!map.has(cle)) {
            map.set(cle, { date: d.date, heure: d.heure, agents: [] })
          }
          map.get(cle).agents.push({
            id: agent.id,
            nom: nomComplet(agent),
            telephone: agent.telephone,
            dispoId: d.id,
          })
        })
    })
    return Array.from(map.values()).sort((a, b) =>
      `${a.date} ${a.heure}`.localeCompare(`${b.date} ${b.heure}`),
    )
  })

  /* Agents disponibles pour un créneau (date + heure) donné. */
  function agentsDisponibles(date, heure) {
    return agents.value.filter((agent) =>
      agent.disponibilites.some((d) => d.date === date && d.heure === heure && !d.reserve),
    )
  }

  /* Enregistre un nouvel agent avec ses créneaux. */
  async function creerAgent({ nom, prenom, telephone, disponibilites = [] }) {
    await delai()
    const agent = {
      id: uid('agents'),
      gestionnaireId: SESSION.gestionnaireId,
      nom,
      prenom,
      telephone,
      disponibilites: disponibilites.map((d) => ({
        id: uid('disponibilites'),
        date: d.date,
        heure: d.heure,
        reserve: false,
      })),
    }
    db.agents.push(agent)
    return agent
  }

  /* Ajoute un créneau de disponibilité à un agent existant. */
  function ajouterCreneau(agentId, { date, heure }) {
    const agent = db.agents.find((a) => a.id === agentId)
    if (!agent) return
    agent.disponibilites.push({ id: uid('disponibilites'), date, heure, reserve: false })
  }

  /* Retire un créneau. */
  function retirerCreneau(agentId, dispoId) {
    const agent = db.agents.find((a) => a.id === agentId)
    if (!agent) return
    agent.disponibilites = agent.disponibilites.filter((d) => d.id !== dispoId)
  }

  /* Marque un créneau comme réservé (appelé lors de la validation d'une visite). */
  function reserverCreneau(agentId, date, heure) {
    const agent = db.agents.find((a) => a.id === agentId)
    if (!agent) return
    const dispo = agent.disponibilites.find((d) => d.date === date && d.heure === heure && !d.reserve)
    if (dispo) dispo.reserve = true
  }

  /* Libère un créneau (annulation de visite). */
  function libererCreneau(agentId, date, heure) {
    const agent = db.agents.find((a) => a.id === agentId)
    if (!agent) return
    const dispo = agent.disponibilites.find((d) => d.date === date && d.heure === heure && d.reserve)
    if (dispo) dispo.reserve = false
  }

  function getAgent(id) {
    return db.agents.find((a) => a.id === id) || null
  }

  return {
    agents,
    creneauxDisponibles,
    agentsDisponibles,
    creerAgent,
    ajouterCreneau,
    retirerCreneau,
    reserverCreneau,
    libererCreneau,
    getAgent,
  }
})
