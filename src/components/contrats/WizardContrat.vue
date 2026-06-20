<template>
  <div class="carte wizard">
    <div class="wizard-header">
      <h3 class="wizard-titre">Création de pré-contrat — Étape {{ etape }}/5</h3>
      <div class="wizard-progress">
        <div
          v-for="i in 5"
          :key="i"
          :class="['progress-segment', { 'progress-segment--actif': i <= etape }]"
        ></div>
      </div>
    </div>

<div v-if="etape === 1" class="wizard-body">
      <div class="champ">
        <label>Client *</label>
        <select v-model="form.clientId" @change="majMontants">
          <option value="" disabled>Sélectionner un client...</option>
          <option v-for="c in clients" :key="c.id" :value="c.id">
            {{ c.prenom }} {{ c.nom }} — {{ c.telephone }}
          </option>
        </select>
      </div>
      <div class="champ">
        <label>Bien *</label>
        <select v-model="form.bienId" @change="majMontants">
          <option value="" disabled>Choisir un bien</option>
          <option v-for="b in biens" :key="b.id" :value="b.id">
            {{ b.intitule }} — {{ b.adresse }}
          </option>
        </select>
      </div>
      <div v-if="clientChoisi" class="recap-client">
        <span>{{ clientChoisi.prenom }} {{ clientChoisi.nom }}</span>
        <span class="gris">{{ clientChoisi.telephone }}</span>
      </div>
    </div>

<div v-if="etape === 2" class="wizard-body">
      <div class="grille-2">
        <div class="champ">
          <label>Date de début *</label>
          <input v-model="form.dateDebut" type="date" />
        </div>
        <div class="champ">
          <label>Durée (mois) *</label>
          <input v-model.number="form.dureeMois" type="number" min="1" />
        </div>
      </div>
      <div class="grille-2">
        <div class="champ">
          <label>Fréquence des échéances</label>
          <select v-model="form.frequence">
            <option value="MENSUELLE">Mensuelle</option>
            <option value="ANNUELLE">Annuelle</option>
          </select>
        </div>
        <div class="champ">
          <label>Date de fin (calculée)</label>
          <input :value="dateFin" type="date" readonly class="input-readonly" />
        </div>
      </div>
    </div>

<div v-if="etape === 3" class="wizard-body">
      <div class="grille-2">
        <div class="champ">
          <label>Loyer mensuel *</label>
          <input v-model.number="form.montantLoyer" type="number" min="0" />
        </div>
        <div class="champ">
          <label>Caution</label>
          <input v-model.number="form.montantCaution" type="number" min="0" />
        </div>
      </div>
      <div class="champ">
        <label>Conditions particulières</label>
        <textarea
          v-model="form.conditions"
          rows="6"
          placeholder="Décrivez les conditions spécifiques au contrat..."
        ></textarea>
      </div>
    </div>

<div v-if="etape === 4" class="wizard-body">
      <h4 class="section-label">Résumé du pré-contrat</h4>
      <div class="apercu">
        <h4 class="apercu-titre">PRÉ-CONTRAT DE BAIL — RÉPUBLIQUE DU SÉNÉGAL</h4>
        <p>Locataire : <strong>{{ clientChoisi?.prenom }} {{ clientChoisi?.nom }}</strong></p>
        <p>Bien : <strong>{{ bienChoisi?.intitule }}</strong> — {{ bienChoisi?.adresse }}</p>
        <p>Période : du {{ form.dateDebut }} au {{ dateFin }} ({{ form.dureeMois }} mois)</p>
        <p>
          Loyer : {{ formatMontant(form.montantLoyer) }} FCFA ({{ form.frequence.toLowerCase() }})
          — Caution : {{ formatMontant(form.montantCaution) }} FCFA
        </p>
        <p v-if="form.conditions.trim()" class="conditions">{{ form.conditions }}</p>
        <p v-else class="gris">Aucune condition particulière.</p>
      </div>
    </div>

