<template>
  <aside class="sidebar">
    <div class="sidebar__logo">
      <img src="/logo-nekaso.png" alt="NEKASO" class="sidebar__logo-img" />
    </div>

    <nav class="sidebar__nav">
      <p class="sidebar__section">MENU</p>
      <RouterLink
        v-for="item in menuPrincipal"
        :key="item.route"
        :to="item.route"
        class="sidebar__lien"
        active-class="sidebar__lien--actif"
      >
        <AppIcon :name="item.icon" :size="18" />
        <span>{{ item.label }}</span>
      </RouterLink>

      <p class="sidebar__section">GESTION</p>
      <RouterLink
        v-for="item in menuGestion"
        :key="item.route"
        :to="item.route"
        class="sidebar__lien"
        active-class="sidebar__lien--actif"
      >
        <AppIcon :name="item.icon" :size="18" />
        <span>{{ item.label }}</span>
      </RouterLink>

      <p class="sidebar__section">OUTILS</p>
      <RouterLink
        to="/gestionnaire/parametres"
        class="sidebar__lien"
        active-class="sidebar__lien--actif"
      >
        <AppIcon name="settings" :size="18" />
        <span>Paramètres</span>
      </RouterLink>
      <button type="button" class="sidebar__lien" @click="seDeconnecter">
        <AppIcon name="logout" :size="18" />
        <span>Déconnexion</span>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useDashboardStore } from '@/stores/dashboard.store'
import AppIcon from '@/components/icons/AppIcon.vue'

const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
const router = useRouter()

const menuPrincipal = [
  { route: '/gestionnaire/dashboard', label: 'Tableau de bord', icon: 'layout' },
  { route: '/gestionnaire/biens', label: 'Biens', icon: 'buildingNav' },
  { route: '/gestionnaire/visites', label: 'Visites', icon: 'calendar' },
]

const menuGestion = [
  { route: '/gestionnaire/contrats', label: 'Contrats', icon: 'file' },
  { route: '/gestionnaire/paiements', label: 'Paiements', icon: 'creditCard' },
]

function seDeconnecter() {
  authStore.logout()
  dashboardStore.reinitialiser()
  router.push('/gestionnaire/dashboard')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-largeur);
  height: 100vh;
  background: var(--fond-sidebar);
  border-right: 1px solid var(--sidebar-bordure);
  display: flex;
  flex-direction: column;
  z-index: 100;
  padding-bottom: 24px;
}

.sidebar__logo {
  padding: 24px 16px 20px;
  display: flex;
  justify-content: center;
}

.sidebar__logo-img {
  width: 100%;
  max-width: 220px;
  height: auto;
  aspect-ratio: 1;
  border-radius: 20px;
  object-fit: contain;
}

.sidebar__nav {
  flex: 1;
  padding: 4px 14px;
  overflow-y: auto;
}

.sidebar__section {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #9ca3af;
  margin: 14px 12px 6px;
}

.sidebar__section:first-child {
  margin-top: 0;
}

.sidebar__lien {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 10px;
  color: var(--sidebar-texte);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
  border: none;
  background: transparent;
  width: 100%;
  cursor: pointer;
  font-family: inherit;
}

.sidebar__lien:hover {
  background: #f3f4f6;
  color: var(--couleur-primaire);
}

.sidebar__lien--actif {
  background: var(--couleur-primaire);
  color: var(--sidebar-texte-actif);
  font-weight: 600;
}

.sidebar__lien--actif:hover {
  background: var(--couleur-primaire);
  color: var(--sidebar-texte-actif);
}

.sidebar__lien :deep(.app-icon--img) {
  opacity: 0.65;
}

.sidebar__lien--actif :deep(.app-icon--img) {
  opacity: 1;
  filter: brightness(0) invert(1);
}
</style>
