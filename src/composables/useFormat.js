export function useFormat() {

  function formatMontant(montant) {
    if (montant === null || montant === undefined) return '0'
    return Number(montant).toLocaleString('fr-FR')
  }

  function formatDate(dateString) {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  function formatMois(moisString) {
    if (!moisString) return '-'
    const [annee, mois] = moisString.split('-')
    const nomsDesMois = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ]
    return `${nomsDesMois[parseInt(mois) - 1]} ${annee}`
  }

  function formatDateHeure(iso) {
    if (!iso) return '-'
    const d = new Date(iso)
    const date = d.toLocaleDateString('fr-FR')
    const heure = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    return `${date} à ${heure}`
  }

  return { formatMontant, formatDate, formatMois, formatDateHeure }
}