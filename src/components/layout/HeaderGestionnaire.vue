<template>
  <header class="header">
    <h1 class="header__titre">{{ titre }}</h1>
    <div class="header__actions">
      <button type="button" class="header__notif" aria-label="Notifications">
        <AppIcon name="bell" :size="20" />
        <span v-if="notifications > 0" class="header__badge">{{ notifications }}</span>
      </button>
      <div class="header__profil">
        <img src="/icons/user.png" alt="" class="header__avatar" width="36" height="36" />
        <span class="header__nom">{{ authStore.nomComplet }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useDashboardStore } from '@/stores/dashboard.store'
import AppIcon from '@/components/icons/AppIcon.vue'

const route = useRoute()
const authStore = useAuthStore()
const dashboardStore = useDashboardStore()

const titre = computed(() => route.meta.title || 'NEKASO')
const notifications = computed(() => dashboardStore.notificationsNonLues || 2)
</script>

<style scoped>
.header {
  height: var(--header-hauteur);
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--fond-carte);
  border-bottom: 1px solid var(--bordure);
  flex-shrink: 0;
}

.header__titre {
  font-size: 18px;
  font-weight: 700;
  color: var(--couleur-primaire);
  margin: 0;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header__notif {
  position: relative;
  width: 40px;
  height: 40px;
  border: 1px solid var(--bordure);
  border-radius: 10px;
  background: #fff;
  color: var(--texte-secondaire);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: var(--couleur-danger);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__profil {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.header__nom {
  font-size: 14px;
  font-weight: 600;
  color: var(--texte-principal);
}
</style>
