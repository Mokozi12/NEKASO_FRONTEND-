import { defineStore } from 'pinia'
import { computed } from 'vue'
import {
  db,
  uid,
  delai,
  nowISO,
  SESSION,
  getBien,
  getClient,
  nomComplet,
  STATUT_ALERTE,
  STATUT_BIEN,
} from '@/mocks/db'
import { useNotificationsStore } from '@/stores/notifications.store'

/*
  Store des ALERTES « biens défectueux » (§12).

  - Le locataire (dans son logement) envoie une alerte signalant un problème.
  - Le gestionnaire peut mettre le bien en réparation / le désactiver.
  - L'agence suit l'avancement des réparations (statut de suivi).

  statut alerte : NOUVELLE | EN_REPARATION | RESOLUE
*/
export const useAlertesStore = defineStore('alertes', () => {
  function hydrater(a) {
    return { ...a, bien: getBien(a.bienId), client: getClient(a.clientId) }
  }

  const alertes = computed(() =>
    db.alertes
      .map(hydrater)
      .sort((a, b) => new Date(b.date) - new Date(a.date)),
  )

  const pourGestionnaire = computed(() => alertes.value)
  const nouvelles = computed(() => alertes.value.filter((a) => a.statut === STATUT_ALERTE.NOUVELLE))
  const enReparation = computed(() =>
    alertes.value.filter((a) => a.statut === STATUT_ALERTE.EN_REPARATION),
  )

  const mesAlertes = computed(() =>
    alertes.value.filter((a) => a.clientId === SESSION.clientId),
  )

  function trouver(id) {
    return db.alertes.find((a) => a.id === id)
  }

  /* Le locataire signale un problème sur le bien. */
  async function creerAlerte({ bienId, clientId = SESSION.clientId, titre, message }) {
    await delai()
    const alerte = {
      id: uid('alertes'),
      bienId,
      clientId,
      titre,
      message,
      date: nowISO(),
      statut: STATUT_ALERTE.NOUVELLE,
      suivi: [],
    }
    db.alertes.push(alerte)
    const bien = getBien(bienId)
    const client = getClient(clientId)
    useNotificationsStore().notifierGestionnaire(
      'ALERTE',
      `Alerte de ${nomComplet(client)} sur « ${bien?.intitule || 'bien'} » : ${titre}`,
    )
    return alerte
  }

  /* Le gestionnaire met le bien en réparation. */
  async function mettreEnReparation(id, note = '') {
    await delai()
    const a = trouver(id)
    if (!a) return
    a.statut = STATUT_ALERTE.EN_REPARATION
    a.suivi.push({ id: uid('suivi'), date: nowISO(), message: note || 'Bien mis en réparation' })
    const bien = getBien(a.bienId)
    if (bien) bien.statutBien = STATUT_BIEN.EN_REPARATION
    useNotificationsStore().notifierClient(
      a.clientId,
      'ALERTE',
      `Votre signalement « ${a.titre} » est pris en charge : réparation en cours.`,
    )
  }

  /* Ajoute une étape de suivi de réparation. */
  function ajouterSuivi(id, message) {
    const a = trouver(id)
    if (a) a.suivi.push({ id: uid('suivi'), date: nowISO(), message })
  }

  /* Le gestionnaire désactive le bien (indisponible). */
  function desactiverBien(bienId) {
    const bien = getBien(bienId)
    if (bien) bien.statutBien = STATUT_BIEN.DESACTIVE
  }

  /* Marque l'alerte comme résolue et remet le bien en état. */
  async function marquerResolue(id, remettreDispo = true) {
    await delai()
    const a = trouver(id)
    if (!a) return
    a.statut = STATUT_ALERTE.RESOLUE
    a.suivi.push({ id: uid('suivi'), date: nowISO(), message: 'Réparation terminée — alerte résolue' })
    const bien = getBien(a.bienId)
    if (bien && remettreDispo && bien.statutBien === STATUT_BIEN.EN_REPARATION) {
      // Si le bien était loué avant la réparation, on le remet « loué », sinon disponible.
      bien.statutBien = bien.locataire ? STATUT_BIEN.LOUE : STATUT_BIEN.DISPONIBLE
    }
    useNotificationsStore().notifierClient(
      a.clientId,
      'ALERTE',
      `Votre signalement « ${a.titre} » a été résolu.`,
    )
  }

  return {
    alertes,
    pourGestionnaire,
    nouvelles,
    enReparation,
    mesAlertes,
    creerAlerte,
    mettreEnReparation,
    ajouterSuivi,
    desactiverBien,
    marquerResolue,
  }
})
