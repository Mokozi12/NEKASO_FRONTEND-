<template>
  <div class="auth-layout">
    <HeaderPublic />

    <div class="auth-content">
      <!-- BANNER contextuel -->
      <div v-if="authStore.pendingAction" class="alert-banner">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
          ></path>
        </svg>
        Inscription rapide (&lt; 1 min) — votre demande sera traitée juste après.
      </div>

      <div class="auth-card">
        <!-- TABS -->
        <div class="tabs">
          <button
            class="tab"
            :class="{ 'tab-active': activeTab === 'login' }"
            @click="switchTab('login')"
          >
            Connexion
          </button>
          <button
            class="tab"
            :class="{ 'tab-active': activeTab === 'register' }"
            @click="switchTab('register')"
          >
            Inscription
          </button>
        </div>

        <div class="auth-body">
          <!-- ═══════════ LOGIN ═══════════ -->
          <div v-if="activeTab === 'login'">
            <h1 class="auth-title">Bon retour !</h1>
            <p class="auth-subtitle">Connectez-vous à votre compte NEKASO</p>

            <form @submit.prevent="handleLogin" class="auth-form">
              <div class="form-group">
                <label>Téléphone</label>
                <div class="input-wrapper">
                  <span class="input-prefix">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                      ></path>
                    </svg>
                    <span>+221</span>
                  </span>
                  <input
                    type="tel"
                    v-model="loginForm.telephone"
                    placeholder="77 123 45 67"
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Mot de passe</label>
                <div class="input-wrapper">
                  <span class="input-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="loginForm.motDePasse"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" class="eye-toggle" @click="showPassword = !showPassword">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        v-if="showPassword"
                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                      ></path>
                      <line v-if="showPassword" x1="1" y1="1" x2="23" y2="23"></line>
                      <path v-else d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle v-if="!showPassword" cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="lien-mdp-row">
                <a href="#" class="lien-mdp" @click.prevent="ouvrirMdpModal"
                  >Mot de passe oublié ?</a
                >
              </div>

              <button type="submit" class="btn-submit" :disabled="authStore.isLoading">
                {{ authStore.isLoading ? 'Connexion...' : 'Se connecter' }}
                <svg
                  v-if="!authStore.isLoading"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>
          </div>

          <!-- ═══════════ REGISTER (rôle toujours LOCATAIRE) ═══════════ -->
          <div v-if="activeTab === 'register'">
            <div class="step-indicator">
              <div
                class="step"
                :class="{ 'step-active': currentStep === 1, 'step-completed': currentStep > 1 }"
              >
                <span class="step-circle">
                  <svg
                    v-if="currentStep > 1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span v-else>1</span>
                </span>
              </div>
              <div class="step-line" :class="{ 'line-completed': currentStep > 1 }"></div>
              <div
                class="step"
                :class="{ 'step-active': currentStep === 2, 'step-completed': currentStep > 2 }"
              >
                <span class="step-circle">
                  <svg
                    v-if="currentStep > 2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span v-else>2</span>
                </span>
              </div>
            </div>

            <!-- Étape 1 : Identité -->
            <div v-if="currentStep === 1" class="step-content">
              <h2 class="auth-title">Créez votre compte</h2>
              <p class="auth-subtitle">Rejoignez NEKASO en quelques secondes</p>
              <form @submit.prevent="submitStep1" class="auth-form">
                <div class="form-row">
                  <div class="form-group">
                    <label>Prénom</label>
                    <div class="input-wrapper">
                      <span class="input-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </span>
                      <input type="text" v-model="registerForm.prenom" placeholder="Aminata" required />
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Nom</label>
                    <div class="input-wrapper">
                      <span class="input-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </span>
                      <input type="text" v-model="registerForm.nom" placeholder="Diop" required />
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label>Téléphone WhatsApp</label>
                  <div class="input-wrapper">
                    <span class="input-prefix">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                        ></path>
                      </svg>
                      <span>+221</span>
                    </span>
                    <input
                      type="tel"
                      v-model="registerForm.telephone"
                      placeholder="77 123 45 67"
                      required
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label>Mot de passe</label>
                  <div class="input-wrapper">
                    <span class="input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </span>
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      v-model="registerForm.motDePasse"
                      placeholder="Minimum 8 caractères"
                      required
                    />
                    <button type="button" class="eye-toggle" @click="showPassword = !showPassword">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <label>Confirmer le mot de passe</label>
                  <div class="input-wrapper">
                    <span class="input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </span>
                    <input
                      :type="showConfirmPassword ? 'text' : 'password'"
                      v-model="registerForm.confirmPassword"
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" class="eye-toggle" @click="showConfirmPassword = !showConfirmPassword">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </div>
                </div>
                <button type="submit" class="btn-submit" :disabled="authStore.isLoading">
                  Continuer
                  <svg
                    v-if="!authStore.isLoading"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </form>
            </div>

            <!-- Étape 2 : Vérification -->
            <div v-if="currentStep === 2" class="step-content text-center">
              <div class="wa-bubble">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                  ></path>
                </svg>
              </div>
              <h2 class="auth-title">Vérification WhatsApp</h2>
              <p class="auth-subtitle">Code envoyé au +221 {{ registerForm.telephone }}</p>
              <p class="demo-code-hint">Code démo : <strong>{{ codeDemo }}</strong></p>
              <div class="code-inputs">
                <input
                  v-for="(digit, index) in 4"
                  :key="index"
                  type="text"
                  maxlength="1"
                  class="code-input"
                  v-model="registerForm.code[index]"
                  @input="handleCodeInput(index, $event)"
                  @keydown="handleCodeKeydown(index, $event)"
                  :ref="
                    (el) => {
                      if (el) codeInputRefs[index] = el
                    }
                  "
                />
              </div>
              <button
                class="btn-submit"
                @click="submitStep2"
                :disabled="!isCodeComplete || authStore.isLoading"
              >
                Vérifier
              </button>
              <div class="resend-link">
                Pas reçu ? <a href="#" @click.prevent="resendCode" class="link-bold">Renvoyer</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- extracted Forgot Password modal -->
    <ForgotPasswordModal v-model="showMdpModal" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from 'vue-toastification'
