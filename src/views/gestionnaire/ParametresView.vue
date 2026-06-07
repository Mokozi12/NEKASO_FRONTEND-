<template>
  <div class="parametres-page">
    <!-- Le Header est géré par HeaderGestionnaire, mais le titre reste ici ou dans le layout.
         Ici, nous avons juste le titre principal et les onglets. -->
    <div class="page-header">
      <h1 class="page-title">Paramètres & utilisateurs</h1>
    </div>

    <!-- Actions Row: Tabs & Add Button -->
    <div class="actions-row">
      <!-- Tabs -->
      <div class="tabs-wrapper">
        <div class="tabs-container">
          <button
            :class="['tab', { active: activeTab === 'utilisateurs' }]"
            @click="activeTab = 'utilisateurs'"
          >
            Utilisateurs / Équipes
          </button>
          <button
            :class="['tab', { active: activeTab === 'systeme' }]"
            @click="activeTab = 'systeme'"
          >
            Paramètres système
          </button>
        </div>
      </div>

      <!-- Action button (only shown for utilisateurs) -->
      <button
        v-if="activeTab === 'utilisateurs'"
        class="btn-ajouter"
        @click="showAddUserModal = true"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Ajouter un utilisateur
      </button>
    </div>

    <!-- ────────────────────────────────────────────────────────
         TAB 1 : UTILISATEURS / ÉQUIPES
    ───────────────────────────────────────────────────────── -->
    <div v-if="activeTab === 'utilisateurs'" class="panel">
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th class="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="index">
              <td class="font-medium text-dark">{{ user.nom }}</td>
              <td class="text-gray">{{ user.email }}</td>
              <td class="text-dark">{{ user.role }}</td>
              <td>
                <span :class="['badge', user.statut === 'Actif' ? 'badge-actif' : 'badge-inactif']">
                  {{ user.statut }}
                </span>
              </td>
              <td class="td-actions">
                <div class="action-buttons">
                  <button class="btn-action">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
                      ></path>
                    </svg>
                    Réinitialiser
                  </button>
                  <button class="btn-action" @click="openConfirmModal(user)">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                      <line x1="12" y1="2" x2="12" y2="12"></line>
                    </svg>
                    {{ user.statut === 'Actif' ? 'Désactiver' : 'Activer' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ────────────────────────────────────────────────────────
         TAB 2 : PARAMÈTRES SYSTÈME
    ───────────────────────────────────────────────────────── -->
    <div v-if="activeTab === 'systeme'" class="system-settings">
      <!-- Panel 1: Informations entreprise -->
      <div class="panel form-panel">
        <h2 class="panel-title">Informations entreprise</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Nom *</label>
            <input type="text" v-model="systeme.entreprise.nom" class="form-input" />
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input type="email" v-model="systeme.entreprise.email" class="form-input" />
          </div>
          <div class="form-group">
            <label>Téléphone</label>
            <input type="tel" v-model="systeme.entreprise.telephone" class="form-input" />
          </div>
        </div>
      </div>

      <!-- Panel 2: Notifications -->
      <div class="panel form-panel">
        <h2 class="panel-title">Notifications</h2>
        <div class="toggles-list">
          <div class="toggle-item">
            <span class="toggle-label">Notifications WhatsApp</span>
            <label class="toggle-switch">
              <input type="checkbox" v-model="systeme.notifications.whatsapp" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="toggle-item">
            <span class="toggle-label">Notifications Email</span>
            <label class="toggle-switch">
              <input type="checkbox" v-model="systeme.notifications.email" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="toggle-item">
            <span class="toggle-label">Notifications SMS</span>
            <label class="toggle-switch">
              <input type="checkbox" v-model="systeme.notifications.sms" />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Panel 3: Intégrations API -->
      <div class="panel form-panel">
        <h2 class="panel-title">Intégrations API</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Clé Twilio (WhatsApp)</label>
            <input
              type="password"
              v-model="systeme.api.twilio"
              placeholder="YOUR_TWILIO_API_KEY"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Clé Orange Money</label>
            <input
              type="password"
              v-model="systeme.api.orangeMoney"
              placeholder="YOUR_OM_API_KEY"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Clé Wave</label>
            <input
              type="password"
              v-model="systeme.api.wave"
              placeholder="YOUR_WAVE_API_KEY"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="save-actions">
        <button class="btn-save">Enregistrer les modifications</button>
      </div>
    </div>
    <!-- ────────────────────────────────────────────────────────
         MODALS
    ───────────────────────────────────────────────────────── -->
    <!-- Modal Ajout Utilisateur -->
    <div v-if="showAddUserModal" class="modal-overlay" @click.self="showAddUserModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Nouvel utilisateur</h3>
          <button class="btn-close" @click="showAddUserModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nom *</label>
            <input type="text" v-model="newUser.nom" class="form-input" />
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input type="email" v-model="newUser.email" class="form-input" />
          </div>
          <div class="form-group">
            <label>Rôle</label>
            <input
              type="text"
              v-model="newUser.role"
              class="form-input"
              placeholder="Gestionnaire"
              disabled
            />
          </div>
          <div class="form-group">
            <label>Mot de passe (8+ chars, 1 chiffre) *</label>
            <input type="password" v-model="newUser.password" class="form-input" />
          </div>
        </div>
        <div class="modal-footer justify-end">
          <button class="btn-save" @click="addUser">Créer le compte</button>
        </div>
      </div>
    </div>

    <!-- Modal Confirmation Statut -->
    <div v-if="showConfirmModal" class="modal-overlay" @click.self="showConfirmModal = false">
      <div class="modal-card modal-card-sm">
        <div class="modal-body confirm-body">
          <h3 class="confirm-title">Confirmer le changement de statut</h3>
          <p class="confirm-text">
            L'utilisateur
            {{
              selectedUser?.statut === 'Actif'
                ? "ne pourra plus se connecter s'il est désactivé"
                : "pourra se connecter s'il est activé"
            }}.
          </p>
        </div>
        <div class="modal-footer justify-end">
          <button class="btn-outline" @click="showConfirmModal = false">Annuler</button>
          <button class="btn-save" @click="confirmStatusChange">Confirmer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('utilisateurs')

// --- Etat Modals ---
const showAddUserModal = ref(false)
const showConfirmModal = ref(false)
const selectedUser = ref(null)

const newUser = ref({
  nom: '',
  email: '',
  role: 'Gestionnaire',
  password: '',
})

function addUser() {
  if (newUser.value.nom && newUser.value.email && newUser.value.password) {
    users.value.push({
      nom: newUser.value.nom,
      email: newUser.value.email,
      role: newUser.value.role,
      statut: 'Actif',
    })
    showAddUserModal.value = false
    newUser.value = { nom: '', email: '', role: 'Gestionnaire', password: '' }
  }
}

function openConfirmModal(user) {
  selectedUser.value = user
  showConfirmModal.value = true
}

function confirmStatusChange() {
  if (selectedUser.value) {
    selectedUser.value.statut = selectedUser.value.statut === 'Actif' ? 'Inactif' : 'Actif'
  }
  showConfirmModal.value = false
}

// Données fictives Utilisateurs
const users = ref([
  { nom: 'Awa Sarr', email: 'awa@nekaso.sn', role: 'Gestionnaire', statut: 'Actif' },
  { nom: 'Cheikh Diallo', email: 'cheikh@nekaso.sn', role: 'Gestionnaire', statut: 'Actif' },
  { nom: 'Mariama Fall', email: 'mariama@nekaso.sn', role: 'Gestionnaire', statut: 'Inactif' },
])

// Données fictives Paramètres Système
const systeme = ref({
  entreprise: {
    nom: 'NEKASO Immobilier',
    email: 'contact@nekaso.sn',
    telephone: '+221 33 800 00 00',
  },
  notifications: {
    whatsapp: true,
    email: true,
    sms: false,
  },
  api: {
    twilio: '',
    orangeMoney: '',
    wave: '',
  },
})
</script>

<style scoped>
.parametres-page {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  margin-bottom: 8px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* Actions Row */
.actions-row {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 40px; /* Evite le saut de hauteur quand le bouton disparait */
}

@media (min-width: 640px) {
  .actions-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
}

/* Tabs */
.tabs-wrapper {
  display: inline-flex;
}

.tabs-container {
  display: flex;
  background-color: #f1f5f9;
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
}

.tab {
  background: transparent;
  border: none;
  padding: 8px 16px;
  font-size: 13.5px;
  font-weight: 500;
  color: #64748b;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover {
  color: #334155;
}

.tab.active {
  background-color: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  font-weight: 600;
}

/* Buttons */
.btn-ajouter {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #1e293b;
  color: #ffffff;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}
.btn-ajouter:hover {
  background-color: #0f172a;
}

.btn-save {
  background-color: #1e293b;
  color: #ffffff;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-save:hover {
  background-color: #0f172a;
}

/* Panels */
.panel {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 24px;
}

.form-panel {
  padding: 24px;
  margin-bottom: 24px;
}

.panel-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 20px 0;
}

/* Table */
.table-scroll {
  overflow-x: auto;
  margin: 0 -12px;
  padding: 0 12px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.table th {
  padding: 16px 8px;
  font-size: 13.5px;
  font-weight: 500;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
}

.table td {
  padding: 16px 8px;
  font-size: 13.5px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}
.table tbody tr:last-child td {
  border-bottom: none;
}

.font-medium {
  font-weight: 500;
}
.text-dark {
  color: #0f172a;
}
.text-gray {
  color: #64748b;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}
.badge-actif {
  background-color: #dcfce7;
  color: #16a34a;
}
.badge-inactif {
  background-color: #f1f5f9;
  color: #64748b;
}

.th-actions,
.td-actions {
  text-align: right;
}
.action-buttons {
  display: inline-flex;
  gap: 16px;
  justify-content: flex-end;
}
.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #334155;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.2s;
}
.btn-action:hover {
  color: #0f172a;
}

/* System Settings Layout */
.system-settings {
  display: flex;
  flex-direction: column;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px 24px;
}
@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-size: 13px;
  color: #334155;
  font-weight: 500;
}
.form-input {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #334155;
  background-color: #f8fafc;
  outline: none;
  transition: border-color 0.2s;
}
.form-input:focus {
  border-color: #94a3b8;
}
.form-input::placeholder {
  color: #94a3b8;
}

/* Toggles List */
.toggles-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.toggle-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 400px;
}

.toggle-label {
  font-size: 13.5px;
  color: #334155;
  font-weight: 500;
}

/* Custom Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 24px;
}
.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #0f172a;
}
input:checked + .slider:before {
  transform: translateX(20px);
}

.save-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-card {
  background-color: #ffffff;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.modal-card-sm {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.confirm-body {
  text-align: left;
}

.confirm-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin-top: 0;
  margin-bottom: 8px;
}

.confirm-text {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.modal-footer {
  display: flex;
  padding: 16px 24px;
  background-color: #f8fafc;
  border-top: 1px solid #f1f5f9;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  gap: 12px;
}

.justify-end {
  justify-content: flex-end;
}

.btn-outline {
  background-color: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-outline:hover {
  background-color: #f1f5f9;
}
</style>
