<template>
  <LocataireLayout>
    <div class="profil-view">
      <div class="page-header">
        <h1 class="page-title">Mon profil</h1>
        <p class="page-subtitle">Gérez vos informations personnelles et préférences</p>
      </div>

      <div class="profil-content" v-if="!chargement && form">
        <!-- Informations personnelles -->
        <div class="card-section">
          <div class="section-header">
            <h2 class="section-title">Informations personnelles</h2>
          </div>
          <div class="section-body">
            <form @submit.prevent="sauvegarderProfil" class="profil-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="prenom">Prénom</label>
                  <input type="text" id="prenom" v-model="form.prenom" required />
                </div>
                <div class="form-group">
                  <label for="nom">Nom</label>
                  <input type="text" id="nom" v-model="form.nom" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="telephone">Téléphone</label>
                  <input type="tel" id="telephone" v-model="form.telephone" required />
                </div>
                <div class="form-group">
                  <label for="email">Email (Optionnel)</label>
                  <input type="email" id="email" v-model="form.email" />
                </div>
              </div>

              <div class="form-group">
                <label for="whatsapp">Numéro WhatsApp</label>
                <input type="tel" id="whatsapp" v-model="form.whatsapp" required />
                <span class="help-text"
                  >Ce numéro est utilisé pour communiquer avec les gestionnaires.</span
                >
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-primary" :disabled="chargementSauvegarde">
                  {{ chargementSauvegarde ? 'Sauvegarde...' : 'Enregistrer les modifications' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Mot de passe -->
        <div class="card-section">
          <div class="section-header">
            <h2 class="section-title">Sécurité</h2>
          </div>
          <div class="section-body">
            <form @submit.prevent="changerMotDePasse" class="profil-form">
              <div class="form-group">
                <label for="currentPassword">Mot de passe actuel</label>
                <input
                  type="password"
                  id="currentPassword"
                  v-model="passwordForm.current"
                  required
                />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="newPassword">Nouveau mot de passe</label>
                  <input type="password" id="newPassword" v-model="passwordForm.new" required />
                </div>
                <div class="form-group">
                  <label for="confirmPassword">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    v-model="passwordForm.confirm"
                    required
                  />
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-secondary">Changer le mot de passe</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div v-else-if="chargement" class="loading-state">
        <ChargementSpinner message="Chargement du profil..." />
      </div>
    </div>
  </LocataireLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useProfilLocataireStore } from '@/stores/profilLocataire.store'
import LocataireLayout from '@/components/layout/LocataireLayout.vue'
import ChargementSpinner from '@/components/biens/common/ChargementSpinner.vue'

const toast = useToast()
const profilStore = useProfilLocataireStore()

const chargement = ref(true)
const chargementSauvegarde = ref(false)

const form = ref(null)
const passwordForm = ref({
  current: '',
  new: '',
  confirm: '',
})

onMounted(async () => {
  await profilStore.chargerProfil()
  if (profilStore.profil) {
    form.value = { ...profilStore.profil }
  }
  chargement.value = false
})

const sauvegarderProfil = async () => {
  chargementSauvegarde.value = true
  try {
    await profilStore.updateProfil(form.value)
    toast.success('Profil mis à jour avec succès')
  } catch (error) {
    toast.error('Erreur lors de la mise à jour du profil')
  } finally {
    chargementSauvegarde.value = false
  }
}

const changerMotDePasse = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    toast.error('Les mots de passe ne correspondent pas')
    return
  }
  // Simulation changement mot de passe
  toast.success('Mot de passe modifié avec succès')
  passwordForm.value = { current: '', new: '', confirm: '' }
}
</script>

<style scoped>
.profil-view {
  padding: 32px;
  max-width: 800px;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
}

.card-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow: hidden;
}

.section-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.section-body {
  padding: 24px;
}

.profil-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

input {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  outline: none;
  transition: border-color 0.2s;
  background-color: #f9fafb;
}

input:focus {
  border-color: #3b82f6;
  background-color: white;
}

.help-text {
  font-size: 12px;
  color: #6b7280;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-primary {
  background-color: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #16a34a;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: white;
  color: #1f2937;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.loading-state {
  padding: 80px 0;
  text-align: center;
}

@media (max-width: 640px) {
  .profil-view {
    padding: 20px;
  }

  .form-row {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
