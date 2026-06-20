/*
  db.js — Base de données mock RÉACTIVE de NEKASO (source unique de vérité).

  Aucune requête HTTP réelle : toute la donnée vit en mémoire dans un objet
  `reactive()`. Les stores Pinia lisent et mutent cet objet ; comme il est
  réactif, toutes les vues se mettent à jour automatiquement.

  Les délais réseau, notifications et transitions de statut sont SIMULÉS.
*/
import { reactive } from 'vue'
import { creerEtatInitial } from './seed'

/* ───────────────── Base réactive ───────────────── */
export const db = reactive(creerEtatInitial())

/* Réinitialise la base (utile pour les tests / le reset démo). */
export function reinitialiserDb() {
  const frais = creerEtatInitial()
  Object.keys(frais).forEach((k) => {
    db[k] = frais[k]
  })
}

/* ───────────────── Session courante ─────────────────
   On simule l'utilisateur connecté. Pour la démo :
   - gestionnaireId : le propriétaire-gestionnaire (Awa Sarr)
   - clientId       : le locataire « protagoniste » (Moussa Sow) */
export const SESSION = reactive({
  gestionnaireId: 1,
  clientId: 1,
})

/* ───────────────── Helpers ───────────────── */

/* Générateur d'identifiants incrémentaux par table. */
const compteurs = {}

/* Certaines entités sont imbriquées (pas de table de premier niveau) :
   on initialise leurs compteurs à partir du plus grand id présent dans le seed
   pour éviter toute collision. */
function maxId(liste, selecteur) {
  return (liste || []).reduce((max, el) => {
    const sous = selecteur ? selecteur(el) : [el]
    return sous.reduce((m, s) => Math.max(m, Number(s?.id) || 0), max)
  }, 0)
}
compteurs.disponibilites = maxId(db.agents, (a) => a.disponibilites)
compteurs.echeances = maxId(db.contrats, (c) => c.echeances)
compteurs.retours = maxId(db.contrats, (c) => c.retours)
compteurs.suivi = maxId(db.alertes, (a) => a.suivi)

export function uid(table) {
  if (compteurs[table] === undefined) {
    const liste = db[table] || []
    compteurs[table] = liste.reduce((max, el) => Math.max(max, Number(el.id) || 0), 0)
  }
  compteurs[table] += 1
  return compteurs[table]
}

/* Délai simulé (ms) pour reproduire la latence réseau. */
export function delai(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/* Horodatage ISO courant. */
export function nowISO() {
  return new Date().toISOString()
}

/* Date du jour (yyyy-mm-dd). */
export function todayISO() {
  return new Date().toISOString().split('T')[0]
}

/* ───────────────── Résolveurs d'entités liées ─────────────────
   Pratiques pour « hydrater » une entité avec ses relations. */
export function getClient(id) {
  return db.clients.find((c) => c.id === id) || null
}
export function getBien(id) {
  return db.biens.find((b) => b.id === id) || null
}
export function getAgent(id) {
  return db.agents.find((a) => a.id === id) || null
}
export function getGestionnaire(id) {
  return db.gestionnaires.find((g) => g.id === id) || null
}
export function getContrat(id) {
  return db.contrats.find((c) => c.id === id) || null
}

/* Libellé lisible d'un bien (type + quartier). */
export function libelleBien(bien) {
  if (!bien) return '—'
  const type = bien.typeBien ? bien.typeBien.charAt(0) + bien.typeBien.slice(1).toLowerCase() : ''
  return `${type} — ${bien.adresse}`.trim()
}

/* Nom complet d'un client. */
export function nomComplet(personne) {
  if (!personne) return '—'
  return `${personne.prenom || ''} ${personne.nom || ''}`.trim()
}

/* ───────────────── Constantes de statut ───────────────── */
export const STATUT_VISITE = {
  EN_ATTENTE: 'EN_ATTENTE',
  VALIDEE: 'VALIDEE',
  CONFIRMEE: 'CONFIRMEE',
  ANNULEE: 'ANNULEE',
  REFUSEE: 'REFUSEE',
  CLOTUREE_AVEC_CONTRAT: 'CLOTUREE_AVEC_CONTRAT',
  CLOTUREE_SANS_CONTRAT: 'CLOTUREE_SANS_CONTRAT',
}

export const STATUT_DEMANDE = {
  EN_ATTENTE: 'EN_ATTENTE',
  VALIDEE: 'VALIDEE',
  ANNULEE: 'ANNULEE',
  REFUSEE: 'REFUSEE',
}

export const STATUT_CONTRAT = {
  PRE_CONTRAT_ENVOYE: 'PRE_CONTRAT_ENVOYE',
  RETOURS_CLIENT: 'RETOURS_CLIENT',
  PRE_CONTRAT_CORRIGE: 'PRE_CONTRAT_CORRIGE',
  VALIDE_CLIENT: 'VALIDE_CLIENT',
  ACTIF: 'ACTIF',
  TERMINE: 'TERMINE',
  ANNULE: 'ANNULE',
}

export const STATUT_ECHEANCE = {
  A_PAYER: 'A_PAYER',
  PAYE: 'PAYE',
  EN_RETARD: 'EN_RETARD',
}

export const STATUT_ALERTE = {
  NOUVELLE: 'NOUVELLE',
  EN_REPARATION: 'EN_REPARATION',
  RESOLUE: 'RESOLUE',
}

export const STATUT_BIEN = {
  DISPONIBLE: 'DISPONIBLE',
  LOUE: 'LOUE',
  RESERVE: 'RESERVE',
  EN_REPARATION: 'EN_REPARATION',
  DESACTIVE: 'DESACTIVE',
  ARCHIVE: 'ARCHIVE',
}

/* Les pré-contrats regroupent tous les statuts qui ne sont pas encore actifs. */
export const STATUTS_PRE_CONTRAT = [
  STATUT_CONTRAT.PRE_CONTRAT_ENVOYE,
  STATUT_CONTRAT.RETOURS_CLIENT,
  STATUT_CONTRAT.PRE_CONTRAT_CORRIGE,
  STATUT_CONTRAT.VALIDE_CLIENT,
]
