<template>
  <div class="parametres-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-titre">Paramètres</h1>
      <button class="btn-ajouter" @click="showAddUserModal = true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Ajouter un utilisateur
      </button>
    </div>

    <!-- Section 1: Utilisateurs -->
    <div class="section">
      <h2 class="section-titre">Utilisateurs & Équipes</h2>
      <div class="panel">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th style="text-align:right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.email">
                <td class="td-nom">{{ user.nom }}</td>
                <td class="td-email">{{ user.email }}</td>
                <td class="td-role">{{ user.role }}</td>
                <td>
                  <span :class="['badge', user.statut === 'Actif' ? 'badge--actif' : 'badge--inactif']">
                    {{ user.statut }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <button class="btn-action" @click="resetPassword(user)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                      </svg>
                      Réinitialiser
                    </button>
                    <button class="btn-action" @click="openConfirmModal(user)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
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
    </div>

    <!-- Section 2: Informations entreprise -->
    <div class="section">
      <h2 class="section-titre">Informations entreprise</h2>
      <div class="panel">
        <div class="form-grid">
          <div class="form-group">
            <label>Nom de l'entreprise *</label>
            <input type="text" v-model="systeme.entreprise.nom" class="form-input" />
          </div>
          <div class="form-group">
            <label>Email de contact *</label>
            <input type="email" v-model="systeme.entreprise.email" class="form-input" />
          </div>
          <div class="form-group">
            <label>Téléphone</label>
            <input type="tel" v-model="systeme.entreprise.telephone" class="form-input" />
          </div>
        </div>
      </div>
    </div>

    <!-- Bouton Enregistrer global -->
    <div class="save-zone">
      <button class="btn-save" @click="saveAll">Enregistrer les modifications</button>
    </div>

    <!-- Modal Ajout Utilisateur -->
    <div v-if="showAddUserModal" class="modal-overlay" @click.self="showAddUserModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Nouvel utilisateur</h3>
          <button class="btn-close" @click="showAddUserModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nom complet *</label>
            <input type="text" v-model="newUser.nom" class="form-input" placeholder="Ex: Awa Sarr" />
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input type="email" v-model="newUser.email" class="form-input" placeholder="awa@nekaso.sn" />
          </div>
          <div class="form-group">
            <label>Rôle</label>
            <select v-model="newUser.role" class="form-input">
              <option value="Gestionnaire">Gestionnaire</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div class="form-group">
            <label>Mot de passe *</label>
            <input
              type="password"
              v-model="newUser.password"
              class="form-input"
              placeholder="8+ caractères"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-outline" @click="showAddUserModal = false">Annuler</button>
          <button class="btn-primary" @click="addUser">Créer le compte</button>
        </div>
      </div>
    </div>

    <!-- Modal Confirmation Statut -->
    <div v-if="showConfirmModal" class="modal-overlay" @click.self="showConfirmModal = false">
      <div class="modal-card modal-sm">
        <div class="modal-body">
          <h3 class="confirm-titre">Confirmer le changement de statut</h3>
          <p class="confirm-text">
            {{ selectedUser?.statut === 'Actif'
              ? "L'utilisateur ne pourra plus se connecter."
              : "L'utilisateur pourra de nouveau se connecter." }}
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn-outline" @click="showConfirmModal = false">Annuler</button>
          <button class="btn-primary" @click="confirmStatusChange">Confirmer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNotification } from '@/composables/useNotification'

const { succes, erreur } = useNotification()

const showAddUserModal = ref(false)
const showConfirmModal = ref(false)
const selectedUser = ref(null)

const newUser = ref({ nom: '', email: '', role: 'Gestionnaire', password: '' })

const users = ref([
  { nom: 'Awa Sarr', email: 'awa@nekaso.sn', role: 'Gestionnaire', statut: 'Actif' },
  { nom: 'Cheikh Diallo', email: 'cheikh@nekaso.sn', role: 'Gestionnaire', statut: 'Actif' },
  { nom: 'Mariama Fall', email: 'mariama@nekaso.sn', role: 'Admin', statut: 'Inactif' },
])

