<template>
  <Transition name="overlay-fade">
    <div
      v-if="show"
      class="overlay"
      @click.self="fermer"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titreId"
    >
      <Transition name="modal-pop" appear>
        <div class="modal" v-if="show">

          <!-- ✕ Fermeture -->
          <button class="modal__close" @click="fermer" aria-label="Fermer">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </button>

          <!-- Titre -->
          <h3 :id="titreId" class="modal__titre">{{ titre }}</h3>

          <!-- ═══════════════════════════════════════════
               MODE : ENCAISSER
          ═══════════════════════════════════════════ -->
          <template v-if="mode === 'encaisser'">

            <!-- Méthode -->
            <div class="champ">
              <label for="champ-methode">Méthode</label>
              <div class="champ__select-wrap">
                <select id="champ-methode" v-model="form.methode">
                  <option value="ESPECES">Espèces</option>
                  <option value="ORANGE_MONEY">Orange Money</option>
                  <option value="WAVE">Wave</option>
                </select>
                <svg class="champ__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>

            <!-- Montant -->
            <div class="champ">
              <label for="champ-montant">Montant *</label>
              <input
                id="champ-montant"
                type="number"
                v-model.number="form.montant"
                min="0"
                placeholder="0"
              />
            </div>

            <!-- Référence -->
            <div class="champ">
              <label for="champ-ref">Référence transaction</label>
              <input
                id="champ-ref"
                type="text"
                v-model="form.reference"
                placeholder="Auto-générée si vide"
              />
            </div>

            <!-- Info -->
            <p class="modal__info">
              Si vide, une référence sera générée automatiquement. Une quittance
              PDF sera produite.
            </p>

            <!-- Actions -->
            <div class="modal__actions">
              <button class="btn-cancel" @click="fermer">Annuler</button>
              <button
                class="btn-primary"
                :disabled="submitting"
                @click="submitEncaissement"
              >
                <span v-if="submitting" class="btn-primary__spin"></span>
                Valider l'encaissement
              </button>
            </div>
          </template>

          <!-- ═══════════════════════════════════════════
               MODE : NOUVEAU
          ═══════════════════════════════════════════ -->
          <template v-else>

            <!-- Contrat -->
            <div class="champ">
              <label for="champ-contrat">Contrat</label>
              <div class="champ__select-wrap">
                <select id="champ-contrat" v-model="form.contratId">
                  <option :value="null" disabled>Sélectionner un contrat</option>
                  <option v-for="c in contrats" :key="c.id" :value="c.id">
                    {{ c.locataire?.prenom }} {{ c.locataire?.nom }} — {{ c.bien?.libelle || c.bien?.adresse || c.bien?.titre }}
                  </option>
                </select>
                <svg class="champ__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>

            <!-- Date d'échéance -->
            <div class="champ">
              <label for="champ-echeance">Date d'échéance *</label>
              <input id="champ-echeance" type="date" v-model="form.dateEcheance" />
            </div>

            <!-- Actions (bouton seul, aligné à droite) -->
            <div class="modal__actions">
              <button class="btn-primary" @click="submitAttendu">Enregistrer</button>
            </div>
          </template>

        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useNotification } from '@/composables/useNotification'

const props = defineProps({
  show:     { type: Boolean, default: false },
  paiement: { type: Object,  default: null },
  mode:     { type: String,  default: 'encaisser' },
  contrats: { type: Array,   default: () => [] },
})

const emits = defineEmits(['close', 'submit'])
const { erreur } = useNotification()

/* ── Formulaire ────────────────────────────────────── */
const form = ref(resetForm())
const submitting = ref(false)

const titreId = computed(() => `modal-titre-${props.mode}`)
const titre = computed(() =>
  props.mode === 'encaisser' ? 'Encaisser le paiement' : 'Nouveau paiement attendu',
)

function resetForm() {
  return {
    methode: 'ORANGE_MONEY',
    montant: 0,
    reference: '',
    contratId: null,
    dateEcheance: '',
  }
}

/* Pré-remplissage à l'ouverture / reset à la fermeture */
watch(
  () => props.show,
  (open) => {
    if (open && props.mode === 'encaisser' && props.paiement) {
      form.value.montant   = props.paiement.montant || 0
      form.value.methode   = props.paiement.methodePaiement || 'ORANGE_MONEY'
      form.value.reference = props.paiement.reference || ''
    }
    if (!open) {
      form.value = resetForm()
    }
  },
)

