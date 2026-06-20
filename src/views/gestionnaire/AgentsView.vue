<template>
  <div class="agents-page">
    <div class="page-header page-header--flex">
      <div>
        <h1 class="page-title">Agents de visite</h1>
        <p class="page-subtitle">
          Les membres de l'agence chargés des visites et leurs créneaux de disponibilité.
        </p>
      </div>
      <button class="btn-nouvelle" @click="modalOuverte = true">+ Nouvel agent</button>
    </div>

    <div v-if="agentsStore.agents.length" class="agents-grid">
      <div v-for="agent in agentsPage" :key="agent.id" class="carte agent-carte">
        <div class="agent-head">
          <div class="avatar">{{ initiales(agent) }}</div>
          <div>
            <h3 class="agent-nom">{{ agent.prenom }} {{ agent.nom }}</h3>
            <p class="agent-tel">{{ agent.telephone }}</p>
          </div>
        </div>

        <h4 class="creneaux-titre">Disponibilités</h4>
        <div class="creneaux">
          <span
            v-for="d in agent.disponibilites"
            :key="d.id"
            class="creneau"
            :class="{ 'creneau--reserve': d.reserve }"
            :title="d.reserve ? 'Réservé pour une visite' : 'Disponible'"
          >
            {{ formatDate(d.date) }} · {{ d.heure }}
            <span v-if="d.reserve" class="puce">réservé</span>
          </span>
          <span v-if="agent.disponibilites.length === 0" class="aucun">Aucun créneau</span>
        </div>

        <form class="ajout-creneau" @submit.prevent="ajouterCreneau(agent.id)">
          <input v-model="nouveauCreneau[agent.id].date" type="date" />
          <input v-model="nouveauCreneau[agent.id].heure" type="time" />
          <button type="submit" class="btn-mini">Ajouter</button>
        </form>
      </div>
    </div>
    <div v-else class="carte vide">Aucun agent enregistré pour le moment.</div>

    <Pagination v-model="page" :total-pages="totalPages" />

    <ModalAgent v-if="modalOuverte" @close="modalOuverte = false" @creer="creerAgent" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watchEffect } from 'vue'
import { useAgentsStore } from '@/stores/agents.store'
import { useNotification } from '@/composables/useNotification'
import { useFormat } from '@/composables/useFormat'
import { usePagination } from '@/composables/usePagination'
import ModalAgent from '@/components/agents/ModalAgent.vue'
import Pagination from '@/components/common/Pagination.vue'

const agentsStore = useAgentsStore()
const { succes } = useNotification()
const { formatDate } = useFormat()

const modalOuverte = ref(false)

const { page, totalPages, itemsPage: agentsPage } = usePagination(
  computed(() => agentsStore.agents),
  6,
)

const nouveauCreneau = reactive({})
watchEffect(() => {
  agentsStore.agents.forEach((a) => {
    if (!nouveauCreneau[a.id]) nouveauCreneau[a.id] = { date: '', heure: '' }
  })
})

function initiales(a) {
  return `${a.prenom?.[0] || ''}${a.nom?.[0] || ''}`.toUpperCase()
}

async function creerAgent(data) {
  await agentsStore.creerAgent(data)
  succes('Agent enregistré.')
  modalOuverte.value = false
}

function ajouterCreneau(agentId) {
  const c = nouveauCreneau[agentId]
  if (!c.date || !c.heure) return
  agentsStore.ajouterCreneau(agentId, { date: c.date, heure: c.heure })
  c.date = ''
  c.heure = ''
  succes('Créneau ajouté.')
}
</script>

<style scoped>
.agents-page {
  padding: 0;
}
.page-header--flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.btn-nouvelle {
  background: #212d4d;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}
.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}
.agent-carte {
  padding: 20px;
}
.agent-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}
.avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #212d4d;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
}
.agent-nom {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}
.agent-tel {
  font-size: 13px;
  color: #64748b;
}
.creneaux-titre {
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}
.creneaux {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.creneau {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0fdf4;
  color: #16a34a;
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 12.5px;
  font-weight: 600;
}
.creneau--reserve {
  background: #f3f4f6;
  color: #9ca3af;
}
.puce {
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 10px;
  padding: 1px 6px;
  font-size: 10px;
}
.aucun {
  font-size: 13px;
  color: #94a3b8;
}
.ajout-creneau {
  display: flex;
  gap: 8px;
  border-top: 1px solid #f1f5f9;
  padding-top: 14px;
}
.ajout-creneau input {
  flex: 1;
  padding: 7px 9px;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  font-size: 13px;
  font-family: inherit;
}
.btn-mini {
  background: #f1f5f9;
  border: none;
  border-radius: 7px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
}
.vide {
  text-align: center;
  color: #94a3b8;
  padding: 40px;
}
</style>
