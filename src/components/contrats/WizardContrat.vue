<!--
  WizardContrat — Assistant de création de contrat en 4 étapes.
  Étape 1 : Sélection du candidat + informations de base
  Étape 2 : Clauses du contrat
  Étape 3 : Aperçu du contrat
  Étape 4 : Confirmation et signature
-->
<template>
  <div class="carte wizard">
    <!-- Titre et barre de progression -->
    <div class="wizard-header">
      <h3 class="wizard-titre">Génération de contrat — Étape {{ etape }}/4</h3>
      <div class="wizard-progress">
        <div
          v-for="i in 4" :key="i"
          :class="['progress-segment', { 'progress-segment--actif': i <= etape }]"
        ></div>
      </div>
    </div>

    <!-- ═══════════ ÉTAPE 1 : Informations de base ═══════════ -->
    <div v-if="etape === 1" class="wizard-body">
      <!-- Sélection du candidat -->
      <div class="champ">
        <label>Candidat (visite confirmée)</label>
        <select v-model="candidatSelectionne" @change="remplirDepuisCandidat">
          <option value="" disabled>Sélectionner un candidat...</option>
          <option
            v-for="c in candidats" :key="c.id"
            :value="c.id"
          >
            {{ c.locataire.prenom }} {{ c.locataire.nom }} — {{ c.bien.typeBien }} {{ c.bien.adresse }}
          </option>
        </select>
      </div>

      <div class="grille-2">
        <div class="champ">
          <label>Locataire *</label>
          <input
            v-model="form.locataire"
            type="text"
            placeholder="Nom du locataire"
            readonly
            class="input-readonly"
          />
        </div>
        <div class="champ">
          <label>Bien *</label>
          <select v-model="form.bienId">
            <option value="" disabled>Choisir un bien</option>
            <option
              v-for="b in biens" :key="b.id"
              :value="b.id"
            >
              {{ b.typeBien }} — {{ b.adresse }}
            </option>
          </select>
        </div>
      </div>

      <div class="grille-2">
        <div class="champ">
          <label>Date début *</label>
          <input v-model="form.dateDebut" type="date" />
        </div>
        <div class="champ">
          <label>Loyer mensuel *</label>
          <input v-model.number="form.montantLoyer" type="number" min="0" placeholder="0" />
        </div>
      </div>

      <div class="champ" style="max-width: 48%;">
        <label>Caution</label>
        <input v-model.number="form.montantCaution" type="number" min="0" placeholder="0" />
      </div>
    </div>

    <!-- ═══════════ ÉTAPE 2 : Clauses ═══════════ -->
    <div v-if="etape === 2" class="wizard-body">
      <h4 class="section-label">Clauses standards</h4>

      <div class="clauses-liste">
        <label
          v-for="clause in clausesStandards" :key="clause.id"
          class="clause-item"
        >
          <input
            type="checkbox"
            :value="clause.texte"
            v-model="form.clausesSelectionnees"
          />
          <span>{{ clause.texte }}</span>
        </label>
      </div>

      <div class="champ" style="margin-top: 24px;">
        <label>Conditions particulières</label>
        <textarea
          v-model="form.conditionsParticulieres"
          rows="4"
          placeholder="Décrivez les conditions spécifiques au contrat..."
        ></textarea>
      </div>
    </div>

    <!-- ═══════════ ÉTAPE 3 : Aperçu ═══════════ -->
    <div v-if="etape === 3" class="wizard-body">
      <h4 class="section-label">Aperçu du contrat</h4>

      <div class="apercu-contrat">
        <h4 class="apercu-titre">CONTRAT DE BAIL — RÉPUBLIQUE DU SÉNÉGAL</h4>

        <p class="apercu-ligne">
          Entre le bailleur représenté par NEKASO et
          <strong>{{ form.locataire }}</strong>, locataire :
        </p>

        <p class="apercu-ligne">
          Bien : <strong>{{ bienSelectionneNom }}</strong>
        </p>
        <p class="apercu-ligne">
          Adresse : {{ bienSelectionneAdresse }}
        </p>
        <p class="apercu-ligne">
          Date de début : {{ form.dateDebut }}
        </p>
        <p class="apercu-ligne">
          Loyer mensuel : {{ formatMontant(form.montantLoyer) }} FCFA
          — Caution : {{ formatMontant(form.montantCaution) }} FCFA
        </p>
        <p class="apercu-ligne">
          Clauses :
          <span v-if="toutesLesClauses.length === 0" class="texte-secondaire">Aucune clause définie</span>
        </p>
        <ul v-if="toutesLesClauses.length > 0" class="apercu-clauses">
          <li v-for="(clause, i) in toutesLesClauses" :key="i">{{ clause }}</li>
        </ul>
      </div>
    </div>

    <!-- ═══════════ ÉTAPE 4 : Confirmation ═══════════ -->
    <div v-if="etape === 4" class="wizard-body wizard-body--centrer">
      <div class="confirmation-icone">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="27" stroke="#22c55e" stroke-width="2"/>
          <path d="M17 28.5L24.5 36L39 21" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <p class="confirmation-texte">Prêt à confirmer le contrat</p>

      <div class="confirmation-actions">
        <button class="btn-secondaire" @click="$emit('telecharger-pdf-preview')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Télécharger PDF
        </button>
        <button class="btn-secondaire">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Signer électroniquement
        </button>
      </div>
    </div>

    <!-- ═══════════ Navigation ═══════════ -->
    <div class="wizard-footer">
      <button
        v-if="etape > 1"
        class="btn-secondaire"
        @click="etapePrecedente"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Précédent
      </button>
      <span v-else></span>

      <button
        v-if="etape < 4"
        class="btn-primaire"
        :disabled="!etapeValide"
        @click="etapeSuivante"
      >
        Suivant
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
      <button
        v-else
        class="btn-confirmer"
        @click="confirmerContrat"
        :disabled="enCoursCreation"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
        {{ enCoursCreation ? 'Création...' : 'Confirmer le contrat' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  candidats: { type: Array, default: () => [] },
  biens:     { type: Array, default: () => [] }
})

