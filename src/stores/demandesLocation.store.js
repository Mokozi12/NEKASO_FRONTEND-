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
  STATUT_DEMANDE,
  STATUT_BIEN,
} from '@/mocks/db'
import { useNotificationsStore } from '@/stores/notifications.store'

/*
  Store des DEMANDES DE RÉSERVATION (§7, §8).

  Principe corrigé : ce n'est PAS une réservation/paiement instantané mais une
  DEMANDE soumise à validation du gestionnaire. Conséquence : un même bien peut
  recevoir PLUSIEURS demandes simultanées.

  Affichage (§8) : on regroupe PAR BIEN. En validant UNE demande :
    - toutes les autres demandes EN_ATTENTE du même bien sont annulées,
    - les non-retenus reçoivent une notification,
    - le retenu reçoit une notification + un pré-contrat est créé.

  Priorité FIFO (§8-bis) : la demande la plus ancienne est prioritaire ;
  l'horodatage est conservé pour la rendre visible.
*/
export const useDemandesLocationStore = defineStore('demandesLocation', () => {
  function hydrater(d) {
    return { ...d, bien: getBien(d.bienId), client: getClient(d.clientId) }
  }

  const demandes = computed(() => db.demandes.map(hydrater))

  /* §8 : liste des BIENS ayant fait l'objet de demandes, avec leurs demandes
     triées par ordre chronologique (FIFO). */
  const biensAvecDemandes = computed(() => {
    const parBien = new Map()
    db.demandes.forEach((d) => {
      if (!parBien.has(d.bienId)) parBien.set(d.bienId, [])
      parBien.get(d.bienId).push(hydrater(d))
    })
    return Array.from(parBien.entries()).map(([bienId, liste]) => {
      const triees = liste
        .slice()
        .sort((a, b) => new Date(a.dateCreation) - new Date(b.dateCreation))
      const enAttente = triees.filter((d) => d.statut === STATUT_DEMANDE.EN_ATTENTE)
      return {
        bien: getBien(bienId),
        demandes: triees,
        demandesEnAttente: enAttente,
        nbEnAttente: enAttente.length,
        // Le premier arrivé encore en attente est prioritaire.
        prioritaireId: enAttente[0]?.id ?? null,
        validee: triees.find((d) => d.statut === STATUT_DEMANDE.VALIDEE) || null,
      }
    })
  })

  /* Demandes du client connecté (côté locataire). */
  const mesDemandes = computed(() =>
    demandes.value
      .filter((d) => d.clientId === SESSION.clientId)
      .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation)),
  )

  function trouver(id) {
    return db.demandes.find((d) => d.id === id)
  }

  function demandesDuBien(bienId) {
    return biensAvecDemandes.value.find((g) => g.bien?.id === bienId) || null
  }

  /* §7-bis (chemin B) : demande de location DIRECTE « logement express »,
     sans visite préalable. */
  async function creerDemandeDirecte(bienId, clientId = SESSION.clientId, source = 'DIRECTE') {
    await delai()
    const demande = {
      id: uid('demandes'),
      bienId,
      clientId,
      statut: STATUT_DEMANDE.EN_ATTENTE,
      dateCreation: nowISO(),
      source,
    }
    db.demandes.push(demande)
    const client = getClient(clientId)
    const bien = getBien(bienId)
    useNotificationsStore().notifierGestionnaire(
      'LOCATION',
      `Nouvelle demande de location de ${nomComplet(client)} (${bien?.intitule || 'bien'})`,
    )
    return demande
  }

  /* §8 : valide UNE demande → annule les autres du même bien, notifie tout le
     monde et génère un pré-contrat pour le retenu. */
  async function validerDemande(id) {
    await delai()
    const cible = trouver(id)
    if (!cible || cible.statut !== STATUT_DEMANDE.EN_ATTENTE) return null

    const notifs = useNotificationsStore()
    const bien = getBien(cible.bienId)

    // 1. Validation de la demande retenue
    cible.statut = STATUT_DEMANDE.VALIDEE

    // 2. Annulation automatique des autres demandes EN_ATTENTE du même bien
    db.demandes
      .filter(
        (d) =>
          d.bienId === cible.bienId &&
          d.id !== cible.id &&
          d.statut === STATUT_DEMANDE.EN_ATTENTE,
      )
      .forEach((autre) => {
        autre.statut = STATUT_DEMANDE.ANNULEE
        notifs.notifierClient(
          autre.clientId,
          'LOCATION',
          `Le bien « ${bien?.intitule || 'bien'} » ne vous a pas été octroyé.`,
        )
      })

    // 3. Le bien passe en réservé
    if (bien) bien.statutBien = STATUT_BIEN.RESERVE

    // 4. Notification + pré-contrat pour le retenu
    notifs.notifierClient(
      cible.clientId,
      'LOCATION',
      `Félicitations ! Votre demande pour « ${bien?.intitule || 'bien'} » a été retenue. Un pré-contrat va vous être proposé.`,
    )

    const { useContratsStore } = await import('@/stores/contrats.store')
    const contrat = useContratsStore().creerPreContratDepuisDemande(cible)
    return contrat
  }

  /* Annule toutes les demandes en attente d'un bien (§8). */
  async function toutAnnuler(bienId) {
    await delai()
    const notifs = useNotificationsStore()
    const bien = getBien(bienId)
    db.demandes
      .filter((d) => d.bienId === bienId && d.statut === STATUT_DEMANDE.EN_ATTENTE)
      .forEach((d) => {
        d.statut = STATUT_DEMANDE.ANNULEE
        notifs.notifierClient(
          d.clientId,
          'LOCATION',
          `Votre demande pour « ${bien?.intitule || 'bien'} » a été annulée.`,
        )
      })
  }

  /* Annulation par le client de sa propre demande. */
  async function annulerClient(id) {
    await delai()
    const d = trouver(id)
    if (!d || d.statut !== STATUT_DEMANDE.EN_ATTENTE) return
    d.statut = STATUT_DEMANDE.ANNULEE
  }

  return {
    demandes,
    biensAvecDemandes,
    mesDemandes,
    demandesDuBien,
    creerDemandeDirecte,
    validerDemande,
    toutAnnuler,
    annulerClient,
  }
})
