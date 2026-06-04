<template>
  <aside class="sidebar">
    <!-- Logo et nom de l'application -->
    <div class="sidebar-logo-wrapper">
      <div class="logo-box">
        <div class="logo-circle">
          <div class="logo-text">
            <span>NEK</span>
            <svg class="logo-house" viewBox="0 0 24 24" fill="#00d15a" width="20" height="20">
              <path d="M12 3L4 10h3v9h4v-6h2v6h4v-9h3L12 3z" />
            </svg>
            <span>SO</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Liens de navigation -->
    <nav class="sidebar-nav">
      <!-- Section MENU -->
      <div class="nav-section">
        <h4 class="section-titre">MENU</h4>

        <RouterLink
          to="/gestionnaire/dashboard"
          class="sidebar-lien"
          active-class="sidebar-lien--actif"
        >
          <svg
            class="icone"
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
          <span>Tableau de bord</span>
        </RouterLink>

        <RouterLink
          to="/gestionnaire/biens"
          class="sidebar-lien"
          active-class="sidebar-lien--actif"
        >
          <svg
            class="icone"
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
          <span>Biens</span>
        </RouterLink>

        <RouterLink
          to="/gestionnaire/visites"
          class="sidebar-lien"
          active-class="sidebar-lien--actif"
        >
          <svg
            class="icone"
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
          <span>Visites</span>
        </RouterLink>
      </div>

      <!-- Section GESTION -->
      <div class="nav-section">
        <h4 class="section-titre">GESTION</h4>

        <RouterLink
          to="/gestionnaire/contrats"
          class="sidebar-lien"
          active-class="sidebar-lien--actif"
        >
          <svg
            class="icone"
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
          <span>Contrats</span>
        </RouterLink>

        <RouterLink
          to="/gestionnaire/paiements"
          class="sidebar-lien"
          active-class="sidebar-lien--actif"
        >
          <svg
            class="icone"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
            <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
          </svg>
          <span>Paiements</span>
        </RouterLink>
      </div>

      <!-- Section OUTILS -->
      <div class="nav-section mt-auto">
        <h4 class="section-titre">OUTILS</h4>

        <RouterLink
          to="/gestionnaire/parametres"
          class="sidebar-lien"
          active-class="sidebar-lien--actif"
        >
          <svg
            class="icone"
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
          <span>Paramètres</span>
        </RouterLink>

        <button @click="seDeconnecter" class="sidebar-lien btn-deconnexion">
          <svg
            class="icone"
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
          <span>Déconnexion</span>
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
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-largeur, 260px);
  height: 100vh;
  background-color: #ffffff; /* Fond blanc */
  border-right: 1px solid var(--bordure, #e5e7eb); /* Séparateur droit */
  display: flex;
  flex-direction: column;
  z-index: 100;
}

/* ===== LOGO BLOCK ===== */
.sidebar-logo-wrapper {
  padding: 32px 24px;
  display: flex;
  justify-content: center;
}

.logo-box {
  width: 140px;
  height: 140px;
  background-color: #27344f; /* Bleu nuit du logo */
  border-radius: 24px; /* Coins très arrondis */
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-circle {
  width: 110px;
  height: 110px;
  background-color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  display: flex;
  align-items: center;
  color: #27344f;
  font-weight: 600;
  font-size: 19px;
  letter-spacing: 0.5px;
}

.logo-house {
  margin: 0 1px;
}

/* ===== NAVIGATION ===== */
.sidebar-nav {
  flex: 1;
  padding: 0 20px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 28px; /* Espacement entre les sections */
  overflow-y: auto;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 6px; /* Espacement entre les liens de la même section */
}

/* Pour pousser la section "OUTILS" vers le bas si besoin, mais le screenshot ne le montre pas explicitement, il semble y avoir juste un espace régulier. 
On garde un gap normal, et on enlève le mt-auto si on veut qu'il suive GESTION directement */
/* .mt-auto { margin-top: auto; } */

.section-titre {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8; /* Gris très clair/bleuté */
  letter-spacing: 0.8px;
  padding-left: 12px;
  margin-bottom: 8px;
}

.sidebar-lien {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  color: #475569; /* Gris foncé / bleu */
  text-decoration: none;
  font-size: 14.5px;
  font-weight: 500;
  transition: all 0.2s ease;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-family: inherit;
}

.sidebar-lien:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.icone {
  flex-shrink: 0;
  color: #64748b;
  transition: color 0.2s ease;
}

/* État actif */
.sidebar-lien--actif {
  background-color: var(--couleur-primaire, #1a2e4a);
  color: #ffffff;
  font-weight: 500;
}

.sidebar-lien--actif .icone {
  color: #ffffff;
}

.sidebar-lien--actif:hover {
  background-color: var(--couleur-primaire, #1a2e4a);
  color: #ffffff;
}

.btn-deconnexion {
  margin-top: 8px;
}
</style>
