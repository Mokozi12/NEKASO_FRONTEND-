<template>
  <div class="demande-location">
    <HeaderLocataire v-if="authStore.isAuthenticated && authStore.user?.role === 'LOCATAIRE'" />
    <HeaderPublic v-else />

    <div class="page-content">
      <div class="container">
        <router-link :to="`/biens/${bien?.id}`" class="btn-back">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Retour au bien
        </router-link>

        <div class="form-container">
          <div class="form-header">
            <h1 class="form-title">Demander une location</h1>
            <p class="form-subtitle">
              Remplissez ce formulaire pour soumettre votre demande de location
            </p>
          </div>

          <div class="bien-preview" v-if="bien">
            <img :src="bien.photos?.[0]?.urlPhoto || bien.photos?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop'" :alt="bien.libelle || bien.titre" class="bien-image" />
            <div>
              <h3 class="bien-titre">{{ bien.libelle || bien.titre }}</h3>
              <div class="bien-location">
                {{ typeof bien.adresse === 'string' ? bien.adresse : (bien.adresse?.quartier ? `${bien.adresse.quartier}, ${bien.adresse.ville || 'Dakar'}` : 'Dakar') }}
              </div>
              <div class="bien-prix">{{ formatMontant(bien.loyer) }}/mois</div>
            </div>
          </div>

          <form @submit.prevent="submitDemande" class="form">
            <div class="form-section">
              <h3 class="section-title">Informations personnelles</h3>

              <div class="form-group">
                <label>Nom complet *</label>
                <input type="text" v-model="form.nom" placeholder="Votre nom complet" required />
              </div>

              <div class="form-group">
                <label>Téléphone WhatsApp *</label>
                <input
                  type="tel"
                  v-model="form.telephone"
                  placeholder="+221 77 123 45 67"
                  required
                />
              </div>

              <div class="form-group">
                <label>Email (optionnel)</label>
                <input type="email" v-model="form.email" placeholder="votre.email@example.com" />
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">Détails de la location</h3>

              <div class="form-row">
                <div class="form-group">
                  <label>Date d'entrée souhaitée *</label>
                  <input type="date" v-model="form.dateEntree" required />
                </div>

                <div class="form-group">
                  <label>Durée du bail (mois) *</label>
                  <select v-model="form.duree" required>
                    <option value="">Choisir</option>
                    <option value="6">6 mois</option>
                    <option value="12">12 mois (1 an)</option>
                    <option value="24">24 mois (2 ans)</option>
                    <option value="36">36 mois (3 ans)</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>Nombre d'occupants *</label>
                <input
                  type="number"
                  v-model.number="form.nombreOccupants"
                  min="1"
                  placeholder="Ex: 2"
                  required
                />
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">Informations complémentaires</h3>

              <div class="form-group">
                <label>Profession / Activité</label>
                <input
                  type="text"
                  v-model="form.profession"
                  placeholder="Ex: Ingénieur, Étudiant..."
                />
              </div>

              <div class="form-group">
                <label>Message ou demandes spécifiques</label>
                <textarea
                  v-model="form.message"
                  placeholder="Informations supplémentaires..."
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div class="info-box">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Votre demande sera étudiée par le gestionnaire. Vous recevrez une réponse sous 48h
              maximum.
            </div>

            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande de location' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBiensPublicsStore } from '@/stores/biensPublics.store'
import { useDemandesLocataireStore } from '@/stores/demandesLocataire.store'
import { useToast } from 'vue-toastification'
import HeaderPublic from '@/components/layout/HeaderPublic.vue'
import HeaderLocataire from '@/components/layout/HeaderLocataire.vue'
import { useAuthStore } from '@/stores/auth.store'
import { demandesLocationService } from '@/services/demandes-location.service'

const route = useRoute()
const router = useRouter()
const biensStore = useBiensPublicsStore()
const demandesStore = useDemandesLocataireStore()
const toast = useToast()

const bien = ref(null)
const isSubmitting = ref(false)

const form = reactive({
  nom: '',
  telephone: '',
  email: '',
  dateEntree: '',
  duree: '',
  nombreOccupants: 1,
  profession: '',
  message: '',
})

const authStore = useAuthStore()

onMounted(async () => {
  await biensStore.chargerBiens({ page: 0, size: 20 })
  bien.value = biensStore.biens.find((b) => String(b.id) === String(route.params.id)) || null
})

const formatMontant = (montant) => {
  if (!montant) return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'decimal' }).format(montant) + ' FCFA'
}

const submitDemande = async () => {
  isSubmitting.value = true
  try {
    await demandesLocationService.creer(Number(bien.value.id))
    toast.success('Demande de location envoyée')
    router.push({ name: 'succes-location', params: { bienId: bien.value.id } })
  } catch (error) {
    toast.error(error.response?.data?.message || "Erreur lors de l'envoi de la demande")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.demande-location {
  min-height: 100vh;
  background-color: #f9fafb;
}

.page-content {
  padding: 40px 0 80px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
  transition: color 0.2s;
}

.btn-back:hover {
  color: #111827;
}

.form-container {
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 14px;
  color: #6b7280;
}

.bien-preview {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 32px;
}

.bien-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
}

.bien-titre {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.bien-location {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
}

.bien-prix {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e5e7eb;
}

.form-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: #111827;
  outline: none;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  background-color: white;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.info-box {
  display: flex;
  gap: 12px;
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 13px;
  color: #0c4a6e;
  line-height: 1.5;
}

.info-box svg {
  flex-shrink: 0;
  stroke: #0ea5e9;
  margin-top: 2px;
}

.btn-submit {
  background-color: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #16a34a;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-container {
    padding: 24px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