import HeaderPublic from '@/components/layout/HeaderPublic.vue'
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const activeTab = ref('login')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const currentStep = ref(1)
const codeInputRefs = ref([])
const codeDemo = ref('1234')

const loginForm = reactive({ telephone: '', motDePasse: '' })

const registerForm = reactive({
  nom: '',
  prenom: '',
  telephone: '',
  code: ['', '', '', ''],
  motDePasse: '',
  confirmPassword: '',
})

const isCodeComplete = computed(() => registerForm.code.every((d) => d.length === 1))

// ── Mot de passe oublié (external component) ─────────────────
const showMdpModal = ref(false)
function ouvrirMdpModal() {
  showMdpModal.value = true
}

// ── Auth ────────────────────────────────────────────────────
onMounted(() => {
  if (authStore.pendingAction) activeTab.value = 'register'
})

function switchTab(tab) {
  activeTab.value = tab
}

function handlePostAuthRedirect(role) {
  if (authStore.pendingAction) {
    router.push(`/locataire/biens/${authStore.pendingAction.bienId}`)
  } else if (role === 'GESTIONNAIRE') {
    router.push('/gestionnaire/dashboard')
  } else {
    router.push('/locataire/mes-locations')
  }
}

async function handleLogin() {
  if (!loginForm.telephone || !loginForm.motDePasse) {
    toast.error('Veuillez remplir tous les champs')
    return
  }
  const result = await authStore.login(loginForm.telephone, loginForm.motDePasse)
  if (result.success) {
    toast.success('Connexion réussie')
    handlePostAuthRedirect(result.user.role)
  } else {
    toast.error(result.error || 'Erreur de connexion')
  }
}

