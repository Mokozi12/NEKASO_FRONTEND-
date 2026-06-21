<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <header class="modal-head">
        <div>
          <h3>Proposer un pré-contrat</h3>
          <p class="sub">{{ bien.intitule || bien.libelle || 'Bien' }} — {{ nomClient }}</p>
        </div>
        <button class="x" @click="$emit('close')" aria-label="Fermer">✕</button>
      </header>

      <div class="modal-body">
        <p class="info">
          Le client souhaite louer ce bien suite à la visite. Définissez les conditions du
          pré-contrat ; il lui sera ensuite proposé pour validation.
        </p>
        <div class="grille-2">
          <div class="champ">
            <label>Date de début prévue *</label>
            <input v-model="form.dateDebutPrevu" type="date" />
          </div>
          <div class="champ">
            <label>Jour d'échéance (1-28) *</label>
            <input v-model.number="form.jourEcheancePaiement" type="number" min="1" max="28" />
          </div>
        </div>
        <div class="champ">
          <label>Conditions particulières *</label>
          <textarea
            v-model="form.conditions"
            rows="4"
            placeholder="Loyer réajusté, clauses spécifiques, durée du bail..."
          ></textarea>
        </div>
      </div>

      <footer class="modal-foot">
        <button class="btn-secondaire" @click="$emit('close')">Annuler</button>
        <button class="btn-valider" :disabled="!peutValider || enCours" @click="confirmer">
          {{ enCours ? 'Envoi...' : 'Proposer le pré-contrat' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'

const props = defineProps({
  visite: { type: Object, required: true },
  enCours: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'proposer'])

const bien = computed(() => props.visite.bien || {})
const nomClient = computed(() => {
  const c = props.visite.client
  return c ? `${c.prenom || ''} ${c.nom || ''}`.trim() || c.telephone || 'Client' : 'Client'
})

const form = reactive({
  dateDebutPrevu: new Date().toISOString().split('T')[0],
  jourEcheancePaiement: 5,
  conditions: '',
})

const peutValider = computed(
  () =>
    form.dateDebutPrevu &&
    form.jourEcheancePaiement >= 1 &&
    form.jourEcheancePaiement <= 28 &&
    form.conditions.trim().length > 0,
)

function confirmer() {
  if (!peutValider.value) return
  emit('proposer', {
    dateDebutPrevu: form.dateDebutPrevu,
    jourEcheancePaiement: form.jourEcheancePaiement,
    conditions: form.conditions.trim(),
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
}
.info {
  font-size: 13px;
  color: #475569;
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}
.grille-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.champ {
  margin-bottom: 16px;
}
.champ label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
}
.champ input,
.champ textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
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
