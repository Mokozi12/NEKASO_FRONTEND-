<template>
  <section class="notifications-center">
    <header class="page-header">
      <h2>Notifications</h2>
      <p>Vos notifications récentes</p>
    </header>

    <div class="list-panel">
      <ul v-if="notifs.length" class="list-panel__items">
        <li v-for="n in notifs" :key="n.id" class="list-panel__item">
          <div class="list-panel__item-body">
            <strong>{{ n.titre || 'Notification' }}</strong>
            <span class="gris">{{ n.message || n.body || '' }}</span>
          </div>
          <div>
            <button class="btn-relancer" @click="marquer(n.id)">Marquer lu</button>
          </div>
        </li>
      </ul>
      <p v-else class="list-panel__vide">Aucune notification</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationsStore } from '@/stores/notifications.store'
import { useNotification } from '@/composables/useNotification'

const notificationsStore = useNotificationsStore()
const { info } = useNotification()

const notifs = computed(() => notificationsStore.pourGestionnaire)

function marquer(id) {
  try {
    notificationsStore.marquerLue(id)
    info('Notification marquée')
  } catch (e) {
    info('Impossible de marquer')
  }
}
</script>

<style scoped>
.notifications-center {
  padding: 0;
}
.list-panel__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
}
.list-panel__vide {
  text-align: center;
  padding: 20px;
  color: #9ca3af;
}
</style>