const emit = defineEmits(['contrat-cree', 'telecharger-pdf-preview'])

/* ───── État du wizard ───── */
const etape = ref(1)
const enCoursCreation = ref(false)
const candidatSelectionne = ref('')

const form = ref({
  locataire: '',
  locataireId: null,
  bienId: '',
  dateDebut: '',
  montantLoyer: 0,
  montantCaution: 0,
  clausesSelectionnees: [],
  conditionsParticulieres: ''
})

/* ───── Clauses standards ───── */
const clausesStandards = [
  { id: 1, texte: 'Interdiction de fumer dans le logement' },
  { id: 2, texte: 'Animaux domestiques non autorisés' },
  { id: 3, texte: 'Sous-location interdite' },
  { id: 4, texte: 'Entretien des espaces communs à la charge du locataire' },
  { id: 5, texte: 'Assurance habitation obligatoire' }
]

/* ───── Computed ───── */
const bienSelectionne = computed(() =>
  props.biens.find(b => b.id === form.value.bienId)
)

const bienSelectionneNom = computed(() => {
  const b = bienSelectionne.value
  if (!b) return '—'
  const type = b.typeBien ? b.typeBien.charAt(0) + b.typeBien.slice(1).toLowerCase() : ''
  const quartier = b.adresse ? b.adresse.split(',')[0].trim() : ''
  return `${type} ${quartier}`
})

const bienSelectionneAdresse = computed(() =>
  bienSelectionne.value?.adresse ?? '—'
)

const toutesLesClauses = computed(() => {
  const clauses = [...form.value.clausesSelectionnees]
  if (form.value.conditionsParticulieres.trim()) {
    clauses.push(form.value.conditionsParticulieres.trim())
  }
  return clauses
})

const etapeValide = computed(() => {
  if (etape.value === 1) {
    return form.value.locataire && form.value.bienId && form.value.dateDebut && form.value.montantLoyer > 0
  }
  return true // Étapes 2, 3, 4 sont toujours valides
})

/* ───── Méthodes ───── */
function remplirDepuisCandidat() {
  const candidat = props.candidats.find(c => c.id === Number(candidatSelectionne.value))
  if (!candidat) return
  form.value.locataire = `${candidat.locataire.prenom} ${candidat.locataire.nom}`
  form.value.locataireId = candidat.locataire.id
  form.value.bienId = candidat.bien.id
  form.value.montantLoyer = candidat.bien.loyer
  form.value.montantCaution = candidat.bien.loyer * 2
}

