<!--
  ForgotPasswordModal — réinitialisation du mot de passe (design maquette, 2 étapes) :
    1. Numéro       : téléphone + nouveau mot de passe + confirmation → « Envoyer le code »
    2. Vérification : code à 4 chiffres (code démo : 1234) → « Vérifier le code »
-->
<template>
  <Teleport to="body">
    <div v-if="modelValue" class="mdp-overlay" @click.self="close">
      <div class="mdp-modal" role="dialog" aria-modal="true">
        <div class="mdp-header">
          <button class="mdp-close" @click="close" aria-label="Fermer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <p class="mdp-label">RÉINITIALISATION</p>
          <h2 class="mdp-title">Mot de passe oublié</h2>
          <div class="mdp-steps">
            <div class="mdp-pill" :class="mdpStep === 1 ? 'pill-active' : 'pill-done'">
              <svg v-if="mdpStep > 1" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>Numéro</span>
            </div>
            <div class="mdp-line-sep" :class="{ 'sep-done': mdpStep > 1 }"></div>
            <div class="mdp-pill" :class="mdpStep === 2 ? 'pill-active' : 'pill-idle'">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Vérification</span>
            </div>
          </div>
        </div>

        <div class="mdp-body">
          <!-- Étape 1 : Numéro + nouveau mot de passe -->
          <template v-if="mdpStep === 1">
            <p class="mdp-desc">Entrez votre numéro. Vous recevrez un code de vérification à 4 chiffres.</p>

            <div class="form-group" style="margin-top: 20px">
              <label>Numéro de téléphone</label>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                <input type="tel" v-model="mdpForm.telephone" placeholder="+221 77 000 00 00" />
              </div>
            </div>

            <div class="form-group" style="margin-top: 16px">
              <label>Mot de passe</label>
              <div class="input-wrapper">
                <span class="input-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></span>
                <input :type="showMdpPwd ? 'text' : 'password'" v-model="mdpForm.newPassword" placeholder="Minimum 8 caractères" />
                <button type="button" class="eye-toggle" @click="showMdpPwd = !showMdpPwd">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              </div>
            </div>

            <div class="form-group" style="margin-top: 16px">
              <label>Confirmer le mot de passe</label>
              <div class="input-wrapper">
                <span class="input-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></span>
                <input :type="showMdpPwd2 ? 'text' : 'password'" v-model="mdpForm.confirmPassword" placeholder="••••••••" />
                <button type="button" class="eye-toggle" @click="showMdpPwd2 = !showMdpPwd2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              </div>
            </div>

            <button class="btn-submit" @click="sendCode" :disabled="!peutEnvoyer">Envoyer le code</button>
          </template>

          <!-- Étape 2 : Vérification -->
          <template v-else>
            <p class="mdp-desc">Code envoyé au <strong>{{ mdpForm.telephone }}</strong>.</p>
            <p class="demo-code-hint">Code démo : <strong>{{ codeDemo }}</strong></p>
            <div class="code-inputs">
              <input
                v-for="(d, i) in 4"
                :key="i"
                type="text"
                maxlength="1"
                class="code-input"
                v-model="mdpForm.code[i]"
                @input="handleMdpCodeInput(i, $event)"
                @keydown="handleMdpCodeKeydown(i, $event)"
                :ref="(el) => { if (el) mdpCodeRefs[i] = el }"
              />
            </div>
            <button class="btn-submit" @click="verifyCode" :disabled="!mdpCodeComplete">Vérifier le code</button>
            <button type="button" class="lien-retour" @click="mdpStep = 1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Changer de numéro
            </button>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useToast } from 'vue-toastification'

defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])

const toast = useToast()

const mdpStep = ref(1)
const showMdpPwd = ref(false)
const showMdpPwd2 = ref(false)
const mdpCodeRefs = ref([])
const codeDemo = ref('1234')

const mdpForm = reactive({
  telephone: '',
  code: ['', '', '', ''],
  newPassword: '',
  confirmPassword: '',
})

const peutEnvoyer = computed(
  () =>
    !!mdpForm.telephone &&
    mdpForm.newPassword.length >= 8 &&
    mdpForm.newPassword === mdpForm.confirmPassword,
)
const mdpCodeComplete = computed(() => mdpForm.code.every((d) => d.length === 1))

function close() {
  emit('update:modelValue', false)
}

function sendCode() {
  if (!mdpForm.telephone) {
    toast.error('Saisissez votre numéro de téléphone')
    return
  }
  if (mdpForm.newPassword.length < 8) {
    toast.error('Le mot de passe doit contenir au moins 8 caractères')
    return
  }
  if (mdpForm.newPassword !== mdpForm.confirmPassword) {
    toast.error('Les mots de passe ne correspondent pas')
    return
  }
  toast.info('Code envoyé au ' + mdpForm.telephone)
  mdpStep.value = 2
  setTimeout(() => {
    if (mdpCodeRefs.value[0]) mdpCodeRefs.value[0].focus()
  }, 100)
}

function handleMdpCodeInput(index, event) {
  const val = event.target.value.replace(/\D/g, '').slice(0, 1)
  mdpForm.code[index] = val
  if (val && index < 3) mdpCodeRefs.value[index + 1]?.focus()
}

function handleMdpCodeKeydown(index, event) {
  if (event.key === 'Backspace' && !mdpForm.code[index] && index > 0) {
    mdpCodeRefs.value[index - 1]?.focus()
  }
}

function verifyCode() {
  if (!mdpCodeComplete.value) return
  toast.success('Mot de passe réinitialisé avec succès !')
  close()
}
</script>

<style scoped>
.mdp-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
}
.mdp-modal {
  width: 100%;
  max-width: 480px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}
.mdp-header {
  background: #1e293b;
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
.mdp-steps {
  display: flex;
  align-items: center;
  gap: 4px;
}
.mdp-line-sep {
  width: 28px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
  transition: background 0.3s;
}
.sep-done {
  background: #22c55e;
}
.mdp-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}
.pill-idle {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.55);
}
.pill-active {
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
}
.pill-done {
  background: #22c55e;
  border: 1px solid #22c55e;
  color: #fff;
}
.mdp-body {
  background: #fff;
  padding: 28px;
}
.mdp-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}
.demo-code-hint {
  font-size: 13px;
  color: #b45309;
  background-color: #fffbeb;
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 12px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
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
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
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
.input-icon {
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: #94a3b8;
  flex-shrink: 0;
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
.lien-retour {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 13px;
  cursor: pointer;
  margin-top: 16px;
  padding: 0;
  width: 100%;
  transition: color 0.2s;
}
.lien-retour:hover {
  color: #1e293b;
}
.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #1e293b;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 24px;
  transition: background-color 0.2s;
}
.btn-submit:hover:not(:disabled) {
  background-color: #0f172a;
}
.btn-submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.code-inputs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 28px 0 4px;
}
.code-input {
  width: 52px;
  height: 56px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  background-color: #f8fafc;
  outline: none;
  transition: all 0.2s;
}
.code-input:focus {
  border-color: #22c55e;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
}

@media (max-width: 520px) {
  .mdp-modal {
    border-radius: 12px;
  }
  .mdp-header {
    padding: 20px 16px 18px;
  }
  .mdp-body {
    padding: 20px 16px;
  }
  .mdp-title {
    font-size: 18px;
  }
  .code-input {
    width: 46px;
    height: 50px;
    font-size: 18px;
  }
}
</style>
