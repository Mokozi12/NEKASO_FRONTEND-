export function libelleBien(bien) {
  if (!bien) return ''

  const types = {
    APPARTEMENT: 'Appartement',
    STUDIO: 'Studio',
    CHAMBRE: 'Chambre'
  }
  const type = types[bien.typeBien] || bien.typeBien
  const lieu = bien.libelle || bien.intitule || bien.adresse?.split(',')[0]?.trim() || bien.adresse || ''

  return lieu ? `${type} ${lieu}` : type
}
