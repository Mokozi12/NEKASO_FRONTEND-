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

  watch(totalPages, (n) => {
    if (page.value > n) page.value = n
  })

  return { page, totalPages, itemsPage }
}
