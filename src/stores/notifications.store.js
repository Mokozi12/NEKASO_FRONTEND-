import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([])

  const pourGestionnaire = computed(() => [])
  const pourClient = computed(() => [])

  function notifierClient(clientId, type, message) {
    console.warn("notifierClient: Endpoint backend manquant")
  }

  function notifierGestionnaire(type, message) {
    console.warn("notifierGestionnaire: Endpoint backend manquant")
  }

  function marquerLue(id) {
    console.warn("marquerLue: Endpoint backend manquant")
  }

  function toutMarquerLuClient() {
    console.warn("toutMarquerLuClient: Endpoint backend manquant")
  }

  function toutMarquerLuGestionnaire() {
    console.warn("toutMarquerLuGestionnaire: Endpoint backend manquant")
  }

  return {
    notifications,
    pourGestionnaire,
    pourClient,
    notifierClient,
    notifierGestionnaire,
    marquerLue,
    toutMarquerLuClient,
    toutMarquerLuGestionnaire,
  }
})
