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

      </div>
    </div>
    <div v-else class="carte vide">Aucun agent enregistré pour le moment.</div>

    <Pagination v-model="page" :total-pages="totalPages" />

    <ModalAgent v-if="modalOuverte" @close="modalOuverte = false" @creer="creerAgent" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watchEffect, onMounted } from 'vue'
import { useAgentsStore } from '@/stores/agents.store'
import { useNotification } from '@/composables/useNotification'
import { useFormat } from '@/composables/useFormat'
import { usePagination } from '@/composables/usePagination'
import { extraireMessageErreur } from '@/utils/apiResponse'
import ModalAgent from '@/components/agents/ModalAgent.vue'
import Pagination from '@/components/common/Pagination.vue'

const agentsStore = useAgentsStore()
const { succes, erreur } = useNotification()
const { formatDate } = useFormat()

const modalOuverte = ref(false)

onMounted(() => agentsStore.charger())

const { page, totalPages, itemsPage: agentsPage } = usePagination(
  computed(() => agentsStore.agents),
  6,
)

function initiales(a) {
  return `${a.prenom?.[0] || ''}${a.nom?.[0] || ''}`.toUpperCase()
}

async function creerAgent(data) {
  try {
    await agentsStore.creerAgent(data)
    succes('Agent enregistré.')
    modalOuverte.value = false
  } catch (e) {
    erreur(extraireMessageErreur(e, "Impossible d'enregistrer l'agent"))
  }
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

.vide {
  text-align: center;
  color: #94a3b8;
  padding: 40px;
}
</style>
