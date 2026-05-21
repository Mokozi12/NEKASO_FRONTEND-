import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notificationsService } from '@/services/notifications.service'
import { mockNotifications } from '@/services/mockData'

export const useNotificationsStore = defineStore('notifications', () => {

  const notifications = ref([])
  const chargement    = ref(false)

  const nonLues  = computed(() => notifications.value.filter(n => !n.lue))
  const compteur = computed(() => nonLues.value.length)

  async function charger() {
    chargement.value = true
    try {
      // TODO : const res = await notificationsService.getListe()
      // notifications.value = res.data
      await new Promise(r => setTimeout(r, 300))
      notifications.value = mockNotifications
    } finally {
      chargement.value = false
    }
  }

  async function marquerLue(id) {
    // TODO : await notificationsService.marquerLue(id)
    notifications.value = notifications.value.map(n =>
      n.id === id ? { ...n, lue: true } : n
    )
  }

  async function toutLire() {
    // TODO : await notificationsService.toutLire()
    notifications.value = notifications.value.map(n => ({ ...n, lue: true }))
  }

  return { notifications, chargement, nonLues, compteur, charger, marquerLue, toutLire }
})
