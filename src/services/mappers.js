
const LIBELLE_METHODE = {
  OM: 'Orange Money',
  ORANGE_MONEY: 'Orange Money',
  WAVE: 'Wave',
  FREE: 'Free Money',
  ESPECES: 'Espèces',
  VIREMENT: 'Virement',
}
export function libelleMethode(code) {
  return LIBELLE_METHODE[code] || code || '—'
}

export function mapBien(b) {
  if (!b) return null
  return {
    ...b,
    id: b.id,
    intitule: b.libelle ?? b.intitule ?? '',
    libelle: b.libelle ?? b.intitule ?? '',
    type: b.typeBien ?? b.type ?? '',
    typeBien: b.typeBien ?? b.type ?? '',
    adresse: b.adresse ?? '',
    surface: Number(b.surface) || 0,
    nombrePieces: Number(b.nombrePieces) || 0,
    loyer: Number(b.loyer) || 0,
    statutBien: b.statutBien ?? 'DISPONIBLE',
    description: b.description ?? '',
    dateAjout: b.dateAjout ?? '',
    gestionnaireId: b.gestionnaireId ?? null,
    photos: Array.isArray(b.photos)
      ? b.photos.map((p) => ({ id: p.id, urlPhoto: p.urlPhoto, dateUpload: p.dateUpload }))
      : [],
  }
}
export const mapBiens = (liste) => (liste || []).map(mapBien)

export function mapDemandeLocation(d) {
  if (!d) return null
  return {
    ...d,
    id: d.id,
    statut: d.statut,
    dateDemande: d.dateDemande,
    locataireId: d.locataireId ?? d.id_Locataire ?? null,
    bienId: d.bienId ?? d.id_Bien ?? d.bien?.id ?? null,
    bien: d.bien ? mapBien(d.bien) : null,
  }
}
export const mapDemandesLocation = (liste) => (liste || []).map(mapDemandeLocation)

function normaliserCreneau(creneau) {
  if (!creneau) return null
  if (typeof creneau === 'object') {
    return {
      ...creneau,
      date: creneau.date ?? '',
      heure: creneau.heure ?? '',
      label: creneau.label ?? `${creneau.date ?? ''} ${creneau.heure ?? ''}`.trim(),
    }
  }
  const valeur = String(creneau)
  const matchFr = valeur.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}:\d{2})/)
  if (matchFr) {
    const [, d, m, y, heure] = matchFr
    return { date: `${y}-${m}-${d}`, heure, label: valeur }
  }
  const matchIso = valeur.match(/^(\d{4}-\d{2}-\d{2})[T\s](\d{2}:\d{2})/)
  if (matchIso) return { date: matchIso[1], heure: matchIso[2], label: valeur }
  return { date: '', heure: '', label: valeur }
}

export function mapVisite(v) {
  if (!v) return null
  const locId = v.id_Locataire ?? v.locataireId ?? v.locataire?.id ?? null
  const locImbrique = v.locataire ?? v.client ?? null
  const nomLoc = v.nomLocataire ?? v.locataireNom ?? null
  const prenomLoc = v.prenomLocataire ?? v.locatairePrenom ?? null
  const telLoc = v.telephoneLocataire ?? v.locataireTelephone ?? null
  const locPlat =
    nomLoc || prenomLoc || telLoc
      ? { id: locId, nom: nomLoc, prenom: prenomLoc, telephone: telLoc }
      : null
  const client = locImbrique || locPlat
  const creneauBrut = v.creneauVisite ?? v.creneau ?? v.dateVisite ?? v.dateHeureVisite ?? null
  let choixLocal = null
  try {
    const cloturesLocales = JSON.parse(localStorage.getItem('nekaso_visites_clotures') || '{}')
    choixLocal = cloturesLocales[v.id]
  } catch (e) {}

  const choixCloture =
    v.clotureVisite ??
    v.choixCloture ??
    v.choix ??
    v.decisionCloture ??
    v.suiteVisite ??
    choixLocal ??
    null
  return {
    ...v,
    id: v.id,
    statut: choixCloture ? 'TERMINEE' : v.statut,
    dateCreation: v.dateCreation,
    locataireId: locId,
    client,
    bienId: v.bien?.id ?? v.bienId ?? v.id_Bien ?? null,
    bien: v.bien ? mapBien(v.bien) : null,
    agentId: v.agentId ?? v.idAgent ?? v.agent?.id ?? v.agent?.idAgentImmobilier ?? null,
    creneauVisite: creneauBrut,
    creneau: normaliserCreneau(creneauBrut),
    choixCloture,
    clotureVisite: choixCloture,
    avecContrat:
      v.avecContrat === true ||
      v.demandeContrat === true ||
      v.souhaiteContrat === true ||
      choixCloture === 'AVEC_CONTRAT',
  }
}
export const mapVisites = (liste) => (liste || []).map(mapVisite)

