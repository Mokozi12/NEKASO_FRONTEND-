<template>
  <div class="visites-container">
    <!-- Header -->
    <div class="list-header">
      <div>
        <h2>Demandes de visites</h2>
        <p class="subtitle">Demandes et planification</p>
      </div>
      <button @click="showModal = true" class="btn-new-visite">+ Nouvelle visite</button>
    </div>

    <!-- Controls -->
    <div class="controls">
      <select v-model="filtreStatut" class="filter-select">
        <option value="">Tous statuts</option>
        <option value="EN_ATTENTE">En attente</option>
        <option value="CONFIRMEE">Confirmée</option>
        <option value="REFUSEE">Refusée</option>
      </select>
      <button class="btn-export">📅 Exporter calendrier</button>
    </div>

    <!-- Loading -->
    <ChargementSpinner v-if="visitesStore.chargement" message="Chargement des visites" />

    <!-- Table -->
    <div v-if="visitesFiltrees.length > 0" class="table-wrapper">
      <table class="visites-table">
        <thead>
          <tr>
            <th>Candidat</th>
            <th>Contact</th>
            <th>Bien</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="visite in visitesFiltrees" :key="visite.id">
            <td><strong>{{ visite.candidat?.nom || '-' }}</strong></td>
            <td>{{ visite.candidat?.telephone || '-' }}</td>
            <td>{{ visite.bien?.adresse || '-' }}</td>
            <td>{{ formatDate(visite.dateVisite) }}</td>
            <td>{{ visite.heureVisite || '-' }}</td>
            <td><BadgeStatut :statut="visite.statut" /></td>
            <td class="actions-cell">
              <template v-if="visite.statut === 'EN_ATTENTE'">
                <button @click="confirmerVisite(visite.id)" class="btn-action btn-success">✓ Confirmer</button>
                <button @click="refuserVisite(visite.id)" class="btn-action btn-danger">✗ Refuser</button>
                <button @click="openReprogrammer(visite)" class="btn-action btn-secondary">↻ Reprogrammer</button>
              </template>
              <template v-else-if="visite.statut === 'CONFIRMEE'">
                <button @click="openReprogrammer(visite)" class="btn-action btn-secondary">↻ Reprogrammer</button>
              </template>
              <template v-else-if="visite.statut === 'REFUSEE'">
                <button @click="openReprogrammer(visite)" class="btn-action btn-secondary">↻ Reprogrammer</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <MessageVide v-else message="Aucune demande de visite" />

    <!-- Modal Nouvelle Visite -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Nouvelle demande de visite</h3>
          <button @click="showModal = false" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Candidat *</label>
            <select v-model="formData.candidat" class="form-control">
              <option value="">Sélectionner un candidat...</option>
              <option>Candidat 1</option>
              <option>Candidat 2</option>
            </select>
          </div>
          <div class="form-group">
            <label>Contact *</label>
            <input type="text" v-model="formData.contact" class="form-control" placeholder="+221...">
          </div>
          <div class="form-group">
            <label>Bien</label>
            <select v-model="formData.bien" class="form-control">
              <option value="">Sélectionner un bien...</option>
              <option>Appartement Almadies</option>
              <option>Studio Plateau</option>
              <option>Chambre Gueham</option>
            </select>
          </div>
          <div class="form-group">
            <label>Date *</label>
            <input type="date" v-model="formData.date" class="form-control">
          </div>
          <div class="form-group">
            <label>Heure *</label>
            <input type="time" v-model="formData.heure" class="form-control">
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showModal = false" class="btn-secondary">Annuler</button>
          <button @click="enregistrerVisite" class="btn-primary">Enregistrer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useVisitesStore } from '@/stores/visites.store'
import BadgeStatut from '@/components/common/BadgeStatut.vue'
import ChargementSpinner from '@/components/common/ChargementSpinner.vue'
import MessageVide from '@/components/common/MessageVide.vue'

export default {
  name: 'VisitesView',
  components: { BadgeStatut, ChargementSpinner, MessageVide },
  setup() {
    const visitesStore = useVisitesStore()
    
    const filtreStatut = ref('')
    const showModal = ref(false)
    const formData = ref({
      candidat: '',
      contact: '',
      bien: '',
      date: '',
      heure: ''
    })

    onMounted(() => {
      visitesStore.charger()
    })

    const visitesFiltrees = computed(() => {
      if (!filtreStatut.value) return visitesStore.visites
      return visitesStore.visites.filter(v => v.statut === filtreStatut.value)
    })

    const formatDate = (date) => {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fr-FR')
    }

    const confirmerVisite = (id) => {
      visitesStore.confirmer(id)
    }

    const refuserVisite = (id) => {
      visitesStore.refuser(id)
    }

    const openReprogrammer = (visite) => {
      formData.value = {
        candidat: visite.candidat?.nom || '',
        contact: visite.candidat?.telephone || '',
        bien: visite.bien?.adresse || '',
        date: visite.dateVisite || '',
        heure: visite.heureVisite || ''
      }
      showModal.value = true
    }

    const enregistrerVisite = () => {
      console.log('Visite enregistrée:', formData.value)
      showModal.value = false
      formData.value = {
        candidat: '',
        contact: '',
        bien: '',
        date: '',
        heure: ''
      }
    }

    return {
      visitesStore,
      filtreStatut,
      showModal,
      formData,
      visitesFiltrees,
      formatDate,
      confirmerVisite,
      refuserVisite,
      openReprogrammer,
      enregistrerVisite
    }
  }
}
</script>

<style scoped>
.visites-container {
  padding: 1.5rem;
}

/* === HEADER === */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.list-header h2 {
  margin: 0;
  font-size: 1.75rem;
  color: #333;
}

.subtitle {
  margin: 0.25rem 0 0 0;
  color: #999;
  font-size: 0.875rem;
}

.btn-new-visite {
  padding: 0.625rem 1rem;
  background: #1a1f3a;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
}

.btn-new-visite:hover {
  background: #131829;
}

/* === CONTROLS === */
.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
}

.filter-select {
  padding: 0.625rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-export {
  padding: 0.625rem 1rem;
  background: white;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
}

.btn-export:hover {
  background: #f9f9f9;
}

/* === TABLE === */
.table-wrapper {
  overflow-x: auto;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
}

.visites-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.visites-table thead {
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.visites-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #333;
}

.visites-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.875rem;
}

.visites-table tbody tr:hover {
  background: #fafafa;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-action {
  padding: 0.375rem 0.65rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.btn-action.btn-success {
  background: #28a745;
  color: white;
}

.btn-action.btn-success:hover {
  background: #218838;
}

.btn-action.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-action.btn-danger:hover {
  background: #c82333;
}

.btn-action.btn-secondary {
  background: white;
  color: #333;
  border: 1px solid #ddd;
}

.btn-action.btn-secondary:hover {
  background: #f5f5f5;
}

/* === MODAL === */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.btn-close:hover {
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-size: 0.875rem;
}

.form-control {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: inherit;
}

.form-control:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.1);
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-secondary,
.btn-primary {
  padding: 0.625rem 1.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: white;
  color: #666;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #f5f5f5;
}

.btn-primary {
  background: #1a73e8;
  color: white;
}

.btn-primary:hover {
  background: #1555b0;
}
</style>
