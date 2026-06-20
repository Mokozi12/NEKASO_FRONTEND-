<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <header class="modal-head">
        <div>
          <h3>Clôturer la visite</h3>
          <p class="sub">{{ nomClient }} — {{ bien?.intitule }}</p>
        </div>
        <button class="x" @click="$emit('close')" aria-label="Fermer">✕</button>
      </header>

      <div class="modal-body">
        <div class="champ">
          <label>Compte-rendu / rapport de visite</label>
          <textarea
            v-model="compteRendu"
            rows="5"
            placeholder="Déroulé de la visite, impressions du client, points soulevés..."
          ></textarea>
        </div>

        <div class="champ">
          <label>Issue de la visite</label>
          <div class="issues">
            <button
              type="button"
              class="issue issue--contrat"
              :class="{ actif: issue === 'AVEC_CONTRAT' }"
              @click="issue = 'AVEC_CONTRAT'"
            >
              <strong>Avec contrat</strong>
              <span>Génère un pré-contrat pré-rempli</span>
            </button>
            <button
              type="button"
              class="issue"
              :class="{ actif: issue === 'SANS_CONTRAT' }"
              @click="issue = 'SANS_CONTRAT'"
            >
              <strong>Sans suite</strong>
              <span>La visite se ferme sans contrat</span>
            </button>
          </div>
        </div>
      </div>

      <footer class="modal-foot">
        <button class="btn-secondaire" @click="$emit('close')">Annuler</button>
        <button
          class="btn-confirmer"
          :class="{ 'btn-confirmer--contrat': issue === 'AVEC_CONTRAT' }"
          :disabled="!issue"
          @click="confirmer"
        >
          {{ issue === 'AVEC_CONTRAT' ? 'Clôturer et créer le contrat' : 'Clôturer la visite' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { nomComplet } from '@/utils/constants'

const props = defineProps({
  visite: { type: Object, required: true },
})
const emit = defineEmits(['close', 'cloturer'])

const bien = computed(() => props.visite.bien || {})
const nomClient = computed(() => nomComplet(props.visite.client || props.visite.locataire))

const compteRendu = ref('')
const issue = ref('')

function confirmer() {
  if (!issue.value) return
  emit('cloturer', { issue: issue.value, compteRendu: compteRendu.value.trim() })
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
  max-width: 520px;
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
.champ {
  margin-bottom: 20px;
}
.champ label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}
.champ textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  outline: none;
}
.issues {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.issue {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  text-align: left;
}
.issue strong {
  font-size: 14px;
  color: #1e293b;
}
.issue span {
  font-size: 12px;
  color: #64748b;
}
.issue.actif {
  border-color: #212d4d;
  background: #f8fafc;
}
.issue--contrat.actif {
  border-color: #00d15a;
  background: #f0fdf4;
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
.btn-confirmer {
  padding: 10px 20px;
  border: none;
  background: #212d4d;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
.btn-confirmer--contrat {
  background: #00d15a;
}
.btn-confirmer:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
