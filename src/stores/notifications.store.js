import { defineStore } from 'pinia'
import { computed } from 'vue'
import { db, uid, nowISO, SESSION } from '@/mocks/db'

/*
  Store des notifications — entièrement mock / en mémoire.
  Les notifications sont ciblées :
    - destinataire === 'GESTIONNAIRE'  → visibles côté gestionnaire
    - destinataire === 'CLIENT'        → visibles par le client (clientId)

  Les autres stores appellent `ajouter()` pour simuler l'envoi d'une
  notification lors des transitions de statut du workflow.
*/
export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = computed(() => db.notifications)

  /* Notifications du gestionnaire courant. */
  const pourGestionnaire = computed(() =>
    db.notifications
      .filter((n) => n.destinataire === 'GESTIONNAIRE')
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date)),
  )

  /* Notifications du client connecté (SESSION.clientId). */
  const pourClient = computed(() =>
    db.notifications
      .filter((n) => n.destinataire === 'CLIENT' && n.clientId === SESSION.clientId)
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date)),
  )

  const nonLuesGestionnaire = computed(() => pourGestionnaire.value.filter((n) => !n.lue))
  const compteurGestionnaire = computed(() => nonLuesGestionnaire.value.length)
  const compteurClient = computed(() => pourClient.value.filter((n) => !n.lue).length)

  /* Ajoute une notification (simule un envoi). */
  function ajouter({ destinataire, clientId = null, type = 'INFO', message }) {
    db.notifications.push({
      id: uid('notifications'),
      destinataire,
      clientId,
      type,
      message,
      date: nowISO(),
      lue: false,
    })
  }

  /* Raccourcis. */
  function notifierGestionnaire(type, message) {
    ajouter({ destinataire: 'GESTIONNAIRE', type, message })
  }
  function notifierClient(clientId, type, message) {
    ajouter({ destinataire: 'CLIENT', clientId, type, message })
  }

  function marquerLue(id) {
    const n = db.notifications.find((x) => x.id === id)
    if (n) n.lue = true
  }

  function toutLireGestionnaire() {
    pourGestionnaire.value.forEach((n) => (n.lue = true))
  }
  function toutLireClient() {
    pourClient.value.forEach((n) => (n.lue = true))
  }

  return {
    notifications,
    pourGestionnaire,
    pourClient,
    nonLuesGestionnaire,
    compteurGestionnaire,
    compteurClient,
    ajouter,
    notifierGestionnaire,
    notifierClient,
    marquerLue,
    toutLireGestionnaire,
    toutLireClient,
  }
})
