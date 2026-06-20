/*
  seed.js — Données de démonstration initiales de la base mock NEKASO.

  Objectif : couvrir TOUS les cas du workflow métier afin de pouvoir tester
  de bout en bout sans backend :
    demande → validation gestionnaire (créneau + agent) → acceptation client
    → visite → clôture (avec / sans contrat) → pré-contrat
    → validation des deux parties → contrat actif → paiements par échéances.

  Cas particuliers volontairement présents :
    - 3 demandes de réservation SIMULTANÉES sur le même bien (Studio Plateau) → FIFO.
    - Agents avec créneaux de disponibilité (croisement des dispos).
    - Pré-contrat en attente de validation client + contrat en retours client.
    - Contrat actif avec échéances mensuelles et paiements partiels.
    - Alerte « bien défectueux » envoyée par un locataire.

  La date de référence du jeu de données est 2026-06-18.
*/

const PHOTO = {
  appart: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
  studio: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
  bureau: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
  villa: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
  chambre: 'https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=600&h=400&fit=crop',
}

/* Génère des échéances mensuelles entre deux dates (incluses). */
function genererEcheancesMensuelles(dateDebut, nbMois, montant, nbPayes) {
  const echeances = []
  const base = new Date(dateDebut)
  for (let i = 0; i < nbMois; i++) {
    const d = new Date(base)
    d.setMonth(base.getMonth() + i)
    const iso = d.toISOString().split('T')[0]
    const libelle = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    echeances.push({
      id: 1000 + i,
      libelle: libelle.charAt(0).toUpperCase() + libelle.slice(1),
      dateEcheance: iso,
      montant,
      statut: i < nbPayes ? 'PAYE' : 'A_PAYER',
    })
  }
  return echeances
}

export function creerEtatInitial() {
  return {
    gestionnaires: [],
    clients: [],
    agents: [],
    biens: [],
    visites: [],
    demandes: [],
    contrats: [],
    paiements: [],
    alertes: [],
    notifications: [],
  }
}