function etapeSuivante() {
  if (etape.value < 4 && etapeValide.value) etape.value++
}

function etapePrecedente() {
  if (etape.value > 1) etape.value--
}

function formatMontant(montant) {
  if (!montant) return '0'
  return Number(montant).toLocaleString('fr-FR')
}

async function confirmerContrat() {
  enCoursCreation.value = true
  try {
    const bienObj = bienSelectionne.value
    const contratData = {
      dateDebut: form.value.dateDebut,
      dateFin: calculerDateFin(form.value.dateDebut, 12),
      montantLoyer: form.value.montantLoyer,
      montantCaution: form.value.montantCaution,
      conditions: toutesLesClauses.value.join('. '),
      locataire: {
        id: form.value.locataireId,
        nom: form.value.locataire.split(' ').slice(1).join(' '),
        prenom: form.value.locataire.split(' ')[0]
      },
      bien: bienObj ? {
        id: bienObj.id,
        adresse: bienObj.adresse,
        typeBien: bienObj.typeBien,
        loyer: bienObj.loyer
      } : null
    }
    emit('contrat-cree', contratData)
  } finally {
    enCoursCreation.value = false
  }
}

function calculerDateFin(dateDebut, mois) {
  if (!dateDebut) return ''
  const d = new Date(dateDebut)
  d.setMonth(d.getMonth() + mois)
  return d.toISOString().split('T')[0]
}
</script>

<style scoped>
/* ===== En-tête du wizard ===== */
.wizard {
  padding: 0;
}

.wizard-header {
  padding: 24px 24px 0;
}

.wizard-titre {
  font-size: 16px;
  font-weight: 700;
  color: var(--texte-principal);
  margin-bottom: 16px;
}

/* ===== Barre de progression ===== */
.wizard-progress {
  display: flex;
  gap: 8px;
}

.progress-segment {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background-color: var(--bordure);
  transition: background-color 0.3s ease;
}

.progress-segment--actif {
  background-color: var(--couleur-succes);
}

/* ===== Corps des étapes ===== */
.wizard-body {
  padding: 24px;
}

.wizard-body--centrer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
}

/* ===== Étape 2 : Clauses ===== */
.section-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--texte-principal);
  margin-bottom: 16px;
}

.clauses-liste {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.clause-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--texte-principal);
  cursor: pointer;
}

.clause-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--couleur-succes);
  cursor: pointer;
  flex-shrink: 0;
}

/* ===== Étape 3 : Aperçu ===== */
.apercu-contrat {
  background: var(--fond-general);
  border: 1px solid var(--bordure);
  border-radius: var(--bordure-radius);
  padding: 24px;
}

.apercu-titre {
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: var(--texte-principal);
  margin-bottom: 20px;
}

.apercu-ligne {
  font-size: 14px;
  color: var(--texte-principal);
  margin-bottom: 6px;
  line-height: 1.7;
}

.apercu-clauses {
  list-style: disc;
  padding-left: 24px;
  margin-top: 4px;
}

.apercu-clauses li {
  font-size: 13px;
  color: var(--texte-secondaire);
  margin-bottom: 4px;
}

.texte-secondaire {
  color: var(--texte-secondaire);
  font-style: italic;
}

/* ===== Étape 4 : Confirmation ===== */
.confirmation-icone {
  margin-bottom: 16px;
}

.confirmation-texte {
  font-size: 16px;
  font-weight: 600;
  color: var(--texte-principal);
  margin-bottom: 24px;
}

.confirmation-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

/* ===== Footer du wizard ===== */
.wizard-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid var(--bordure);
}

.btn-confirmer {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: var(--couleur-succes);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: var(--bordure-radius-petit);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-confirmer:hover {
  opacity: 0.9;
}

.btn-confirmer:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== Input readonly ===== */
.input-readonly {
  background-color: var(--fond-general) !important;
  color: var(--texte-secondaire) !important;
  cursor: default;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .grille-2 {
    grid-template-columns: 1fr;
  }

  .confirmation-actions {
    flex-direction: column;
    width: 100%;
  }

  .confirmation-actions .btn-secondaire {
    width: 100%;
    justify-content: center;
  }
}
</style>
