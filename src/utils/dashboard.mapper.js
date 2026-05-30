const TYPE_LABELS = {
  APPARTEMENT: 'Appartement',
  STUDIO: 'Studio',
  CHAMBRE: 'Chambre',
  LOCAL: 'Bureau',
}

const PORTEFEUILLE_COLORS = ['#1a2234', '#22c55e', '#4ade80', '#166534', '#86efac']

export function labelTypeBien(type) {
  return TYPE_LABELS[type] || type
}

export function buildPortefeuille(biens = []) {
  const counts = {}
  biens.forEach((b) => {
    const label = labelTypeBien(b.typeBien)
    counts[label] = (counts[label] || 0) + 1
  })
  const total = biens.length
  if (!total) return []
  return Object.entries(counts).map(([type, count], i) => ({
    type,
    count,
    percent: Math.round((count / total) * 100),
    color: PORTEFEUILLE_COLORS[i % PORTEFEUILLE_COLORS.length],
  }))
}

export function mapPaiementsEnRetard(paiements = []) {
  return paiements
    .filter((p) => p.statut === 'EN_RETARD')
    .map((p) => ({
      id: p.id,
      locataire: formatNom(p.locataire),
      echeance: p.mois,
      montant: p.montant,
    }))
}

export function mapVisitesEnAttente(visites = []) {
  return visites
    .filter((v) => v.statut === 'EN_ATTENTE')
    .map((v) => ({
      id: v.id,
      nom: formatNom(v.locataire),
      bien: formatBienCourt(v.bien),
      dateHeure: v.dateCreation,
      statut: v.statut,
    }))
}

function formatNom(personne) {
  if (!personne) return '—'
  return `${personne.prenom ?? ''} ${personne.nom ?? ''}`.trim()
}

function formatBienCourt(bien) {
  if (!bien) return '—'
  const type = labelTypeBien(bien.typeBien)
  const lieu = bien.adresse?.split(',')[0]?.trim() || bien.adresse || ''
  return [type, lieu].filter(Boolean).join(' ')
}

export function computeVariationPourcent(mois = []) {
  if (mois.length < 2) return 0
  const dernier = mois[mois.length - 1].montant ?? 0
  const precedent = mois[mois.length - 2].montant ?? 0
  if (!precedent) return 0
  return Math.round(((dernier - precedent) / precedent) * 1000) / 10
}

/** 6 derniers mois pour le graphique (API : montant uniquement) */
export function mapRevenusGraphique(revenusParMois = []) {
  return revenusParMois.slice(-6).map((m) => ({
    mois: m.mois,
    encaisse: m.montant ?? 0,
    anneePrecedente: Math.round((m.montant ?? 0) * 0.85),
  }))
}

export function enrichDashboardStats(stats, { paiements = [], visites = [], biens = [] }) {
  const loyersListe = mapPaiementsEnRetard(paiements)
  const visitesListe = mapVisitesEnAttente(visites)
  const portefeuille = buildPortefeuille(biens)
  const montantLoyersEnRetard = loyersListe.reduce((s, p) => s + p.montant, 0)
  const tauxOccupation =
    stats.totalBiens > 0 ? Math.round((stats.biensLoues / stats.totalBiens) * 100) : 0

  return {
    ...stats,
    montantLoyersEnRetard,
    tauxOccupation,
    variationRevenus: computeVariationPourcent(stats.revenusParMois),
    variationOccupation: 0,
    variationLoyersRetard: 0,
    revenusParMois: mapRevenusGraphique(stats.revenusParMois),
    portefeuille,
    loyersEnRetardListe: loyersListe,
    visitesEnAttenteListe: visitesListe,
    loyersEnRetard: stats.loyersEnRetard ?? loyersListe.length,
    visitesEnAttente: stats.visitesEnAttente ?? visitesListe.length,
  }
}
