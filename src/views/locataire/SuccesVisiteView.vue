<template>
  <div class="succes-visite">
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

      <h1 class="success-title">Demande envoyée !</h1>
      <p class="success-message">
        {{ route.query.message || 'Votre demande est en liste d\'attente de confirmation par le gestionnaire.' }}
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
        Réponse estimée sous 24h
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

        <div class="label" style="margin-top: 20px">Gestionnaire</div>
        <div class="gestionnaire-info">
          <div>{{ gestionnaire.nom }} · {{ gestionnaire.telephone }}</div>
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
        Suivre ma demande dans "Mes locations" →
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
.succes-visite {
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

.gestionnaire-info {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
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
  display: inline-block;
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;
}

.link-dashboard:hover {
  opacity: 0.7;
}
</style>
