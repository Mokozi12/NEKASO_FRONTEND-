<template>
  <div class="demande-visite">
    <HeaderLocataire v-if="authStore.isAuthenticated && authStore.user?.role === 'LOCATAIRE'" />
    <HeaderPublic v-else />

    <div class="page-content">
      <div class="container">
        <router-link to="/catalogue" class="btn-back">
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
          Retour aux biens
        </router-link>

        <div class="form-container">
          <div class="form-header">
            <h1 class="form-title">Demander une visite</h1>
            <p class="form-subtitle">Remplissez ce formulaire pour planifier une visite du bien</p>
          </div>

          <div class="bien-preview" v-if="bien">
            <img :src="bien.photos?.[0]?.urlPhoto || bien.photos?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop'" :alt="bien.libelle || bien.titre" class="bien-image" />
            <div>
              <h3 class="bien-titre">{{ bien.libelle || bien.titre }}</h3>
              <div class="bien-location">
                {{ typeof bien.adresse === 'string' ? bien.adresse : (bien.adresse?.quartier ? `${bien.adresse.quartier}, ${bien.adresse.ville || 'Dakar'}` : 'Dakar') }}
              </div>
            </div>
          </div>

          <form @submit.prevent="submitDemande" class="form">
            <div class="form-group">
              <label>Nom complet</label>
              <input type="text" v-model="form.nom" placeholder="Votre nom" required />
            </div>

            <div class="form-group">
              <label>Téléphone WhatsApp</label>
              <input type="tel" v-model="form.telephone" placeholder="+221 77 123 45 67" required />
            </div>

            <div class="form-group">
              <label>Date souhaitée</label>
              <input type="date" v-model="form.date" required />
            </div>

            <div class="form-group">
              <label>Heure souhaitée</label>
              <select v-model="form.heure" required>
                <option value="">Choisir une heure</option>
                <option value="09:00">09:00 - Matin</option>
                <option value="14:00">14:00 - Après-midi</option>
                <option value="17:00">17:00 - Soir</option>
              </select>
            </div>

            <div class="form-group">
              <label>Message (optionnel)</label>
              <textarea
                v-model="form.message"
                placeholder="Informations complémentaires..."
                rows="4"
              ></textarea>
            </div>

            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Envoi...' : 'Envoyer la demande' }}
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
import { useVisitesLocataireStore } from '@/stores/visitesLocataire.store'
import { useToast } from 'vue-toastification'
import HeaderPublic from '@/components/layout/HeaderPublic.vue'
import HeaderLocataire from '@/components/layout/HeaderLocataire.vue'
import { useAuthStore } from '@/stores/auth.store'
import { visitesLocataireService } from '@/services/visites-locataire.service'

const route = useRoute()
const router = useRouter()
const biensStore = useBiensPublicsStore()
const visitesStore = useVisitesLocataireStore()
const toast = useToast()

const bien = ref(null)
const isSubmitting = ref(false)

const form = reactive({
  nom: '',
  telephone: '',
  date: '',
  heure: '',
  message: '',
})

const authStore = useAuthStore()

onMounted(async () => {
  await biensStore.chargerBiens({ page: 0, size: 20 })
  bien.value = biensStore.biens.find((b) => String(b.id) === String(route.params.id)) || null
})

const submitDemande = async () => {
  isSubmitting.value = true
  try {
    const idLocataire = authStore.user?.id ?? Number(import.meta.env.VITE_DEV_LOCATAIRE_ID) || 3
    await visitesLocataireService.demander(idLocataire, Number(bien.value.id))
    toast.success('Demande de visite envoyée')
    router.push({ name: 'succes-visite', params: { bienId: bien.value.id } })
  } catch (error) {
    toast.error(error.response?.data?.message || "Erreur lors de l'envoi de la demande")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.demande-visite {
  min-height: 100vh;
  background-color: #f9fafb;
}

.page-content {
  padding: 40px 0 80px;
}

.container {
  max-width: 700px;
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
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 32px;
}

.bien-image {
  width: 80px;
  height: 80px;
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
}

.form {
  display: flex;
  flex-direction: column;
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
  margin-top: 8px;
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
}
</style>
