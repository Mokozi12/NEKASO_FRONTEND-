<template>
  <header class="header">
    <div class="header-left">
      <h1 class="page-titre">{{ route.meta.title }}</h1>
    </div>
    <div class="header-right">
      <!-- Notifications -->
      <div class="notif-zone" @click="toggleNotif">
        <button class="bell-btn" aria-label="Notifications">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.8">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span v-if="compteur > 0" class="bell-badge">{{ compteur }}</span>
        </button>
      </div>

      <!-- Panel notifs -->
      <div class="notif-panel" v-if="notifOuverte">
        <div class="notif-panel-header">
          <strong>Notifications</strong>
          <button class="btn-link" @click="toutLire">Tout marquer lu</button>
        </div>
        <ul class="notif-list">
          <li v-for="n in nonLues" :key="n.id" class="notif-item">
            <p class="notif-msg">{{ n.message }}</p>
            <p class="notif-date">{{ n.dateEnvoi }}</p>
          </li>
          <li v-if="nonLues.length === 0" class="notif-vide">Aucune notification non lue</li>
        </ul>
      </div>

      <!-- Utilisateur -->
      <div class="user-zone">
        <div class="user-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <span class="user-nom">{{ authStore.user?.prenom }} {{ authStore.user?.nom || 'Sarr' }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationsStore } from '@/stores/notifications.store'

const route = useRoute()
const authStore = useAuthStore()
const notificationsStore = useNotificationsStore()
const notifOuverte = ref(false)

const nonLues = notificationsStore.nonLues
const compteur = notificationsStore.compteur

function toggleNotif() { notifOuverte.value = !notifOuverte.value }
async function toutLire() {
  await notificationsStore.toutLire()
  notifOuverte.value = false
}

onMounted(() => notificationsStore.charger())
</script>

<style scoped>
.header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: transparent;
  position: sticky;
  top: 0;
  z-index: 90;
}

.page-titre {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.3px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

/* ── Cloche ─────────────────────────────────────── */
.notif-zone { position: relative; cursor: pointer; }

.bell-btn {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}
.bell-btn:hover { background: rgba(0,0,0,0.03); }

.bell-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #ff3b30;
  color: white;
  font-size: 9px;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Panel notifs ───────────────────────────────── */
.notif-panel {
  position: absolute;
  top: 52px;
  right: 0;
  width: 340px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,.1);
  padding: 14px;
  z-index: 200;
}

.notif-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.btn-link {
  background: none;
  border: none;
  color: #1e40af;
  font-size: 12px;
  cursor: pointer;
}

.notif-list { list-style: none; padding: 0; margin: 0; max-height: 300px; overflow: auto; }

.notif-item {
  padding: 10px 0;
  border-bottom: 1px solid #f8fafc;
}

.notif-msg { font-size: 13px; color: #0f172a; margin: 0 0 3px; }
.notif-date { font-size: 12px; color: #94a3b8; margin: 0; }
.notif-vide { font-size: 13px; color: #94a3b8; text-align: center; padding: 20px 0; }

/* ── Utilisateur ─────────────────────────────────── */
.user-zone {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-nom {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}
</style>
