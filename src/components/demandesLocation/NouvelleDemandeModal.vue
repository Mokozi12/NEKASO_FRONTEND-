<template>
  <!-- Overlay sombre semi-transparent -->
  <div class="overlay" @click.self="$emit('close')">

    <!-- Boîte du modal -->
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-titre">

      <!-- En-tête : titre + X -->
      <div class="modal-header">
        <h3 id="modal-titre" class="modal-titre">Nouvelle demande de location</h3>
        <button class="btn-fermer" @click="$emit('close')" aria-label="Fermer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Corps du formulaire -->
      <div class="modal-body">

        <!-- Candidat -->
        <div class="champ">
          <label for="candidat">Candidat <span class="requis">*</span></label>
          <input id="candidat" v-model="form.candidat" type="text" autocomplete="off" />
        </div>

        <!-- Contact -->
        <div class="champ">
          <label for="contact">Contact <span class="requis">*</span></label>
          <input id="contact" v-model="form.contact" type="text" autocomplete="off" />
        </div>

        <!-- Bien (select avec flèche) -->
        <div class="champ">
          <label for="bien">Bien</label>
          <div class="select-wrap">
            <select id="bien" v-model="form.bien">
              <option value="">Sélectionner un bien</option>
              <option value="appartement-almadies">Appartement Almadies</option>
              <option value="studio-plateau">Studio Plateau</option>
              <option value="chambre-ouakam">Chambre Ouakam</option>
            </select>
            <svg class="sel-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>

        <!-- Date + Heure côte à côte -->
        <div class="grille-2">
          <div class="champ">
            <label for="date">Date <span class="requis">*</span></label>
            <input id="date" v-model="form.date" type="date" />
          </div>
          <div class="champ">
            <label for="heure">Heure <span class="requis">*</span></label>
            <input id="heure" v-model="form.heure" type="time" />
          </div>
        </div>

      </div>

      <!-- Pied : bouton Enregistrer aligné à droite -->
      <div class="modal-footer">
        <button class="btn-enregistrer" @click="enregistrer">Enregistrer</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['close'])

const form = reactive({
  candidat: '',
  contact:  '',
  bien:     '',
  date:     '',
  heure:    '',
})

function enregistrer() {
  // TODO : appel store / API
  emit('close')
}
</script>

<style scoped>
/* ── Overlay ──────────────────────────────────────────── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(1px);
}

/* ── Boîte ────────────────────────────────────────────── */
.modal {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  animation: fadeSlide 0.18s ease-out;
  overflow: hidden;
}

@keyframes fadeSlide {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
}

/* ── Header ───────────────────────────────────────────── */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px 14px;
}

.modal-titre {
  margin: 0;
  font-size: 15.5px;
  font-weight: 700;
  color: #111827;
}

.btn-fermer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}

.btn-fermer:hover {
  background: #f3f4f6;
  color: #111827;
}

/* ── Corps ────────────────────────────────────────────── */
.modal-body {
  padding: 0 24px 4px;
}

/* ── Champs ───────────────────────────────────────────── */
.champ {
  margin-bottom: 14px;
}

.champ label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 5px;
}

.requis {
  color: #dc2626;
}

/* Inputs et selects : même apparence */
.champ input,
.champ select,
.select-wrap select {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 13px;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  font-size: 13.5px;
  color: #111827;
  background: #f9fafb;
  outline: none;
  transition: border-color 0.15s, background 0.15s;
}

.champ input:focus,
.select-wrap select:focus {
  border-color: #9ca3af;
  background: #ffffff;
}

/* Select avec flèche SVG superposée */
.select-wrap {
  position: relative;
}

.select-wrap select {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 36px;
  cursor: pointer;
}

.sel-arrow {
  position: absolute;
  right: 11px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6b7280;
}

/* Grille Date + Heure */
.grille-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* ── Footer ───────────────────────────────────────────── */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px 22px;
}

.btn-enregistrer {
  background: #111827;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-enregistrer:hover {
  background: #1f2937;
}
</style>
