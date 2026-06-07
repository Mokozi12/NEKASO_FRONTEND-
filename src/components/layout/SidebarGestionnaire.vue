<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-box">
        <div class="logo-circle">
          <span class="logo-text">NEK<span class="logo-house">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#10b981" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </span>SO</span>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h4 class="section-title">GESTION</h4>
        <RouterLink to="/gestionnaire/contrats" class="sidebar-lien" active-class="sidebar-lien--actif">
          <svg class="sidebar-lien-icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span>Contrats</span>
        </RouterLink>
        <RouterLink to="/gestionnaire/paiements" class="sidebar-lien" active-class="sidebar-lien--actif">
          <svg class="sidebar-lien-icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
          <span>Paiements</span>
        </RouterLink>
      </div>

      <div class="nav-section mt-4">
        <h4 class="section-title">OUTILS</h4>
        <RouterLink to="/gestionnaire/parametres" class="sidebar-lien" active-class="sidebar-lien--actif">
          <svg class="sidebar-lien-icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          <span>Paramètres</span>
        </RouterLink>
      </div>
    </nav>

    <!-- Déconnexion -->
    <div class="sidebar-bas">
      <button @click="seDeconnecter" class="btn-deconnexion">
        <svg class="btn-deconnexion-icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        Déconnexion
      </button>
    </div>
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
  background-color: #fcfcfc; /* Fond très clair comme sur la maquette */
  border-right: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

/* Logo Design */
.sidebar-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 0;
  border-bottom: none;
}

.logo-box {
  background-color: #1e293b;
  width: 120px;
  height: 120px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.logo-circle {
  background-color: #ffffff;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-text {
  font-family: Arial, sans-serif;
  color: #1e293b;
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
}

.logo-house {
  display: flex;
  align-items: center;
  margin: 0 1px;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 1px;
  margin: 0 0 4px 0;
  text-transform: uppercase;
}

.mt-4 {
  margin-top: 16px;
}

.sidebar-lien {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 8px;
  color: #475569;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.sidebar-lien-icone {
  width: 18px;
  height: 18px;
  opacity: 0.7;
}

.sidebar-lien:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.sidebar-lien--actif {
  background-color: #1e293b;
  color: #ffffff;
}

.sidebar-lien--actif .sidebar-lien-icone {
  opacity: 1;
}

.sidebar-lien--actif:hover {
  background-color: #334155;
  color: #ffffff;
}

/* Bottom Actions */
.sidebar-bas {
  padding: 24px;
}

.btn-deconnexion {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 16px;
  background: transparent;
  color: #64748b;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  text-align: left;
}

.btn-deconnexion-icone {
  width: 18px;
  height: 18px;
  opacity: 0.7;
}

.btn-deconnexion:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    position: relative;
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .sidebar-logo {
    padding: 16px 0;
  }
  
  .logo-box {
    width: 80px;
    height: 80px;
    border-radius: 12px;
  }
  
  .logo-circle {
    width: 50px;
    height: 50px;
  }
  
  .logo-text {
    font-size: 10px;
  }
  
  .logo-house svg {
    width: 8px;
    height: 8px;
  }

  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
  }

  .nav-section {
    align-items: center;
  }

  .sidebar-bas {
    display: flex;
    justify-content: center;
    padding: 16px;
  }
  
  .btn-deconnexion {
    width: auto;
    justify-content: center;
  }
}
</style>
