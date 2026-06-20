import { useToast } from 'vue-toastification'

export function useNotification() {
  const toast = useToast()

  const succes = (message) => toast.success(message)

  const erreur = (message) => toast.error(message)

  const info = (message) => toast.info(message)

  const alerte = (message) => toast.warning(message)

  return { succes, erreur, info, alerte }
}