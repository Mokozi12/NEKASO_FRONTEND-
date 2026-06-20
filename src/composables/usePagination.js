/*
  usePagination — pagination réutilisable pour n'importe quelle liste.

  Usage :
    const liste = computed(() => store.mesTrucs)
    const { page, totalPages, itemsPage } = usePagination(liste, 6)
    // dans le template : v-for="x in itemsPage" + <Pagination v-model="page" :total-pages="totalPages" />

  - `source`  : ref / computed (ou valeur) contenant le tableau à paginer.
  - `parPage` : nombre par page (ou ref/computed pour une valeur responsive).
  La page courante est ramenée dans les bornes quand la liste rétrécit.
*/
import { ref, computed, watch, unref } from 'vue'

export function usePagination(source, parPage = 6) {
  const page = ref(1)
  const liste = computed(() => unref(source) || [])
  const taille = computed(() => Number(unref(parPage)) || 6)

  const totalPages = computed(() => Math.max(1, Math.ceil(liste.value.length / taille.value)))

  const itemsPage = computed(() => {
    const debut = (page.value - 1) * taille.value
    return liste.value.slice(debut, debut + taille.value)
  })

  // Si la liste (ou la taille de page) change et que la page courante dépasse, on recadre.
  watch(totalPages, (n) => {
    if (page.value > n) page.value = n
  })

  return { page, totalPages, itemsPage }
}
