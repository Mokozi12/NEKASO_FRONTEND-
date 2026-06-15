<template>
  <div class="succes-location">
    <div class="success-container">
      <div class="success-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>

      <h1 class="success-title">Demande de location envoyée !</h1>
      <p class="success-message">
        Votre dossier est <strong>en attente de validation par le gestionnaire</strong>. Vous
        recevrez une notification dès qu'une décision sera prise.
      </p>
      <div class="success-time">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        Réponse estimée sous 48h
      </div>

      <div class="bien-info-card" v-if="bien">
        <div class="label">Bien concerné</div>
        <div class="bien-details">
          <img :src="bien.photos?.[0]" :alt="bien.titre" class="bien-thumb" />
          <div>
            <div class="bien-titre">{{ bien.titre }}</div>
            <div class="bien-location">{{ bien.adresse?.quartier }}, {{ bien.adresse?.ville }}</div>
          </div>
        </div>

        <div class="timeline-steps">
          <div class="step completed">
            <div class="step-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div class="step-label">Demande envoyée</div>
            <div class="step-time">Aujourd'hui</div>
          </div>

          <div class="step-line"></div>

          <div class="step current">
            <div class="step-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div class="step-label">En attente de validation</div>
            <div class="step-time">Le gestionnaire étudie votre dossier</div>
          </div>

          <div class="step-line"></div>

          <div class="step pending">
            <div class="step-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <div class="step-label">Validation et signature</div>
            <div class="step-time">Vous serez contacté pour finaliser</div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="btn-whatsapp" @click="contacterWhatsApp">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            ></path>
          </svg>
          Contacter via WhatsApp
        </button>

        <button class="btn-call" @click="appeler">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            ></path>
          </svg>
          Appeler
        </button>
      </div>

      <router-link to="/locataire/mes-locations" class="link-dashboard">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        </svg>
        Suivre ma demande dans le tableau de bord →
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const bien = ref(null)
const gestionnaire = ref({
  nom: 'Mme Diop',
  telephone: '+221 77 123 45 67',
})

const contacterWhatsApp = () => {
  const tel = gestionnaire.value.telephone.replace(/\s/g, '')
  const win = window.open(`https://wa.me/${tel}`, '_blank')
  if (win) win.opener = null
}

const appeler = () => {
  window.location.href = `tel:${gestionnaire.value.telephone}`
}
</script>

<style scoped>
.succes-location {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: #f8fafc;
}

.success-container {
  max-width: 600px;
  width: 100%;
  padding: 48px 40px;
  text-align: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #d1fae5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.success-icon svg {
  stroke: #22c55e;
}

.success-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

.success-message {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 16px;
}

.success-time {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 32px;
}

.success-time svg {
  stroke: #9ca3af;
}

.bien-info-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  text-align: left;
  margin-bottom: 24px;
}

.label {
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.bien-details {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
}

.bien-thumb {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
}

.bien-titre {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.bien-location {
  font-size: 13px;
  color: #6b7280;
}

.timeline-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-top: 1px solid #e5e7eb;
  padding-top: 24px;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: #e5e7eb;
  color: #9ca3af;
}

.step.completed .step-icon {
  background-color: #22c55e;
  color: white;
}

.step.current .step-icon {
  background-color: #fef3c7;
  color: #d97706;
}

.step-label {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2px;
}

.step-time {
  font-size: 12px;
  color: #6b7280;
}

.step-line {
  width: 2px;
  height: 20px;
  background-color: #e5e7eb;
  margin-left: 15px;
}

.actions {
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-bottom: 24px;
}

.btn-whatsapp,
.btn-call {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-whatsapp {
  background-color: #22c55e;
  color: white;
}

.btn-whatsapp:hover {
  background-color: #16a34a;
}

.btn-call {
  background-color: transparent;
  border: 1px solid #e5e7eb;
  color: #1f2937;
}

.btn-call:hover {
  background-color: #f9fafb;
}

.link-dashboard {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;
}

.link-dashboard:hover {
  opacity: 0.7;
}

.link-dashboard svg {
  stroke: currentColor;
}
</style>
