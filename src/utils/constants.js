export function nowISO() {
  return new Date().toISOString()
}

export function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export function libelleBien(bien) {
  if (!bien) return '—'
  const type = bien.typeBien ? bien.typeBien.charAt(0) + bien.typeBien.slice(1).toLowerCase() : ''
  return `${type} — ${bien.adresse}`.trim()
}

export function nomComplet(personne) {
  if (!personne) return '—'
  return `${personne.prenom || ''} ${personne.nom || ''}`.trim()
}

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

export const STATUTS_PRE_CONTRAT = [
  STATUT_CONTRAT.PRE_CONTRAT_ENVOYE,
  STATUT_CONTRAT.RETOURS_CLIENT,
  STATUT_CONTRAT.PRE_CONTRAT_CORRIGE,
  STATUT_CONTRAT.VALIDE_CLIENT,
]
