<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <header class="modal-head">
        <div>
          <h3>Valider la visite</h3>
          <p class="sub">
            {{ nomClient }} — {{ bien?.intitule }}
          </p>
        </div>
        <button class="x" @click="$emit('close')" aria-label="Fermer">✕</button>
      </header>

      <div class="modal-body">
        <section>
          <h4 class="label">1. Date et heure de la visite</h4>
          <div class="dh-inputs">
            <input type="date" v-model="dateVisite" class="dh-input" />
            <input type="time" v-model="heureVisite" class="dh-input" />
          </div>
        </section>

        <section>
          <h4 class="label">2. Affecter un agent</h4>
          <div v-if="!agents.length" class="vide">
            Aucun agent sélectionnable. Créez un agent dans « Agents ».
          </div>
          <div v-else class="agent-search-container">
            <input 
              type="text" 
              v-model="rechercheAgent" 
              placeholder="Rechercher un agent (nom ou téléphone)..." 
              class="dh-input search-input"
            />
            
            <div class="agents-dropdown">
              <div
                v-for="a in agentsFiltres"
                :key="a.id"
                class="agent-option"
                :class="{ actif: agentChoisi === (a.idAgent || a.id) }"
                @click="agentChoisi = (a.idAgent || a.id)"
              >
                <div class="agent-info">
                  <span class="agent-nom">{{ a.prenom }} {{ a.nom }}</span>
                  <span class="agent-tel">{{ a.telephone }}</span>
                </div>
                <div v-if="agentChoisi === (a.idAgent || a.id)" class="check-icon">✓</div>
              </div>
              <div v-if="agentsFiltres.length === 0" class="agent-vide">
                Aucun agent ne correspond à votre recherche.
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer class="modal-foot">
        <button class="btn-secondaire" @click="$emit('close')">Annuler</button>
        <button class="btn-valider" :disabled="!peutValider" @click="confirmer">
          Valider la visite
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAgentsStore } from '@/stores/agents.store'
import { nomComplet } from '@/utils/constants'

const props = defineProps({
  visite: { type: Object, required: true },
})
const emit = defineEmits(['close', 'valider'])

const agentsStore = useAgentsStore()

onMounted(() => {
  if (agentsStore.agents.length === 0) {
    agentsStore.charger()
  }
})

const bien = computed(() => props.visite.bien || {})
const nomClient = computed(() => nomComplet(props.visite.client || props.visite.locataire))

const agents = computed(() => agentsStore.agents)
const rechercheAgent = ref('')

const agentsFiltres = computed(() => {
  if (!rechercheAgent.value) return agents.value
  const query = rechercheAgent.value.toLowerCase()
  return agents.value.filter(a => 
    `${a.prenom || ''} ${a.nom || ''}`.toLowerCase().includes(query) || 
    (a.telephone && a.telephone.includes(query))
  )
})

const dateVisite = ref('')
const heureVisite = ref('')
const agentChoisi = ref(null)

const peutValider = computed(() => dateVisite.value && heureVisite.value && agentChoisi.value)

function confirmer() {
  if (!peutValider.value) return
  emit('valider', {
    date: dateVisite.value,
    heure: heureVisite.value,
    agentId: agentChoisi.value,
  })
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}
.modal {
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px 12px;
  border-bottom: 1px solid #f1f5f9;
}
.modal-head h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}
.sub {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
}
.x {
  background: none;
  border: none;
  font-size: 18px;
  color: #94a3b8;
  cursor: pointer;
}
.modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.label {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}
.vide {
  font-size: 13px;
  color: #94a3b8;
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}
.dh-inputs {
  display: flex;
  gap: 12px;
}
.dh-input {
  flex: 1;
  padding: 10px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
}
.creneaux {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}
.creneau {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
}
.creneau:hover {
  border-color: #cbd5e1;
}
.creneau.actif {
  border-color: #00d15a;
  background: #f0fdf4;
}
.creneau-date {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}
.creneau-heure {
  font-size: 16px;
  font-weight: 700;
  color: #212d4d;
}
.creneau-agents {
  font-size: 11px;
  color: #64748b;
}
.agent-search-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.search-input {
  width: 100%;
  box-sizing: border-box;
}
.agents-dropdown {
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.agent-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.15s;
}
.agent-option:last-child {
  border-bottom: none;
}
.agent-option:hover {
  background: #f8fafc;
}
.agent-option.actif {
  background: #f0fdf4;
}
.agent-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.agent-nom {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}
.agent-tel {
  font-size: 13px;
  color: #64748b;
}
.check-icon {
  color: #00d15a;
  font-weight: bold;
  font-size: 16px;
}
.agent-vide {
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}
.modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px 24px;
  border-top: 1px solid #f1f5f9;
}
.btn-secondaire {
  padding: 10px 18px;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  color: #475569;
}
.btn-valider {
  padding: 10px 20px;
  border: none;
  background: #00d15a;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
.btn-valider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
