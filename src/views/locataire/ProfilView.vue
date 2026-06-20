<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Mon profil</h1>
        <p class="page-subtitle">Gérez vos informations personnelles</p>
      </div>

      <div class="carte">
        
        <div class="identite">
          <div class="avatar">{{ initiales }}</div>
          <div>
            <h2 class="nom">{{ form.prenom }} {{ form.nom }}</h2>
            <p class="profession">{{ form.profession || 'Locataire' }}</p>
            <p class="ville">{{ form.ville }}</p>
          </div>
        </div>

        <div class="champs">
          <div class="champ">
            <label>Nom complet</label>
            <div class="input-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
              <input v-model="nomComplet" :readonly="!edition" :class="{ ro: !edition }" />
            </div>
          </div>

          <div class="champ">
            <label>Téléphone WhatsApp</label>
            <div class="input-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              <input v-model="form.telephone" :readonly="!edition" :class="{ ro: !edition }" />
            </div>
          </div>

          <div class="champ">
            <label>Email</label>
            <div class="input-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></svg>
              <input v-model="form.email" :readonly="!edition" :class="{ ro: !edition }" />
            </div>
          </div>

          <div class="champ">
            <label>Profession</label>
            <div class="input-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
              <input v-model="form.profession" :readonly="!edition" :class="{ ro: !edition }" placeholder="—" />
            </div>
          </div>

          <div class="champ">
            <label>Ville</label>
            <div class="input-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              <input v-model="form.ville" :readonly="!edition" :class="{ ro: !edition }" />
            </div>
          </div>
        </div>

        <div class="actions">
          <template v-if="!edition">
            <button class="btn-foncé" @click="edition = true">Modifier mes informations</button>
          </template>
          <template v-else>
            <button class="btn-vert" @click="enregistrer">Enregistrer</button>
            <button class="btn-secondaire" @click="annuler">Annuler</button>
          </template>
        </div>
      </div>

      <button class="btn-deconnexion" @click="logout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
        Se déconnecter
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const authStore = useAuthStore()
const { succes } = useNotification()

const user = authStore.user
const form = reactive({
  prenom: user?.prenom || '',
  nom: user?.nom || '',
  telephone: user?.telephone || '',
  email: user?.email || '',
  profession: user?.profession || '',
  ville: user?.ville || 'Dakar',
})

const edition = ref(false)

const nomComplet = computed({
  get: () => `${form.prenom} ${form.nom}`.trim(),
  set: (v) => {
    const parts = v.trim().split(/\s+/)
    form.prenom = parts.shift() || ''
    form.nom = parts.join(' ')
  },
})

const initiales = computed(() =>
  `${form.prenom?.[0] || ''}${form.nom?.[0] || ''}`.toUpperCase() || 'NK',
)

function enregistrer() {
  if (authStore.user) {
    authStore.user.prenom = form.prenom
    authStore.user.nom = form.nom
    authStore.user.telephone = form.telephone
  }
  edition.value = false
  succes('Informations enregistrées.')
}
function annuler() {
  form.prenom = user?.prenom || ''
  form.nom = user?.nom || ''
  form.telephone = user?.telephone || ''
  form.email = user?.email || ''
  form.profession = user?.profession || ''
  form.ville = user?.ville || 'Dakar'
  edition.value = false
}
function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.page {
  padding: 40px 0 80px;
  background: #f4f6fa;
  min-height: calc(100vh - 70px);
}
.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 24px;
}
.page-header {
  margin-bottom: 24px;
}
.page-title {
  font-size: 30px;
  font-weight: 700;
  color: #1e293b;
}
.page-subtitle {
  font-size: 15px;
  color: #64748b;
  margin-top: 4px;
}
.carte {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}
.identite {
  display: flex;
  align-items: center;
  gap: 18px;
  padding-bottom: 22px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 22px;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #1e293b;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  flex-shrink: 0;
}
.nom {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}
.profession {
  font-size: 14px;
  color: #64748b;
}
.ville {
  font-size: 13px;
  color: #94a3b8;
}
.champs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.champ label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  margin-bottom: 6px;
}
.input-ic {
  position: relative;
  display: flex;
  align-items: center;
}
.input-ic svg {
  position: absolute;
  left: 12px;
  width: 17px;
  height: 17px;
  color: #94a3b8;
  pointer-events: none;
}
.input-ic input {
  width: 100%;
  padding: 11px 14px 11px 38px;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  font-size: 14px;
  font-family: inherit;
  color: #1e293b;
  background: #fff;
  outline: none;
}
.input-ic input:focus {
  border-color: #1e293b;
}
.input-ic input.ro {
  background: #f8fafc;
  color: #334155;
}
.actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}
.btn-foncé {
  background: #1e293b;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 11px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.btn-vert {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 11px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.btn-secondaire {
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #475569;
  border-radius: 9px;
  padding: 11px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.btn-deconnexion {
  width: 100%;
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  background: #fff;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 12px;
  padding: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.btn-deconnexion svg {
  width: 18px;
  height: 18px;
}
.btn-deconnexion:hover {
  background: #fef2f2;
}
@media (max-width: 520px) {
  .actions {
    flex-direction: column;
  }
  .actions button {
    width: 100%;
  }
}
</style>
