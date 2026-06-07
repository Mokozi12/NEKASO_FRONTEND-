<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="logo-zone">
      <div class="logo-box">
        <div class="logo-inner">
          <span class="logo-text">NEK<svg class="logo-house" width="18" height="18" viewBox="0 0 24 24" fill="#16a34a"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>SO</span>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="nav">
      <p class="nav-section">MENU</p>
      <RouterLink to="/gestionnaire/dashboard" class="nav-lien" active-class="nav-lien--actif">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        Tableau de bord
      </RouterLink>
      <RouterLink to="/gestionnaire/biens" class="nav-lien" active-class="nav-lien--actif">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Biens
      </RouterLink>
      <RouterLink to="/gestionnaire/visites" class="nav-lien" active-class="nav-lien--actif">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Visites
      </RouterLink>

      <p class="nav-section">GESTION</p>
      <RouterLink to="/gestionnaire/contrats" class="nav-lien" active-class="nav-lien--actif">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>
        Contrats
      </RouterLink>
      <RouterLink to="/gestionnaire/paiements" class="nav-lien" active-class="nav-lien--actif">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
        Paiements
      </RouterLink>

      <p class="nav-section">OUTILS</p>
      <RouterLink to="/gestionnaire/parametres" class="nav-lien" active-class="nav-lien--actif">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        Paramètres
      </RouterLink>
      <button class="nav-lien nav-deconnexion" @click="seDeconnecter">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Déconnexion
      </button>
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
  background: #ffffff;
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow-y: auto;
  border-right: 1px solid #f1f5f9;
}

/* ── Logo ────────────────────────────────────────── */
.logo-zone {
  padding: 24px 20px 20px;
}

.logo-box {
  width: 72px;
  height: 72px;
  background: #1e293b;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-inner {
  width: 54px;
  height: 54px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 1.5px;
  line-height: 1;
}

.logo-house {
  margin: 0 1px;
  display: block;
}

/* ── Nav ─────────────────────────────────────────── */
.nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
}

.nav-section {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: #94a3b8;
  padding: 14px 10px 6px;
  margin: 0;
}

.nav-lien {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 12px;
  border-radius: 9px;
  color: #475569;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
  margin-bottom: 2px;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.nav-lien svg {
  stroke: #64748b;
  transition: stroke 0.15s;
}

.nav-lien:hover {
  background: #f8fafc;
  color: #1e293b;
}

.nav-lien:hover svg {
  stroke: #475569;
}

.nav-lien--actif {
  background: #1e293b;
  color: #fff !important;
  font-weight: 600;
}

.nav-lien--actif svg {
  stroke: #fff;
}

.nav-deconnexion {
  color: #64748b;
  margin-top: 4px;
}
.nav-deconnexion:hover {
  background: #fef2f2;
  color: #ef4444;
}
.nav-deconnexion:hover svg {
  stroke: #ef4444;
}
</style>
