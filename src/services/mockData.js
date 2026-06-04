// Données fictives pour développer sans attendre le backend
// Quand un endpoint Spring Boot est prêt, remplacer dans le store :
// mockBiens → await biensService.getMesBiens()

export const mockUser = {
  id: 1, nom: 'Diallo', prenom: 'Moussa',
  role: 'GESTIONNAIRE', telephone: '771234567', statut: 'ACTIF'
}

// ✅ CORRIGÉ : photos[] (tableau) au lieu de photo (champ unique)
export const mockBiens = [
  {
    id: 1, typeBien: 'APPARTEMENT', adresse: 'Rue 10, Mermoz, Dakar',
    surface: 85, nombrePieces: 3, loyer: 350000, statutBien: 'LOUE',
    description: 'Bel appartement F3 avec terrasse.', dateAjout: '2024-01-15',
    photos: [{ id: 1, urlPhoto: null, dateUpload: '2024-01-15' }]
  },
  {
    id: 2, typeBien: 'STUDIO', adresse: 'Avenue Cheikh Anta Diop, Dakar',
    surface: 35, nombrePieces: 1, loyer: 150000, statutBien: 'DISPONIBLE',
    description: 'Studio moderne proche université.', dateAjout: '2024-02-20',
    photos: []
  },
  {
    id: 3, typeBien: 'CHAMBRE', adresse: 'Sacré-Coeur 3, Dakar',
    surface: 20, nombrePieces: 1, loyer: 80000, statutBien: 'RESERVE',
    description: 'Chambre meublée.', dateAjout: '2024-03-10',
    photos: []
  },
  {
    id: 4, typeBien: 'APPARTEMENT', adresse: 'Almadies, Dakar',
    surface: 120, nombrePieces: 4, loyer: 600000, statutBien: 'DISPONIBLE',
    description: 'Grand appartement vue mer.', dateAjout: '2024-04-05',
    photos: []
  }
]

export const mockVisites = [
  {
    id: 1, statut: 'EN_ATTENTE', dateCreation: '2024-05-15',
    locataire: { id: 3, nom: 'Sow', prenom: 'Fatou', telephone: '771234567' },
    bien: { id: 2, adresse: 'Avenue Cheikh Anta Diop', typeBien: 'STUDIO', loyer: 150000 }
  },
  {
    id: 2, statut: 'EN_ATTENTE', dateCreation: '2024-05-16',
    locataire: { id: 4, nom: 'Ndiaye', prenom: 'Ibrahima', telephone: '785432167' },
    bien: { id: 4, adresse: 'Almadies', typeBien: 'APPARTEMENT', loyer: 600000 }
  },
  {
    id: 3, statut: 'CONFIRMEE', dateCreation: '2024-05-10',
    locataire: { id: 5, nom: 'Fall', prenom: 'Aminata', telephone: '776543210' },
    bien: { id: 3, adresse: 'Sacré-Coeur 3', typeBien: 'CHAMBRE', loyer: 80000 }
  }
]

export const mockDemandesLocation = [
  {
    id: 1, statut: 'EN_ATTENTE', dateDemande: '2024-05-16',
    locataire: { id: 3, nom: 'Sow', prenom: 'Fatou', telephone: '771234567' },
    bien: { id: 2, adresse: 'Avenue Cheikh Anta Diop', typeBien: 'STUDIO', loyer: 150000 },
    demandeVisite: { id: 1, dateCreation: '2024-05-15' }
  }
]

export const mockContrats = [
  {
    id: 1, dateSignature: '2025-09-01', dateDebut: '2025-09-01', dateFin: '2026-08-31',
    montantLoyer: 450000, montantCaution: 900000,
    conditions: 'Pas d\'animaux. Paiement avant le 5 de chaque mois.',
    statut: 'EN_COURS', cheminPDF: '/contrats/contrat_1.pdf', demandeLocationId: 1,
    locataire: { id: 3, nom: 'Diop', prenom: 'Aminata', telephone: '771234567' },
    bien: { id: 4, adresse: 'Almadies, Dakar', typeBien: 'APPARTEMENT', loyer: 450000 }
  },
  {
    id: 2, dateSignature: '2025-06-15', dateDebut: '2025-06-15', dateFin: '2027-06-14',
    montantLoyer: 350000, montantCaution: 700000,
    conditions: 'Entretien des espaces communs à la charge du locataire.',
    statut: 'EN_COURS', cheminPDF: '/contrats/contrat_2.pdf', demandeLocationId: 2,
    locataire: { id: 7, nom: 'SARL Teranga Tech', prenom: '', telephone: '338001234' },
    bien: { id: 1, adresse: 'Rue 10, Mermoz, Dakar', typeBien: 'BUREAU', loyer: 350000 }
  }
]

/* Candidats disponibles = visites confirmées, pour le wizard de création de contrat */
export const mockCandidats = [
  {
    id: 1,
    locataire: { id: 3, nom: 'Ndiaye', prenom: 'Fatou', telephone: '771234567' },
    bien: { id: 3, adresse: 'Cité Asecna, Ouakam', typeBien: 'CHAMBRE', loyer: 90000 },
    dateVisite: '2026-05-20', statut: 'CONFIRMEE'
  },
  {
    id: 2,
    locataire: { id: 4, nom: 'Fall', prenom: 'Aminata', telephone: '776543210' },
    bien: { id: 4, adresse: 'Almadies, Dakar', typeBien: 'APPARTEMENT', loyer: 450000 },
    dateVisite: '2026-05-22', statut: 'CONFIRMEE'
  }
]

export const mockPaiements = [
  {
    id: 1, montant: 350000, datePaiement: '2024-05-05', mois: '2024-05',
    methodePaiement: 'ORANGE_MONEY', reference: 'OM-20240505-001', statut: 'PAYE',
    contratId: 1,
    locataire: { nom: 'Ba', prenom: 'Oumar', telephone: '776543210' },
    bien: { adresse: 'Rue 10, Mermoz, Dakar' }
  },
  {
    id: 2, montant: 350000, datePaiement: null, mois: '2024-04',
    methodePaiement: null, reference: null, statut: 'EN_RETARD',
    contratId: 1,
    locataire: { nom: 'Ba', prenom: 'Oumar', telephone: '776543210' },
    bien: { adresse: 'Rue 10, Mermoz, Dakar' }
  }
]

export const mockNotifications = [
  { id: 1, type: 'VISITE',    message: 'Nouvelle demande de visite de Fatou Sow', dateEnvoi: '2024-05-15', lue: false },
  { id: 2, type: 'LOCATION',  message: 'Nouvelle demande de location de Fatou Sow', dateEnvoi: '2024-05-16', lue: false },
  { id: 3, type: 'PAIEMENT',  message: 'Loyer Mai 2024 enregistré pour Oumar Ba', dateEnvoi: '2024-05-05', lue: true }
]

export const mockStats = {
  totalBiens: 4, biensLoues: 1, biensDisponibles: 2, biensReserves: 1,
  revenusMois: 350000, loyersEnRetard: 1, visitesEnAttente: 2,
  demandesLocationEnAttente: 1, contratsExpirantBientot: 0, notificationsNonLues: 2,
  revenusParMois: [
    { mois: 'Jan', montant: 0 },
    { mois: 'Fév', montant: 350000 },
    { mois: 'Mar', montant: 350000 },
    { mois: 'Avr', montant: 350000 },
    { mois: 'Mai', montant: 350000 }
  ]
}
