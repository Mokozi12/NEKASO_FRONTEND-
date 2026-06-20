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
          <h4 class="label">1. Choisir un créneau (selon les disponibilités des agents)</h4>
          <div v-if="creneaux.length === 0" class="vide">
            Aucun créneau disponible. Ajoutez des disponibilités à vos agents.
          </div>
          <div v-else class="creneaux">
            <button
              v-for="c in creneaux"
              :key="`${c.date}-${c.heure}`"
              type="button"
              class="creneau"
              :class="{ actif: estCreneauActif(c) }"
              @click="choisirCreneau(c)"
            >
              <span class="creneau-date">{{ formatDate(c.date) }}</span>
              <span class="creneau-heure">{{ c.heure }}</span>
              <span class="creneau-agents">{{ c.agents.length }} agent(s) dispo</span>
            </button>
          </div>
        </section>

<section v-if="creneauChoisi">
          <h4 class="label">2. Affecter un agent disponible</h4>
          <div class="agents">
            <label
              v-for="a in agentsPourCreneau"
              :key="a.id"
              class="agent"
              :class="{ actif: agentChoisi === a.id }"
            >
              <input type="radio" :value="a.id" v-model="agentChoisi" />
              <span class="agent-nom">{{ a.prenom }} {{ a.nom }}</span>
              <span class="agent-tel">{{ a.telephone }}</span>
            </label>
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
import { ref, computed } from 'vue'
import { useAgentsStore } from '@/stores/agents.store'
import { useFormat } from '@/composables/useFormat'
import { nomComplet } from '@/utils/constants'

const props = defineProps({
  visite: { type: Object, required: true },
})
const emit = defineEmits(['close', 'valider'])

const agentsStore = useAgentsStore()
const { formatDate } = useFormat()

const bien = computed(() => props.visite.bien || {})
const nomClient = computed(() => nomComplet(props.visite.client || props.visite.locataire))

const creneaux = computed(() => agentsStore.creneauxDisponibles)
const creneauChoisi = ref(null)
const agentChoisi = ref(null)

const agentsPourCreneau = computed(() => {
  if (!creneauChoisi.value) return []
  return agentsStore
    .agentsDisponibles(creneauChoisi.value.date, creneauChoisi.value.heure)
    .map((a) => ({ id: a.id, nom: a.nom, prenom: a.prenom, telephone: a.telephone }))
})

function estCreneauActif(c) {
  return (
    creneauChoisi.value &&
    creneauChoisi.value.date === c.date &&
    creneauChoisi.value.heure === c.heure
  )
}

function choisirCreneau(c) {
  creneauChoisi.value = { date: c.date, heure: c.heure }
  agentChoisi.value = null
}

const peutValider = computed(() => creneauChoisi.value && agentChoisi.value)

function confirmer() {
  if (!peutValider.value) return
  emit('valider', {
    date: creneauChoisi.value.date,
    heure: creneauChoisi.value.heure,
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
.agents {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.agent {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
}
.agent.actif {
  border-color: #212d4d;
  background: #f8fafc;
}
.agent-nom {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}
.agent-tel {
  margin-left: auto;
  font-size: 13px;
  color: #64748b;
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
