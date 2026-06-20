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
  getAgent,
  nomComplet,
  STATUT_VISITE,
} from '@/mocks/db'
import { useNotificationsStore } from '@/stores/notifications.store'
import { useAgentsStore } from '@/stores/agents.store'

/*
  Store des VISITES — workflow corrigé (§1,2,4,5,6,6-bis).

  Cycle de vie :
    EN_ATTENTE   (simple signalement d'intérêt, sans heure choisie — §6-bis)
      → VALIDEE  (le gestionnaire affecte un CRÉNEAU + un AGENT — §2)
        → CONFIRMEE  (le client ACCEPTE le créneau — §5)
          → CLOTUREE_AVEC_CONTRAT / CLOTUREE_SANS_CONTRAT (après la visite — §6)
      → REFUSEE  (refus gestionnaire)
    VALIDEE / CONFIRMEE → ANNULEE (annulation par le client — §1)

  Règle clé §1 : une visite EN_ATTENTE ne peut PAS être annulée par le client.
*/
export const useVisitesStore = defineStore('visites', () => {
  /* Hydrate une visite brute avec ses relations. */
  function hydrater(v) {
    return {
      ...v,
      bien: getBien(v.bienId),
      client: getClient(v.clientId),
      agent: v.agentId ? getAgent(v.agentId) : null,
    }
  }

  const visites = computed(() => db.visites.map(hydrater))

  /* ───── Côté gestionnaire ───── */
  const enAttente = computed(() => visites.value.filter((v) => v.statut === STATUT_VISITE.EN_ATTENTE))
  const validees = computed(() => visites.value.filter((v) => v.statut === STATUT_VISITE.VALIDEE))
  const confirmees = computed(() => visites.value.filter((v) => v.statut === STATUT_VISITE.CONFIRMEE))
  const cloturees = computed(() =>
    visites.value.filter((v) =>
      [STATUT_VISITE.CLOTUREE_AVEC_CONTRAT, STATUT_VISITE.CLOTUREE_SANS_CONTRAT].includes(v.statut),
    ),
  )

  /* ───── Côté client connecté ───── */
  const mesVisites = computed(() => visites.value.filter((v) => v.clientId === SESSION.clientId))

  function trouver(id) {
    return db.visites.find((v) => v.id === id)
  }

  /* §6-bis : la demande de visite est un simple signalement (sans créneau). */
  async function creerDemande(bienId, clientId = SESSION.clientId) {
    await delai()
    const visite = {
      id: uid('visites'),
      bienId,
      clientId,
      statut: STATUT_VISITE.EN_ATTENTE,
      dateCreation: nowISO(),
      creneau: null,
      agentId: null,
      compteRendu: null,
    }
    db.visites.push(visite)
    const client = getClient(clientId)
    const bien = getBien(bienId)
    useNotificationsStore().notifierGestionnaire(
      'VISITE',
      `Nouvelle demande de visite de ${nomComplet(client)} (${bien?.intitule || 'bien'})`,
    )
    return visite
  }

  /* §2 : validation gestionnaire = créneau (date + heure) + affectation d'un agent. */
  async function valider(id, { date, heure, agentId }) {
    await delai()
    const v = trouver(id)
    if (!v || v.statut !== STATUT_VISITE.EN_ATTENTE) return
    v.creneau = { date, heure }
    v.agentId = agentId
    v.statut = STATUT_VISITE.VALIDEE
    useAgentsStore().reserverCreneau(agentId, date, heure)

    const agent = getAgent(agentId)
    const bien = getBien(v.bienId)
    useNotificationsStore().notifierClient(
      v.clientId,
      'VISITE',
      `Votre visite (${bien?.intitule || 'bien'}) est validée : ${formatFr(date)} à ${heure}, ` +
        `avec l'agent ${nomComplet(agent)} (${agent?.telephone}).`,
    )
  }

  async function refuser(id) {
    await delai()
    const v = trouver(id)
    if (!v || v.statut !== STATUT_VISITE.EN_ATTENTE) return
    v.statut = STATUT_VISITE.REFUSEE
    const bien = getBien(v.bienId)
    useNotificationsStore().notifierClient(
      v.clientId,
      'VISITE',
      `Votre demande de visite (${bien?.intitule || 'bien'}) n'a pas été retenue.`,
    )
  }

  /* §5 : le client accepte le créneau → la visite devient CONFIRMÉE
     (= validation gestionnaire + acceptation client). */
  async function accepterClient(id) {
    await delai()
    const v = trouver(id)
    if (!v || v.statut !== STATUT_VISITE.VALIDEE) return
    v.statut = STATUT_VISITE.CONFIRMEE
    const client = getClient(v.clientId)
    const bien = getBien(v.bienId)
    useNotificationsStore().notifierGestionnaire(
      'VISITE',
      `${nomComplet(client)} a confirmé sa visite (${bien?.intitule || 'bien'}).`,
    )
  }

  /* §1 : annulation possible UNIQUEMENT à partir de VALIDEE/CONFIRMEE. */
  async function annulerClient(id) {
    await delai()
    const v = trouver(id)
    if (!v || ![STATUT_VISITE.VALIDEE, STATUT_VISITE.CONFIRMEE].includes(v.statut)) return
    if (v.agentId && v.creneau) {
      useAgentsStore().libererCreneau(v.agentId, v.creneau.date, v.creneau.heure)
    }
    v.statut = STATUT_VISITE.ANNULEE
    const client = getClient(v.clientId)
    const bien = getBien(v.bienId)
    useNotificationsStore().notifierGestionnaire(
      'VISITE',
      `${nomComplet(client)} a annulé sa visite (${bien?.intitule || 'bien'}).`,
    )
  }

  /* Indique si le client peut annuler la visite (§1). */
  function peutAnnuler(visite) {
    return [STATUT_VISITE.VALIDEE, STATUT_VISITE.CONFIRMEE].includes(visite.statut)
  }

  /* §6 : clôture avec compte-rendu, deux issues possibles.
     issue : 'AVEC_CONTRAT' → génère un pré-contrat pré-rempli
             'SANS_CONTRAT' → la visite se ferme sans suite. */
  async function cloturer(id, { issue, compteRendu }) {
    await delai()
    const v = trouver(id)
    if (!v || v.statut !== STATUT_VISITE.CONFIRMEE) return null
    v.compteRendu = { texte: compteRendu, issue, date: nowISO() }
    v.statut =
      issue === 'AVEC_CONTRAT'
        ? STATUT_VISITE.CLOTUREE_AVEC_CONTRAT
        : STATUT_VISITE.CLOTUREE_SANS_CONTRAT

    if (issue === 'AVEC_CONTRAT') {
      // Import paresseux pour éviter les cycles d'import.
      const { useContratsStore } = await import('@/stores/contrats.store')
      const contrat = useContratsStore().creerPreContratDepuisVisite(v)
      return contrat
    }
    return null
  }

  return {
    visites,
    enAttente,
    validees,
    confirmees,
    cloturees,
    mesVisites,
    creerDemande,
    valider,
    refuser,
    accepterClient,
    annulerClient,
    peutAnnuler,
    cloturer,
  }
})

/* Formate une date ISO en jj/mm/aaaa. */
function formatFr(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR')
}
