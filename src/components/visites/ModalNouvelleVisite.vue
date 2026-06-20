<template>
  <div v-if="visible" class="modal-overlay" @click.self="emit('fermer')">
    <div class="modal" role="dialog" aria-modal="true" :aria-labelledby="titreId">
      <div class="modale-header">
        <h3 :id="titreId" class="modale-titre">{{ titre }}</h3>
        <button type="button" class="modale-fermer" aria-label="Fermer" @click="emit('fermer')">
          &times;
        </button>
      </div>

      <form @submit.prevent="soumettre" class="modale-corps">
        <div class="champ">
          <label for="visite-candidat">Candidat *</label>
          <input
            id="visite-candidat"
            v-model="modele.candidat"
            type="text"
            placeholder="Nom du candidat"
            required
          />
        </div>

        <div class="champ">
          <label for="visite-contact">Contact *</label>
          <input
            id="visite-contact"
            v-model="modele.contact"
            type="tel"
            placeholder="+221..."
            required
          />
        </div>

        <div class="champ">
          <label for="visite-bien">Bien</label>
          <select id="visite-bien" v-model="modele.bienId">
            <option value="" disabled>Sélectionner un bien...</option>
            <option v-for="bien in biens" :key="bien.id" :value="bien.id">
              {{ libelleBien(bien) }}
            </option>
          </select>
        </div>

        <div class="grille-2">
          <div class="champ">
            <label for="visite-date">Date *</label>
            <input id="visite-date" v-model="modele.date" type="date" required />
          </div>
          <div class="champ">
            <label for="visite-heure">Heure *</label>
            <input id="visite-heure" v-model="modele.heure" type="time" required />
          </div>
        </div>

        <div class="modale-actions">
          <button type="submit" class="btn-visites-primaire">Enregistrer</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { libelleBien } from '@/utils/biens'

const props = defineProps({
  visible: { type: Boolean, default: false },
  modele: {
    type: Object,
    required: true
  },
  biens: {
    type: Array,
    default: () => []
  },
  modeEdition: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['fermer', 'soumettre'])

const titreId = 'titre-modale-visite'

const titre = computed(() =>
  props.modeEdition ? 'Reprogrammer la visite' : 'Nouvelle demande de visite'
)

function soumettre() {
  emit('soumettre')
}
</script>

<style scoped>
.modale-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modale-titre {
  font-size: 18px;
  font-weight: 700;
  color: var(--couleur-primaire);
  margin: 0;
}

.modale-fermer {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--texte-secondaire);
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.modale-fermer:hover {
  color: var(--texte-principal);
}

.modale-corps {
  display: flex;
  flex-direction: column;
}

.modale-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-visites-primaire {
  background-color: var(--couleur-primaire);
  color: var(--texte-blanc);
  border: none;
  padding: 10px 20px;
  border-radius: var(--bordure-radius-petit);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.btn-visites-primaire:hover {
  opacity: 0.9;
}
</style>
