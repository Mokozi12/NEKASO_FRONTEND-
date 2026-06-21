<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>Clôturer la visite</h3>
      <p>Souhaitez-vous créer un pré-contrat pour cette visite ?</p>

      <div class="options">
        <label><input type="radio" v-model="avecContrat" :value="true" /> Avec contrat</label>
        <label><input type="radio" v-model="avecContrat" :value="false" /> Sans contrat</label>
      </div>

      <div v-if="avecContrat" class="form-part">
        <label>Date de début prévue<input type="date" v-model="dateDebut" /></label>
        <label
          >Jour d'échéance<input type="number" v-model.number="jourEcheance" min="1" max="28"
        /></label>
        <label>Conditions<textarea v-model="conditions" rows="3"></textarea></label>
      </div>

      <div class="actions">
        <button class="btn-corriger" @click="$emit('close')">Annuler</button>
        <button class="btn-activer" :disabled="enCours" @click="confirmer">Clôturer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useVisitesLocataireStore } from '@/stores/visitesLocataire.store'
import { useNotification } from '@/composables/useNotification'

const props = defineProps({ visite: Object })
const emit = defineEmits(['close', 'cloturer'])

const visitesStore = useVisitesLocataireStore()
const { succes, info } = useNotification()

const avecContrat = ref(false)
const dateDebut = ref('')
const jourEcheance = ref(1)
const conditions = ref('')
const enCours = ref(false)

async function confirmer() {
  enCours.value = true
  try {
    const choix = avecContrat.value ? 'AVEC_CONTRAT' : 'SANS_CONTRAT'
    const payload = avecContrat.value
      ? {
          dateDebutPrevu: dateDebut.value,
          jourEcheancePaiement: jourEcheance.value,
          conditions: conditions.value,
        }
      : {}
    await visitesStore.cloturer(props.visite.id, choix, payload)
    succes('Visite clôturée')
    emit('cloturer', { choix, payload })
    emit('close')
  } catch (e) {
    info('Erreur lors de la clôture de la visite')
  }
  enCours.value = false
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: #fff;
  padding: 18px;
  border-radius: 8px;
  width: 520px;
  max-width: 95%;
}
.options {
  display: flex;
  gap: 12px;
  margin: 12px 0;
}
.form-part label {
  display: block;
  margin-bottom: 8px;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}
.btn-activer {
  background: #00a86b;
  color: #fff;
  border: none;
  padding: 8px 12px;
}
.btn-corriger {
  background: #fff;
  border: 1px solid #d1d5db;
  padding: 8px 12px;
}
</style>
