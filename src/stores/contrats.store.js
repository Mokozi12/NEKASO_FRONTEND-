import { defineStore } from 'pinia'
import { computed } from 'vue'
import {
  db,
  uid,
  delai,
  nowISO,
  todayISO,
  SESSION,
  getBien,
  getClient,
  getGestionnaire,
  STATUT_CONTRAT,
  STATUT_ECHEANCE,
  STATUT_BIEN,
  STATUTS_PRE_CONTRAT,
} from '@/mocks/db'
import { useNotificationsStore } from '@/stores/notifications.store'

/*
  Store des CONTRATS (§6, §9, §9-bis, §11).

  Un contrat naît TOUJOURS comme PRÉ-CONTRAT (jamais validé d'un seul côté).
  Cycle de vie :
    PRE_CONTRAT_ENVOYE   (créé par le gestionnaire → notif client « prêt »)
      → RETOURS_CLIENT       (le client fait des retours / suggestions)
          → PRE_CONTRAT_CORRIGE (le gestionnaire corrige et renvoie) → ...
          → ANNULE              (le gestionnaire invalide)
      → VALIDE_CLIENT        (le client valide le pré-contrat)
          → ACTIF              (le gestionnaire enregistre → exécution + échéances)

  La validation finale exige l'intervention des DEUX parties.
*/
export const useContratsStore = defineStore('contrats', () => {
  function hydrater(c) {
    return {
      ...c,
      bien: getBien(c.bienId),
      client: getClient(c.clientId),
      gestionnaire: getGestionnaire(c.gestionnaireId),
      paiements: db.paiements.filter((p) => p.contratId === c.id),
    }
  }

  const contrats = computed(() => db.contrats.map(hydrater))

  /* ───── Côté gestionnaire ───── */
  const preContrats = computed(() =>
    contrats.value.filter((c) => STATUTS_PRE_CONTRAT.includes(c.statut)),
  )
  const actifs = computed(() => contrats.value.filter((c) => c.statut === STATUT_CONTRAT.ACTIF))

  /* §10 : liste filtrable par téléphone, nom client ou numéro de contrat. */
  function filtrer(query = '') {
    const q = query.trim().toLowerCase()
    if (!q) return contrats.value
    return contrats.value.filter((c) => {
      const tel = (c.client?.telephone || '').toLowerCase()
      const nom = `${c.client?.prenom || ''} ${c.client?.nom || ''}`.toLowerCase()
      const num = (c.numero || '').toLowerCase()
      return tel.includes(q) || nom.includes(q) || num.includes(q)
    })
  }

  /* ───── Côté client ───── */
  const mesContrats = computed(() =>
    contrats.value.filter((c) => c.clientId === SESSION.clientId),
  )
  const mesPreContratsAValider = computed(() =>
    mesContrats.value.filter((c) =>
      [STATUT_CONTRAT.PRE_CONTRAT_ENVOYE, STATUT_CONTRAT.PRE_CONTRAT_CORRIGE].includes(c.statut),
    ),
  )
  const mesContratsActifs = computed(() =>
    mesContrats.value.filter((c) => c.statut === STATUT_CONTRAT.ACTIF),
  )

  function trouver(id) {
    return db.contrats.find((c) => c.id === id)
  }
  function getContratHydrate(id) {
    const c = trouver(id)
    return c ? hydrater(c) : null
  }

  function genererNumero() {
    const annee = new Date().getFullYear()
    const seq = db.contrats.length + 1
    return `NKS-${annee}-${String(seq).padStart(3, '0')}`
  }

  function ajouterMois(dateISO, mois) {
    const d = new Date(dateISO)
    d.setMonth(d.getMonth() + mois)
    return d.toISOString().split('T')[0]
  }

  /* Fabrique interne d'un pré-contrat. */
  function _creerPreContrat({
    bienId,
    clientId,
    dateDebut,
    dateFin,
    montantLoyer,
    montantCaution,
    conditions = '',
    frequence = 'MENSUELLE',
    origine = { type: 'DEMANDE_RESERVATION', refId: null },
  }) {
    const debut = dateDebut || todayISO()
    const contrat = {
      id: uid('contrats'),
      numero: genererNumero(),
      bienId,
      clientId,
      gestionnaireId: SESSION.gestionnaireId,
      statut: STATUT_CONTRAT.PRE_CONTRAT_ENVOYE,
      dateCreation: todayISO(),
      dateDebut: debut,
      dateFin: dateFin || ajouterMois(debut, 12),
      montantLoyer,
      montantCaution: montantCaution ?? montantLoyer * 2,
      frequence,
      conditions,
      retours: [],
      origine,
      echeances: [],
    }
    db.contrats.push(contrat)
    const bien = getBien(bienId)
    useNotificationsStore().notifierClient(
      clientId,
      'PRE_CONTRAT',
      `Votre pré-contrat pour « ${bien?.intitule || 'bien'} » est prêt à être validé.`,
    )
    return contrat
  }

  /* §6 (chemin A) : pré-contrat pré-rempli à partir d'une visite clôturée. */
  function creerPreContratDepuisVisite(visite) {
    const bien = getBien(visite.bienId)
    return _creerPreContrat({
      bienId: visite.bienId,
      clientId: visite.clientId,
      montantLoyer: bien?.loyer || 0,
      montantCaution: (bien?.loyer || 0) * 2,
      origine: { type: 'VISITE', refId: visite.id },
    })
  }

  /* §7-bis / §8 (chemin B) : pré-contrat à partir d'une demande de réservation. */
  function creerPreContratDepuisDemande(demande) {
    const bien = getBien(demande.bienId)
    return _creerPreContrat({
      bienId: demande.bienId,
      clientId: demande.clientId,
      montantLoyer: bien?.loyer || 0,
      montantCaution: (bien?.loyer || 0) * 2,
      origine: { type: 'DEMANDE_RESERVATION', refId: demande.id },
    })
  }

  /* §9-bis : création via le wizard (mêmes étapes, finalité = PRÉ-CONTRAT). */
  async function creerPreContratDepuisWizard(data) {
    await delai()
    return _creerPreContrat(data)
  }

  /* §9 : le client envoie des retours / suggestions. */
  async function envoyerRetours(id, message) {
    await delai()
    const c = trouver(id)
    if (!c) return
    c.retours.push({ id: uid('retours'), auteur: 'CLIENT', message, date: nowISO() })
    c.statut = STATUT_CONTRAT.RETOURS_CLIENT
    const client = getClient(c.clientId)
    useNotificationsStore().notifierGestionnaire(
      'PRE_CONTRAT',
      `${client?.prenom} ${client?.nom} a fait des retours sur le pré-contrat ${c.numero}.`,
    )
  }

  /* §9 : le gestionnaire corrige et renvoie le pré-contrat. */
  async function corrigerPreContrat(id, modifs = {}, message = '') {
    await delai()
    const c = trouver(id)
    if (!c) return
    Object.assign(c, modifs)
    if (message) {
      c.retours.push({ id: uid('retours'), auteur: 'GESTIONNAIRE', message, date: nowISO() })
    }
    c.statut = STATUT_CONTRAT.PRE_CONTRAT_CORRIGE
    useNotificationsStore().notifierClient(
      c.clientId,
      'PRE_CONTRAT',
      `Votre pré-contrat ${c.numero} a été corrigé et vous est renvoyé pour validation.`,
    )
  }

  /* §9 : le gestionnaire invalide le pré-contrat. */
  async function invaliderPreContrat(id, message = '') {
    await delai()
    const c = trouver(id)
    if (!c) return
    if (message) {
      c.retours.push({ id: uid('retours'), auteur: 'GESTIONNAIRE', message, date: nowISO() })
    }
    c.statut = STATUT_CONTRAT.ANNULE
    useNotificationsStore().notifierClient(
      c.clientId,
      'PRE_CONTRAT',
      `Votre pré-contrat ${c.numero} a été invalidé.`,
    )
  }

  /* §9 : le client valide le pré-contrat (1re partie de la validation finale). */
  async function validerParClient(id) {
    await delai()
    const c = trouver(id)
    if (!c) return
    c.statut = STATUT_CONTRAT.VALIDE_CLIENT
    const client = getClient(c.clientId)
    useNotificationsStore().notifierGestionnaire(
      'PRE_CONTRAT',
      `${client?.prenom} ${client?.nom} a validé le pré-contrat ${c.numero}. À enregistrer.`,
    )
  }

  /* §9 : le client refuse/annule le pré-contrat proposé. */
  async function annulerParClient(id) {
    await delai()
    const c = trouver(id)
    if (!c) return
    c.statut = STATUT_CONTRAT.ANNULE
    const client = getClient(c.clientId)
    useNotificationsStore().notifierGestionnaire(
      'PRE_CONTRAT',
      `${client?.prenom} ${client?.nom} a annulé le pré-contrat ${c.numero}.`,
    )
  }

  /* Génère des échéances entre dateDebut et dateFin selon la fréquence. */
  function genererEcheances(contrat) {
    const echeances = []
    const debut = new Date(contrat.dateDebut)
    const fin = new Date(contrat.dateFin)
    const pasMois = contrat.frequence === 'ANNUELLE' ? 12 : 1
    let i = 0
    const curseur = new Date(debut)
    while (curseur <= fin) {
      const iso = curseur.toISOString().split('T')[0]
      const libelle = curseur.toLocaleDateString('fr-FR', {
        month: contrat.frequence === 'ANNUELLE' ? undefined : 'long',
        year: 'numeric',
      })
      echeances.push({
        id: uid('echeances'),
        libelle: libelle.charAt(0).toUpperCase() + libelle.slice(1),
        dateEcheance: iso,
        montant: contrat.montantLoyer,
        statut: STATUT_ECHEANCE.A_PAYER,
      })
      curseur.setMonth(curseur.getMonth() + pasMois)
      i++
      if (i > 600) break // garde-fou
    }
    return echeances
  }

  /* §11 : (re)définir les échéances d'un contrat manuellement. */
  function definirEcheances(id, echeances) {
    const c = trouver(id)
    if (c) c.echeances = echeances
  }

  /* §9 (final) : le gestionnaire enregistre → le contrat devient ACTIF.
     C'est la 2e partie de la validation finale (intervention des deux parties). */
  async function enregistrerEtActiver(id) {
    await delai()
    const c = trouver(id)
    if (!c || c.statut !== STATUT_CONTRAT.VALIDE_CLIENT) return
    if (!c.echeances || c.echeances.length === 0) {
      c.echeances = genererEcheances(c)
    }
    c.statut = STATUT_CONTRAT.ACTIF

    // Le bien devient loué et reçoit son locataire.
    const bien = getBien(c.bienId)
    const client = getClient(c.clientId)
    if (bien) {
      bien.statutBien = STATUT_BIEN.LOUE
      bien.locataire = {
        id: client?.id,
        nom: client?.nom,
        prenom: client?.prenom,
        telephone: client?.telephone,
        dateDebut: c.dateDebut,
        loyer: c.montantLoyer,
      }
    }

    useNotificationsStore().notifierClient(
      c.clientId,
      'CONTRAT',
      `Votre contrat ${c.numero} est désormais actif. Bienvenue !`,
    )
  }

  return {
    contrats,
    preContrats,
    actifs,
    mesContrats,
    mesPreContratsAValider,
    mesContratsActifs,
    filtrer,
    getContratHydrate,
    creerPreContratDepuisVisite,
    creerPreContratDepuisDemande,
    creerPreContratDepuisWizard,
    envoyerRetours,
    corrigerPreContrat,
    invaliderPreContrat,
    validerParClient,
    annulerParClient,
    definirEcheances,
    genererEcheances,
    enregistrerEtActiver,
  }
})
