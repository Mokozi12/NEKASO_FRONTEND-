<template>
  <div class="gestionnaire-login-layout">
    
    <div class="brand-panel">
      <div class="brand-content">
        <h1 class="brand-title">
          Gérez votre patrimoine <span class="text-success">immobilier</span> en toute simplicité.
        </h1>
        <p class="brand-subtitle">
          Suivi des biens, contrats, paiements Mobile Money — tout centralisé dans une seule plateforme.
        </p>

        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-value">500+</div>
            <div class="stat-label">Biens gérés</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">98%</div>
            <div class="stat-label">Taux de recouvrement</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">3x</div>
            <div class="stat-label">Gain de productivité</div>
          </div>
        </div>
      </div>
    </div>

    
    <div class="login-panel">
      
      <router-link to="/" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Retour au site
      </router-link>

      <div class="login-container">
        <div class="app-logo">
          <img src="/logo-nekaso.png?v=2" alt="NEKASO" class="login-logo" />
        </div>

        <h2 class="login-title">Connexion</h2>
        <p class="login-subtitle">Entrez vos identifiants pour accéder à votre espace.</p>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>Numéro de téléphone</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </span>
              <span class="phone-prefix">+221</span>
              <input type="tel" v-model="loginForm.telephone" placeholder="77 000 00 00" required />
            </div>
          </div>

          <div class="form-group">
            <div class="label-row">
              <label>Mot de passe</label>
              <a href="#" class="forgot-link" @click.prevent="openResetModal">Mot de passe oublié ?</a>
            </div>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
              <input :type="showPassword ? 'text' : 'password'" v-model="loginForm.motDePasse" placeholder="••••••••" required />
              <button type="button" class="btn-eye" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-submit" :disabled="authStore.isLoading">
            {{ authStore.isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
      </div>
    </div>

    
    <div v-if="isResetModalOpen" class="modal-overlay" @click.self="closeResetModal">
      <div class="reset-modal">
        
        <div class="reset-modal-header">
          <button class="btn-close" @click="closeResetModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <div class="reset-subtitle">RÉINITIALISATION</div>
          <h3 class="reset-title">Mot de passe oublié</h3>
          
          <div class="reset-stepper">
            
            <div class="step-pill" :class="{ 'step-active': resetStep === 1, 'step-done': resetStep > 1 }">
              <svg v-if="resetStep > 1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Numéro
            </div>
            <div class="step-line"></div>
            
            <div class="step-pill" :class="{ 'step-active': resetStep === 2, 'step-done': resetStep > 2, 'step-pending': resetStep < 2 }">
              <svg v-if="resetStep > 2" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Vérification
            </div>
            <div class="step-line"></div>
            
            <div class="step-pill" :class="{ 'step-active': resetStep === 3, 'step-pending': resetStep < 3 }">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
              Nouveau MDP
            </div>
          </div>
        </div>

        
        <div class="reset-modal-body">
          
          <div v-if="resetStep === 1" class="step-content">
            <p class="step-desc">Entrez votre numéro de téléphone. Vous recevrez un code SMS à 6 chiffres.</p>
            
            <div class="form-group">
              <label>Numéro de téléphone</label>
              <div class="input-wrapper">
                <span class="phone-prefix-grey">+221</span>
                <input type="tel" v-model="resetForm.telephone" placeholder="77 000 00 00" />
              </div>
            </div>

            <button class="btn-submit mt-4" :disabled="!resetForm.telephone" @click="goToStep(2)">Envoyer le code</button>
          </div>

          
          <div v-if="resetStep === 2" class="step-content">
            <p class="step-desc">Un code à 6 chiffres a été envoyé au <strong>{{ resetForm.telephone }}</strong>.</p>
            
            <div class="otp-inputs">
              <input v-for="(digit, idx) in 6" :key="idx" type="text" maxlength="1" class="otp-box" @input="moveToNextBox(idx, $event)" v-model="resetForm.otp[idx]" />
            </div>

            <button class="btn-submit btn-grey mt-4" :class="{ 'btn-active': isOtpComplete }" :disabled="!isOtpComplete" @click="goToStep(3)">Vérifier le code</button>
            <button class="btn-text mt-3" @click="goToStep(1)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Changer de numéro
            </button>
          </div>

          
          <div v-if="resetStep === 3" class="step-content">
            <p class="step-desc">Choisissez un nouveau mot de passe sécurisé pour votre compte.</p>
            
            <div class="form-group mb-3">
              <label>Nouveau mot de passe</label>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input :type="showResetPassword1 ? 'text' : 'password'" v-model="resetForm.newPassword" placeholder="••••••••" />
                <button type="button" class="btn-eye" @click="showResetPassword1 = !showResetPassword1">
                  <svg v-if="!showResetPassword1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>Confirmer le mot de passe</label>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input :type="showResetPassword2 ? 'text' : 'password'" v-model="resetForm.confirmPassword" placeholder="••••••••" />
                <button type="button" class="btn-eye" @click="showResetPassword2 = !showResetPassword2">
                  <svg v-if="!showResetPassword2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                </button>
              </div>
            </div>

            <button class="btn-submit btn-grey mt-4" :class="{ 'btn-active': isPasswordsMatch }" :disabled="!isPasswordsMatch" @click="finishReset">Réinitialiser le mot de passe</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const loginForm = reactive({
  telephone: '',
  motDePasse: '',
})
const showPassword = ref(false)

const handleLogin = async () => {
  if (!loginForm.telephone || !loginForm.motDePasse) {
    toast.error('Veuillez remplir tous les champs')
    return
  }

  const result = await authStore.login(loginForm.telephone, loginForm.motDePasse)

  if (result.success) {
    if (result.user.role === 'GESTIONNAIRE') {
      toast.success('Connexion réussie')
      router.push('/gestionnaire/dashboard')
    } else {
      toast.error('Ce compte n\'est pas un compte gestionnaire.')
      authStore.logout()
    }
  } else {
    toast.error(result.error || 'Erreur de connexion')
  }
}

const isResetModalOpen = ref(false)
const resetStep = ref(1)

const resetForm = reactive({
  telephone: '',
  otp: ['', '', '', '', '', ''],
  newPassword: '',
  confirmPassword: ''
})

const showResetPassword1 = ref(false)
const showResetPassword2 = ref(false)

const openResetModal = () => {
  resetStep.value = 1
  resetForm.telephone = loginForm.telephone
  resetForm.otp = ['', '', '', '', '', '']
  resetForm.newPassword = ''
  resetForm.confirmPassword = ''
  isResetModalOpen.value = true
}

const closeResetModal = () => {
  isResetModalOpen.value = false
}

const goToStep = (step) => {
  resetStep.value = step
}

const isOtpComplete = computed(() => {
  return resetForm.otp.every(d => d !== '')
})

const moveToNextBox = (idx, event) => {
  const value = event.target.value
  if (value && idx < 5) {
    const nextInput = event.target.nextElementSibling
    if (nextInput) nextInput.focus()
  }
}

const isPasswordsMatch = computed(() => {
  return resetForm.newPassword && resetForm.newPassword === resetForm.confirmPassword
})

const finishReset = () => {
  if (isPasswordsMatch.value) {
    toast.success('Mot de passe réinitialisé avec succès !')
    closeResetModal()
    loginForm.motDePasse = resetForm.newPassword
  }
}

</script>

<style scoped>
.gestionnaire-login-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}


.brand-panel {
  flex: 1;
  background-color: #111827; 
  color: #ffffff;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.brand-content {
  max-width: 500px;
  margin: 0 auto;
}

.brand-title {
  font-size: 40px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 24px;
}

.text-success {
  color: #22c55e;
}

.brand-subtitle {
  font-size: 16px;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 80px;
}

.stats-container {
  display: flex;
  gap: 40px;
  margin-top: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #22c55e;
}

.stat-label {
  font-size: 13px;
  color: #94a3b8;
}


.login-panel {
  flex: 1;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
}

.back-link {
  position: absolute;
  top: 40px;
  right: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.back-link:hover {
  color: #1e293b;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.app-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.login-logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 10px 15px rgba(30, 41, 59, 0.12));
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 32px;
}


.login-form {
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
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-size: 13px;
  color: #22c55e;
  text-decoration: none;
  font-weight: 500;
}

.forgot-link:hover {
  text-decoration: underline;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: #f1f5f9;
  border: 1px solid transparent;
  border-radius: 8px;
  transition: all 0.2s;
  height: 48px;
  overflow: hidden;
}

.input-wrapper:focus-within {
  border-color: #22c55e;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  color: #94a3b8;
}

.phone-prefix {
  font-weight: 500;
  font-size: 14px;
  color: #475569;
  padding-right: 8px;
}

.phone-prefix-grey {
  padding-left: 16px;
  padding-right: 8px;
  font-weight: 500;
  font-size: 14px;
  color: #64748b;
}

.input-wrapper input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0 12px 0 0;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  height: 100%;
}

.input-wrapper input::placeholder {
  color: #94a3b8;
}

.btn-eye {
  background: none;
  border: none;
  color: #94a3b8;
  width: 48px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-eye:hover {
  color: #475569;
}


.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1e293b; 
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0 24px;
  height: 48px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #0f172a;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-grey {
  background-color: #94a3b8;
}

.btn-grey.btn-active {
  background-color: #1e293b;
}

.btn-text {
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: color 0.2s;
}

.btn-text:hover {
  color: #1e293b;
}

.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 24px; }
.mb-3 { margin-bottom: 16px; }


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.reset-modal {
  width: 100%;
  max-width: 480px;
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.reset-modal-header {
  background-color: #1e293b;
  padding: 24px 32px;
  color: #ffffff;
  position: relative;
}

.btn-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #ffffff;
}

.reset-subtitle {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.reset-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
}

.reset-stepper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.step-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
}

.step-active {
  background-color: #334155;
  color: #ffffff;
}

.step-done {
  background-color: #22c55e;
  color: #ffffff;
}

.step-line {
  flex: 1;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.1);
}

.reset-modal-body {
  padding: 32px;
}

.step-desc {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
  line-height: 1.5;
}

.otp-inputs {
  display: flex;
  gap: 8px;
  justify-content: space-between;
}

.otp-box {
  width: 48px;
  height: 56px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  background-color: #ffffff;
  transition: all 0.2s;
}

.otp-box:focus {
  border-color: #22c55e;
  outline: none;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

@media (max-width: 900px) {
  .gestionnaire-login-layout {
    flex-direction: column;
  }
  .brand-panel {
    padding: 40px 20px;
    align-items: center;
    text-align: center;
  }
  .stats-container {
    justify-content: center;
  }
  .login-panel {
    padding: 40px 20px;
  }
}
</style>