/* ── Handlers ────────────────────────────────────────── */
function fermer() {
  emits('close')
}

async function submitEncaissement() {
  if (!form.value.montant || form.value.montant <= 0) {
    erreur('Le montant est obligatoire')
    return
  }
  submitting.value = true
  try {
    emits('submit', {
      contratId:       props.paiement.contratId,
      mois:            props.paiement.mois,
      montant:         Number(form.value.montant),
      methodePaiement: form.value.methode,
      reference:       form.value.reference || null,
    })
  } finally {
    submitting.value = false
  }
}

function submitAttendu() {
  if (!form.value.contratId || !form.value.dateEcheance) {
    erreur('Remplissez tous les champs obligatoires *')
    return
  }
  emits('submit', {
    contratId:    form.value.contratId,
    dateEcheance: form.value.dateEcheance,
  })
}
</script>

<style scoped>
/*
 * ─────────────────────────────────────────────────────
 * TRANSITIONS
 * ─────────────────────────────────────────────────────
 */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity .2s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to { opacity: 0; }

.modal-pop-enter-active,
.modal-pop-leave-active {
  transition: opacity .2s ease, transform .2s ease;
}
.modal-pop-enter-from,
.modal-pop-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(.97);
}

/*
 * ─────────────────────────────────────────────────────
 * OVERLAY
 * ─────────────────────────────────────────────────────
 */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 15, 30, .45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 20px;
}

/*
 * ─────────────────────────────────────────────────────
 * MODAL
 * ─────────────────────────────────────────────────────
 */
.modal {
  background: #fff;
  border-radius: 14px;
  padding: 26px 28px 22px;
  width: 100%;
  max-width: 440px;
  position: relative;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, .05),
    0 16px 48px rgba(10, 15, 30, .14);
}

/* ── Bouton × ──────────────────────────────────────── */
.modal__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  transition: background .12s, color .12s;
}
.modal__close:hover {
  background: rgba(0, 0, 0, .06);
  color: #0f172a;
}

/* ── Titre ────────────────────────────────────────── */
.modal__titre {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 18px;
  padding-right: 28px;
  line-height: 1.3;
}

/*
 * ─────────────────────────────────────────────────────
 * CHAMPS
 * ─────────────────────────────────────────────────────
 */
.champ {
  margin-bottom: 14px;
}

.champ label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
  line-height: 1;
}

/* Inputs (texte, nombre, date) */
.champ input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 13px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  transition: border-color .15s, box-shadow .15s, background .15s;
}
.champ input::placeholder { color: #94a3b8; }
.champ input:focus {
  border-color: #94a3b8;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, .12);
}

/* Select (wrapper + chevron) */
.champ__select-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.champ__select-wrap select {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 36px 10px 13px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  transition: border-color .15s, box-shadow .15s, background .15s;
}
.champ__select-wrap select:focus {
  border-color: #94a3b8;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, .12);
}

.champ__chevron {
  position: absolute;
  right: 12px;
  pointer-events: none;
}

/*
 * ─────────────────────────────────────────────────────
 * TEXTE INFO
 * ─────────────────────────────────────────────────────
 */
.modal__info {
  font-size: 12.5px;
  color: #94a3b8;
  line-height: 1.55;
  margin: 0 0 18px;
}

/*
 * ─────────────────────────────────────────────────────
 * ACTIONS
 * ─────────────────────────────────────────────────────
 */
.modal__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}

/* Annuler */
.btn-cancel {
  padding: 9px 18px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #334155;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  line-height: 1.35;
  transition: background .12s, border-color .12s;
}
.btn-cancel:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/* Valider / Enregistrer */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 8px;
  border: 1px solid #0f172a;
  background: #0f172a;
  color: #fff;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  line-height: 1.35;
  white-space: nowrap;
  transition: background .15s;
}
.btn-primary:hover { background: #1e293b; }
.btn-primary:disabled {
  opacity: .55;
  cursor: not-allowed;
}

/* Spinner dans le bouton */
.btn-primary__spin {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, .3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/*
 * ─────────────────────────────────────────────────────
 * RESPONSIVE
 * ─────────────────────────────────────────────────────
 */
@media (max-width: 500px) {
  .modal {
    padding: 20px 18px 16px;
    border-radius: 12px;
  }
  .modal__titre { font-size: 15px; }
  .modal__actions {
    flex-direction: column-reverse;
    gap: 8px;
  }
  .btn-cancel,
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}
</style>