const systeme = ref({
  entreprise: {
    nom: 'NEKASO Immobilier',
    email: 'contact@nekaso.sn',
    telephone: '+221 33 800 00 00',
  },
})

function addUser() {
  if (!newUser.value.nom || !newUser.value.email || !newUser.value.password) {
    erreur('Veuillez remplir tous les champs obligatoires')
    return
  }
  users.value.push({
    nom: newUser.value.nom,
    email: newUser.value.email,
    role: newUser.value.role,
    statut: 'Actif',
  })
  succes('Utilisateur créé avec succès')
  showAddUserModal.value = false
  newUser.value = { nom: '', email: '', role: 'Gestionnaire', password: '' }
}

function openConfirmModal(user) {
  selectedUser.value = user
  showConfirmModal.value = true
}

function confirmStatusChange() {
  if (selectedUser.value) {
    selectedUser.value.statut = selectedUser.value.statut === 'Actif' ? 'Inactif' : 'Actif'
    succes(`Statut modifié : ${selectedUser.value.statut}`)
  }
  showConfirmModal.value = false
}

function resetPassword(user) {
  succes(`Email de réinitialisation envoyé à ${user.email}`)
}

function saveAll() {
  succes('Paramètres enregistrés avec succès')
}
</script>

<style scoped>
.parametres-page { padding: 0; }

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}
.page-titre {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.btn-ajouter {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #0f172a;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-ajouter:hover { background: #1e293b; }

/* Sections */
.section { margin-bottom: 28px; }
.section-titre {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 14px;
}

.panel {
  background: white;
  border: 1px solid #e8edf2;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,.04);
}

/* Table */
.table-wrapper { overflow-x: auto; }
table {
  width: 100%;
  border-collapse: collapse;
}
th {
  padding: 12px 14px;
  font-size: 12.5px;
  font-weight: 600;
  color: #64748b;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}
td {
  padding: 14px;
  font-size: 13.5px;
  border-bottom: 1px solid #f8fafc;
  vertical-align: middle;
}
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover { background: #fafbfc; }

.td-nom { font-weight: 600; color: #0f172a; }
.td-email { color: #64748b; }
.td-role { color: #334155; }

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.badge--actif { background: #dcfce7; color: #16a34a; }
.badge--inactif { background: #f1f5f9; color: #64748b; }

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
}
.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: none;
  color: #334155;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}
.btn-action:hover { color: #0f172a; }

/* Forms */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px 24px;
}
@media (min-width: 640px) {
  .form-grid { grid-template-columns: repeat(2, 1fr); }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.form-group label {
  font-size: 13px;
  color: #334155;
  font-weight: 500;
}
.form-input {
  padding: 10px 13px;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  font-size: 13.5px;
  color: #334155;
  background: #f8fafc;
  outline: none;
  transition: border-color 0.2s;
}
.form-input:focus { border-color: #94a3b8; background: white; }
.form-input::placeholder { color: #94a3b8; }

/* Save zone */
.save-zone {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
.btn-save {
  background: #0f172a;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-save:hover { background: #1e293b; }

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-card {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 480px;
  box-shadow: 0 20px 50px rgba(0,0,0,.15);
}
.modal-sm { max-width: 400px; }

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
}
.modal-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.btn-close {
  background: transparent;
  border: none;
  font-size: 24px;
  color: #94a3b8;
  cursor: pointer;
  line-height: 1;
}

.modal-body { padding: 24px; }

.confirm-titre {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 10px;
}
.confirm-text {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.btn-outline {
  background: white;
  color: #334155;
  border: 1px solid #cbd5e1;
  padding: 9px 16px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-outline:hover { background: #f1f5f9; }

.btn-primary {
  background: #0f172a;
  color: white;
  border: none;
  padding: 9px 16px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: #1e293b; }
</style>
