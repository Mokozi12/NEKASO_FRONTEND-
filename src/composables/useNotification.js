/*
  Ce composable gère les notifications (toasts) de l'application.
  
  Exemple d'utilisation :
  const { succes, erreur } = useNotification()
  succes('Bien ajouté avec succès') → notification verte en haut à droite
  erreur('Impossible de charger les biens') → notification rouge
*/
import { useToast } from 'vue-toastification'

export function useNotification() {
  // useToast() est fourni par la librairie vue-toastification
  const toast = useToast()

  // Notification de succès (fond vert)
  const succes = (message) => toast.success(message)

  // Notification d'erreur (fond rouge)
  const erreur = (message) => toast.error(message)

  // Notification d'information (fond bleu)
  const info = (message) => toast.info(message)

  // Notification d'avertissement (fond orange)
  const alerte = (message) => toast.warning(message)

  return { succes, erreur, info, alerte }
}