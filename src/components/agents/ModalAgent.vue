<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <header class="modal-head">
        <h3>Nouvel agent de visite</h3>
        <button class="x" @click="$emit('close')" aria-label="Fermer">✕</button>
      </header>

      <div class="modal-body">
        <div class="grille-2">
          <div class="champ">
            <label>Prénom *</label>
            <input v-model="form.prenom" type="text" placeholder="Prénom" />
          </div>
          <div class="champ">
            <label>Nom *</label>
            <input v-model="form.nom" type="text" placeholder="Nom" />
          </div>
        </div>
        <div class="champ">
          <label>Téléphone *</label>
          <input v-model="form.telephone" type="text" placeholder="+221 77 000 00 00" />
        </div>

        <div class="champ">
          <label>Créneaux de disponibilité</label>
          <div v-for="(c, i) in form.disponibilites" :key="i" class="creneau-row">
            <input v-model="c.date" type="date" />
            <input v-model="c.heure" type="time" />
            <button type="button" class="x-small" @click="retirer(i)">✕</button>
          </div>
          <button type="button" class="btn-ajouter-creneau" @click="ajouter">+ Ajouter un créneau</button>
        </div>
      </div>

      <footer class="modal-foot">
        <button class="btn-secondaire" @click="$emit('close')">Annuler</button>
        <button class="btn-primaire" :disabled="!valide" @click="enregistrer">Enregistrer l'agent</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'

const emit = defineEmits(['close', 'creer'])

const form = reactive({
  prenom: '',
  nom: '',
  telephone: '',
  disponibilites: [{ date: '', heure: '' }],
})

const valide = computed(
  () => form.prenom.trim() && form.nom.trim() && form.telephone.trim(),
)

function ajouter() {
  form.disponibilites.push({ date: '', heure: '' })
}
function retirer(i) {
  form.disponibilites.splice(i, 1)
}

function enregistrer() {
  if (!valide.value) return
  emit('creer', {
    prenom: form.prenom.trim(),
    nom: form.nom.trim(),
    telephone: form.telephone.trim(),
    disponibilites: form.disponibilites.filter((c) => c.date && c.heure),
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
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
}
.modal-head h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
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
.champ input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
}
.creneau-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}
.creneau-row input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
}
.x-small {
  background: #fef2f2;
  color: #dc2626;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.btn-ajouter-creneau {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  color: #475569;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
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
.btn-primaire {
  padding: 10px 20px;
  border: none;
  background: #212d4d;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
.btn-primaire:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
