<template>
  <header class="header">
    <h1 v-if="!route.meta.hidePageTitle" class="page-title">{{ pageTitle }}</h1>
    <div v-else class="page-title-spacer" aria-hidden="true" />

    <div class="header-droite">
      <div class="notif-wrapper">
        <button type="button" class="notif-btn" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>
        <span class="notif-badge">2</span>
      </div>

      <div class="user-profile">
        <div class="avatar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <span class="user-name">Awa Sarr</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const titresRoutes = {
  dashboard: 'Tableau de bord',
  biens: 'Mes biens',
  visites: 'Visites',
  'demandes-location': 'Demandes de location',
  contrats: 'Contrats',
  paiements: 'Paiements',
}

const pageTitle = computed(() => titresRoutes[route.name] ?? 'Tableau de bord')
</script>

<style scoped>
.header {
  height: 68px;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.3px;
}

.page-title-spacer {
  flex: 1;
}

.header-droite {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notif-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.notif-btn {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.15s;
}

.notif-btn:hover {
  background: #f3f4f6;
}

.notif-badge {
  position: absolute;
  top: 0;
  right: 0;
  width: 16px;
  height: 16px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 2px solid white;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background 0.15s;
}

.user-profile:hover {
  background: #f3f4f6;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: #374151;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
}
</style>