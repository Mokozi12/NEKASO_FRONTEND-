<template>
  <aside class="sidebar">
    <!-- En-tête de la sidebar avec le Logo -->
    <div class="sidebar-header">
      <div class="logo-container">
        <img src="/logo.png" alt="Nekaso" class="logo-img" />
      </div>
    </div>

    <!-- Navigation principale -->
    <nav class="sidebar-nav">
      <!-- Section MENU -->
      <div class="nav-section">
        <h4 class="section-title">MENU</h4>

        <RouterLink to="/gestionnaire/dashboard" class="nav-item" active-class="nav-item-active">
          <svg
            class="nav-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="14" width="7" height="7" rx="1"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1"></rect>
          </svg>
          Tableau de bord
        </RouterLink>

        <RouterLink to="/gestionnaire/biens" class="nav-item" active-class="nav-item-active">
          <svg
            class="nav-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <path d="M9 22v-4h6v4"></path>
            <path d="M8 6h.01"></path>
            <path d="M16 6h.01"></path>
            <path d="M12 6h.01"></path>
            <path d="M12 10h.01"></path>
            <path d="M12 14h.01"></path>
            <path d="M16 10h.01"></path>
            <path d="M16 14h.01"></path>
            <path d="M8 10h.01"></path>
            <path d="M8 14h.01"></path>
          </svg>
          Biens
        </RouterLink>

        <RouterLink to="/gestionnaire/visites" class="nav-item" active-class="nav-item-active">
          <svg
            class="nav-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <path d="M9 16l2 2 4-4"></path>
          </svg>
          Visites
        </RouterLink>
      </div>

      <!-- Section GESTION -->
      <div class="nav-section">
        <h4 class="section-title">GESTION</h4>

        <RouterLink to="/gestionnaire/contrats" class="nav-item" active-class="nav-item-active">
          <svg
            class="nav-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Contrats
        </RouterLink>

        <RouterLink to="/gestionnaire/paiements" class="nav-item" active-class="nav-item-active">
          <svg
            class="nav-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
          </svg>
          Paiements
        </RouterLink>
      </div>

      <!-- Section OUTILS -->
      <div class="nav-section">
        <h4 class="section-title">OUTILS</h4>

        <a href="#" class="nav-item" @click.prevent>
          <svg
            class="nav-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
            ></path>
          </svg>
          Paramètres
        </a>

        <button class="nav-item btn-logout" @click="seDeconnecter">
          <svg
            class="nav-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Déconnexion
        </button>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const router = useRouter()

function seDeconnecter() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* ── Container principal de la sidebar ───────────────── */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-largeur, 260px);
  height: 100vh;
  background-color: #ffffff;
  border-right: 1px solid #f3f4f6; /* Ligne de séparation très discrète */
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow-y: auto;
}

/* ── Section Logo ────────────────────────────────────── */
.sidebar-header {
  padding: 32px 0 40px 0;
  display: flex;
  justify-content: center;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  width: 160px;
  height: auto;
  border-radius: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* ── Navigation ──────────────────────────────────────── */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 20px 40px 20px;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-title {
  margin: 0 0 8px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af; /* Gris clair bleuté */
  letter-spacing: 0.5px;
}

/* Liens du menu */
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  color: #4b5563; /* Gris ardoise (état inactif) */
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
  background-color: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.nav-icon {
  color: #6b7280; /* Légèrement plus clair que le texte */
  transition: color 0.2s ease;
}

/* Survol (Hover) pour les éléments inactifs */
.nav-item:hover:not(.nav-item-active) {
  background-color: #f9fafb;
  color: #111827;
}

.nav-item:hover:not(.nav-item-active) .nav-icon {
  color: #4b5563;
}

/* État actif */
.nav-item-active {
  background-color: #1e293b; /* Bleu marine */
  color: #ffffff;
  font-weight: 500;
  box-shadow: 0 4px 6px -1px rgba(30, 41, 59, 0.2);
}

.nav-item-active .nav-icon {
  color: #ffffff;
}

/* Bouton déconnexion spécifique */
.btn-logout {
  font-family: inherit;
}
</style>