export function mapPreContrat(p) {
  if (!p) return null

  // Le backend utilise des statuts différents du frontend
  const STATUT_BACKEND_TO_FRONTEND = {
    'EN_ATTENTE': 'PRE_CONTRAT_ENVOYE',
    'VALIDER': 'VALIDE_CLIENT',
    'INVALIDER': 'ANNULE',
    'CLOTURER': 'TERMINE',
  }
  const statutBrut = p.statutPreContrat ?? p.statut ?? ''
  const statutNormalise = STATUT_BACKEND_TO_FRONTEND[statutBrut] ?? statutBrut

  let statutLocal = null
  try {
    const statutsLocaux = JSON.parse(localStorage.getItem('nekaso_precontrats_statuts') || '{}')
    statutLocal = statutsLocaux[p.id]
  } catch (e) {}

  const statutFinal = statutLocal || statutNormalise

  return {
    ...p,
    id: p.id,
    statut: statutFinal,
    statutPreContrat: statutBrut,
    conditions: p.conditions ?? '',
    dateCreation: p.dateCreation,
    dateDebut: p.dateDebutPrevu ?? p.dateDebut,
    dateDebutPrevu: p.dateDebutPrevu,
    jourEcheance: p.jourEcheancePaiement ?? null,
    jourEcheancePaiement: p.jourEcheancePaiement ?? null,
    montantLoyer: Number(p.montantLoyer) || 0,
    montantCaution: Number(p.montantCaution) || 0,
    bienId: p.bienImmobilierId ?? p.bienId ?? null,
    bienIntitule: p.bienLibelle ?? '',
    demandeVisiteId: p.demandeVisiteId ?? p.idDemandeVisite ?? null,
    demandeLocationId: p.demandeLocationId ?? p.idDemandeLocation ?? null,
    locataireId: p.locataireId ?? null,
    locataire: {
      id: p.locataireId,
      nom: p.locataireNom,
      prenom: p.locatairePrenom,
      telephone: p.locataireTelephone,
    },
    gestionnaireId: p.gestionnaireId ?? null,
    gestionnaire: {
      id: p.gestionnaireId,
      nom: p.gestionnaireNom,
      prenom: p.gestionnairePrenom,
      telephone: p.gestionnaireTelephone,
    },
  }
}
export const mapPreContrats = (liste) => (liste || []).map(mapPreContrat)

export function mapContrat(c) {
  if (!c) return null
  return {
    ...c,
    id: c.id,
    statut: c.statutContrat ?? c.statut,
    statutContrat: c.statutContrat,
    conditions: c.conditions ?? '',
    dateDebut: c.dateDebut,
    dateSignature: c.dateSignature,
    jourEcheance: c.jourEcheanceLoyer ?? null,
    montantLoyer: Number(c.montantLoyer) || 0,
    montantCaution: Number(c.montantCaution) || 0,
    locataireId: c.locataireId ?? null,
    preContratId: c.preContratId ?? null,
    cheminPDF: c.cheminPDF ?? null,
  }
}
export const mapContrats = (liste) => (liste || []).map(mapContrat)

export function mapPaiement(p) {
  if (!p) return null
  return {
    ...p,
    id: p.id,
    montant: Number(p.montant) || 0,
    datePaiement: p.datePaiement,
    mois: p.mois,
    reference: p.reference,
    methodePaiement: p.methodePaiement,
    methodeLibelle: libelleMethode(p.methodePaiement),
    contratId: p.contratId ?? null,
    quittance: p.quittance ?? null,
  }
}
export const mapPaiements = (liste) => (liste || []).map(mapPaiement)
