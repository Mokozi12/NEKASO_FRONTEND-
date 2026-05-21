/*
  Ce composable centralise toutes les fonctions de formatage.
  
  Exemple d'utilisation dans un composant :
  import { useFormat } from '@/composables/useFormat'
  const { formatMontant, formatDate } = useFormat()
  
  Ensuite dans le template :
  {{ formatMontant(bien.loyer) }} affiche "350 000"
  au lieu de bien.loyer qui afficherait "350000"
*/
export function useFormat() {

  /*
    Formater un montant en FCFA avec séparateur de milliers.
    350000 → "350 000"
    1050000 → "1 050 000"
    
    toLocaleString('fr-FR') utilise les conventions françaises :
    - espace comme séparateur de milliers (pas la virgule)
    - virgule comme séparateur décimal
  */
  function formatMontant(montant) {
    // Si le montant est null, undefined ou 0, on affiche "0"
    if (montant === null || montant === undefined) return '0'
    return Number(montant).toLocaleString('fr-FR')
  }

  /*
    Formater une date ISO en date française.
    "2024-05-15" → "15/05/2024"
    
    Les dates viennent de Spring Boot au format ISO 8601 (YYYY-MM-DD).
    On les convertit en format lisible pour les utilisateurs sénégalais.
  */
  function formatDate(dateString) {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  /*
    Formater un mois ISO en mois français.
    "2024-05" → "Mai 2024"
    "2024-01" → "Janvier 2024"
  */
  function formatMois(moisString) {
    if (!moisString) return '-'
    const [annee, mois] = moisString.split('-')
    const nomsDesMois = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ]
    // parseInt(mois) convertit la string "05" en nombre 5
    // -1 car les tableaux commencent à l'index 0
    return `${nomsDesMois[parseInt(mois) - 1]} ${annee}`
  }

  // On retourne les fonctions pour qu'elles soient utilisables
  // dans les composants qui importent ce composable
  return { formatMontant, formatDate, formatMois }
}