<div v-if="etape === 5" class="wizard-body wizard-body--centrer">
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="27" stroke="#00d15a" stroke-width="2" />
        <path d="M17 28.5L24.5 36L39 21" stroke="#00d15a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <p class="confirm-txt">Prêt à créer le pré-contrat</p>
      <p class="gris ta-center">
        Le client sera notifié et pourra valider ce pré-contrat ou faire des suggestions.
      </p>
    </div>

<div class="wizard-footer">
      <button v-if="etape > 1" class="btn-secondaire" @click="etape--">Précédent</button>
      <span v-else></span>
      <button v-if="etape < 5" class="btn-primaire" :disabled="!etapeValide" @click="etape++">
        Suivant
      </button>
      <button v-else class="btn-confirmer" :disabled="enCours" @click="confirmer">
        {{ enCours ? 'Création...' : 'Créer le pré-contrat' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useFormat } from '@/composables/useFormat'

const props = defineProps({
  clients: { type: Array, default: () => [] },
  biens: { type: Array, default: () => [] },
})
const emit = defineEmits(['cree'])
const { formatMontant } = useFormat()

const etape = ref(1)
const enCours = ref(false)

const form = reactive({
  clientId: '',
  bienId: '',
  dateDebut: new Date().toISOString().split('T')[0],
  dureeMois: 12,
  frequence: 'MENSUELLE',
  montantLoyer: 0,
  montantCaution: 0,
  conditions: '',
})

const clientChoisi = computed(() => props.clients.find((c) => c.id === form.clientId))
const bienChoisi = computed(() => props.biens.find((b) => b.id === form.bienId))

const dateFin = computed(() => {
  if (!form.dateDebut) return ''
  const d = new Date(form.dateDebut)
  d.setMonth(d.getMonth() + (form.dureeMois || 0))
  return d.toISOString().split('T')[0]
})

function majMontants() {
  if (bienChoisi.value) {
    form.montantLoyer = bienChoisi.value.loyer
    form.montantCaution = bienChoisi.value.loyer * 2
  }
}

const etapeValide = computed(() => {
  if (etape.value === 1) return form.clientId && form.bienId
  if (etape.value === 2) return form.dateDebut && form.dureeMois > 0
  if (etape.value === 3) return form.montantLoyer > 0
  return true
})

async function confirmer() {
  enCours.value = true
  try {
    emit('cree', {
      clientId: form.clientId,
      bienId: form.bienId,
      dateDebut: form.dateDebut,
      dateFin: dateFin.value,
      montantLoyer: form.montantLoyer,
      montantCaution: form.montantCaution,
      conditions: form.conditions.trim(),
      frequence: form.frequence,
      origine: { type: 'MANUEL', refId: null },
    })
  } finally {
    enCours.value = false
  }
}
</script>

<style scoped>
.wizard {
  padding: 0;
}
.wizard-header {
  padding: 24px 24px 0;
}
.wizard-titre {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}
.wizard-progress {
  display: flex;
  gap: 8px;
}
.progress-segment {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: #e5e7eb;
  transition: background 0.3s;
}
.progress-segment--actif {
  background: #00d15a;
}
.wizard-body {
  padding: 24px;
}
.wizard-body--centrer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 24px;
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
.champ select,
.champ textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
}
.input-readonly {
  background: #f8fafc;
  color: #64748b;
}
.recap-client {
  display: flex;
  gap: 12px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}
.section-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}
.apercu {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px;
  font-size: 14px;
  line-height: 1.9;
  color: #374151;
}
.apercu-titre {
  text-align: center;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}
.conditions {
  white-space: pre-wrap;
  margin-top: 8px;
}
.gris {
  color: #94a3b8;
}
.ta-center {
  text-align: center;
}
.confirm-txt {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}
.wizard-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}
.btn-primaire,
.btn-confirmer {
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.btn-primaire {
  background: #212d4d;
}
.btn-confirmer {
  background: #00d15a;
}
.btn-primaire:disabled,
.btn-confirmer:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-secondaire {
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
</style>