async function submitStep1() {
  if (!registerForm.prenom || !registerForm.nom || !registerForm.telephone) {
    toast.error('Veuillez remplir tous les champs')
    return
  }
  if (registerForm.motDePasse.length < 8) {
    toast.error('Le mot de passe doit contenir au moins 8 caractères')
    return
  }
  if (registerForm.motDePasse !== registerForm.confirmPassword) {
    toast.error('Les mots de passe ne correspondent pas')
    return
  }
  toast.info('Code envoyé au +221 ' + registerForm.telephone)
  currentStep.value = 2
  setTimeout(() => {
    if (codeInputRefs.value[0]) codeInputRefs.value[0].focus()
  }, 100)
}

async function submitStep2() {
  if (!isCodeComplete.value) return
  const result = await authStore.register(
    registerForm.nom,
    registerForm.prenom,
    registerForm.telephone,
    registerForm.motDePasse,
  )
  if (result.success) {
    toast.success('Compte créé avec succès')
    handlePostAuthRedirect('LOCATAIRE')
  } else {
    toast.error(result.error || 'Erreur lors de la création du compte')
  }
}

function resendCode() {
  toast.info('Code renvoyé par WhatsApp')
}

function handleCodeInput(index, event) {
  const val = event.target.value.replace(/\D/g, '').slice(0, 1)
  registerForm.code[index] = val
  if (val && index < 3) codeInputRefs.value[index + 1]?.focus()
}

function handleCodeKeydown(index, event) {
  if (event.key === 'Backspace' && !registerForm.code[index] && index > 0) {
    codeInputRefs.value[index - 1]?.focus()
  }
}
</script>

<style scoped>
/* ── Layout ───────────────────────────────────────────────── */
.auth-layout {
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
}

.auth-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
}

/* ── Banner ───────────────────────────────────────────────── */
.alert-banner {
  background-color: #fff7ed;
  border: 1px solid #fdba74;
  color: #c2410c;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
  width: 100%;
  max-width: 480px;
}

/* ── Card ─────────────────────────────────────────────────── */
.auth-card {
  width: 100%;
  max-width: 480px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* ── Tabs ─────────────────────────────────────────────────── */
.tabs {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
}

.tab {
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-active {
  color: #1e293b;
  border-bottom-color: #22c55e;
}

.tab:hover:not(.tab-active) {
  color: #475569;
}

/* ── Body ─────────────────────────────────────────────────── */
.auth-body {
  padding: 32px 40px 40px;
}

.auth-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.auth-subtitle {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
}

.demo-code-hint {
  font-size: 13px;
  color: #b45309;
  background-color: #fffbeb;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 24px;
}

/* ── Form ─────────────────────────────────────────────────── */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 12px;
}

.form-row .form-group {
  flex: 1;
  min-width: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s;
}

.input-wrapper:focus-within {
  border-color: #22c55e;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.input-prefix {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
  border-right: 1px solid #e2e8f0;
  white-space: nowrap;
}

.input-icon {
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: #94a3b8;
  flex-shrink: 0;
}

.input-wrapper input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  min-width: 0;
}

.input-wrapper input::placeholder {
  color: #94a3b8;
}

.eye-toggle {
  background: none;
  border: none;
  padding: 0 12px;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.eye-toggle:hover {
  color: #64748b;
}

/* ── Mot de passe oublié lien ─────────────────────────────── */
.lien-mdp-row {
  display: flex;
  justify-content: flex-end;
  margin-top: -8px;
}

.lien-mdp {
  font-size: 13px;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.lien-mdp:hover {
  color: #1e293b;
  text-decoration: underline;
}

/* ── Button ───────────────────────────────────────────────── */
.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #1e293b;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #0f172a;
}
.btn-submit.btn-success {
  background-color: #22c55e;
}
.btn-submit.btn-success:hover:not(:disabled) {
  background-color: #16a34a;
}
.btn-submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* ── Step indicator (inscription) ─────────────────────────── */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
}

.step {
  display: flex;
  align-items: center;
}

.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #f1f5f9;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.step-active .step-circle {
  background-color: #1e293b;
  color: #fff;
}
.step-completed .step-circle {
  background-color: #22c55e;
  color: #fff;
}

.step-line {
  width: 40px;
  height: 2px;
  background-color: #e2e8f0;
  margin: 0 8px;
  transition: background-color 0.3s;
  flex-shrink: 0;
}

.line-completed {
  background-color: #22c55e;
}

.step-content {
  animation: fadeInUp 0.25s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── WhatsApp bubble ──────────────────────────────────────── */
.wa-bubble {
  width: 56px;
  height: 56px;
  background-color: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #22c55e;
}

.text-center {
  text-align: center;
}

/* ── Code inputs ──────────────────────────────────────────── */
.code-inputs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 28px 0;
  flex-wrap: wrap;
}

.code-input {
  width: 44px;
  height: 52px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  color: #0f172a;
  background-color: #f8fafc;
  transition: all 0.2s;
  outline: none;
}

.code-input:focus {
  border-color: #22c55e;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
}

.resend-link {
  margin-top: 20px;
  font-size: 13px;
  color: #64748b;
}
.link-bold {
  color: #1e293b;
  font-weight: 700;
  text-decoration: none;
}
.link-bold:hover {
  text-decoration: underline;
}

/* ══════════════ MODAL MOT DE PASSE OUBLIÉ ══════════════════ */
.mdp-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.mdp-modal {
  width: 100%;
  max-width: 480px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.25s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* En-tête sombre */
.mdp-header {
  background: linear-gradient(135deg, #1a2e4a 0%, #1e3a5f 100%);
  padding: 28px 28px 24px;
  position: relative;
  color: #fff;
}

.mdp-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.12);
  border: none;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}

.mdp-close:hover {
  background: rgba(255, 255, 255, 0.22);
}

.mdp-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: #94a3b8;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.mdp-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 24px;
}

/* Steps pills */
.mdp-steps {
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap;
  gap: 4px;
}

.mdp-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
}

.pill-idle {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.55);
}

.pill-active {
  background: #1e293b;
  border: 1px solid #1e293b;
  color: #fff;
}

.pill-done {
  background: #22c55e;
  border: 1px solid #22c55e;
  color: #fff;
}

.mdp-line-sep {
  width: 20px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
  transition: background 0.2s;
}

.sep-done {
  background: #22c55e;
}

/* Corps blanc */
.mdp-body {
  background: #fff;
  padding: 28px;
}

.mdp-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 4px;
}

.mdp-code-inputs {
  gap: 8px;
}

.lien-retour {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 13px;
  cursor: pointer;
  margin-top: 16px;
  padding: 0;
  transition: color 0.2s;
}

.lien-retour:hover {
  color: #1e293b;
}

/* ══════════════ RESPONSIVE ══════════════════════════════════ */
@media (max-width: 520px) {
  .form-row {
    flex-direction: column;
    gap: 20px;
  }

  .auth-content {
    padding: 20px 12px;
  }

  .auth-card {
    border-radius: 10px;
  }

  .auth-body {
    padding: 24px 20px 28px;
  }

  .tab {
    padding: 14px 8px;
    font-size: 13px;
  }

  .step-line {
    width: 24px;
  }

  .code-input {
    width: 38px;
    height: 46px;
    font-size: 18px;
  }

  .mdp-modal {
    border-radius: 12px;
  }

  .mdp-header {
    padding: 22px 20px 20px;
  }

  .mdp-body {
    padding: 20px;
  }

  .mdp-title {
    font-size: 18px;
  }

  .mdp-pill {
    padding: 5px 10px;
    font-size: 12px;
  }

  .mdp-line-sep {
    width: 10px;
  }

  .mdp-code-inputs {
    gap: 6px;
  }

  .mdp-code-inputs .code-input {
    width: 36px;
    height: 42px;
    font-size: 16px;
  }
}

@media (max-width: 360px) {
  .code-input {
    width: 32px;
    height: 40px;
    font-size: 16px;
  }

  .mdp-pill {
    padding: 4px 8px;
    font-size: 11px;
  }
}
</style>
