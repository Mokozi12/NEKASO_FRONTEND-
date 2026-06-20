import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { preContratsService } from '@/services/pre-contrats.service'
import { listeOuVide, unwrap } from '@/utils/apiResponse'
import { mapPreContrats } from '@/services/mappers'
import { useAuthStore } from '@/stores/auth.store'

export const usePreContratsStore = defineStore('preContrats', () => {
  const authStore = useAuthStore()

  const preContrats = ref([])
  const chargement  = ref(false)
  const erreur      = ref(null)

  const page         = ref(0)
  const size         = ref(20)
  const totalPages   = ref(1)
  const totalItems   = ref(0)

  const enAttente   = computed(() => preContrats.value.filter(c => c.statut === 'PRE_CONTRAT_ENVOYE'))
  const aValider    = computed(() => preContrats.value.filter(c =>
    ['PRE_CONTRAT_ENVOYE', 'PRE_CONTRAT_CORRIGE'].includes(c.statut)
  ))
  const retours     = computed(() => preContrats.value.filter(c => c.statut === 'RETOURS_CLIENT'))
  const valides     = computed(() => preContrats.value.filter(c => c.statut === 'VALIDE_CLIENT'))
  const annules     = computed(() => preContrats.value.filter(c => c.statut === 'ANNULE'))

  function _extrairePage(res) {
    const body = unwrap(res)
    if (Array.isArray(body?.content)) {
      totalPages.value  = body.totalPages ?? 1
      totalItems.value  = body.totalElements ?? body.content.length
      page.value        = body.number ?? 0
      return body.content
    }
    if (Array.isArray(body?.data)) {
      totalPages.value  = body.totalPages ?? 1
      totalItems.value  = body.totalElements ?? body.data.length
      page.value        = body.currentPage ?? 0
      return body.data
    }
    if (Array.isArray(body)) {
      totalPages.value = 1
      totalItems.value = body.length
      return body
    }
    return []
  }


  async function chargerGestionnaire(params = {}) {
    chargement.value = true
    erreur.value = null
    try {
      const res = await preContratsService.getParGestionnaire({
        page: page.value,
        size: size.value,
        ...params,
      })
      preContrats.value = mapPreContrats(_extrairePage(res))
    } catch (e) {
      if (e?.response?.status === 404) {
        preContrats.value = []
      } else {
        erreur.value = 'Impossible de charger les pré-contrats.'
        console.error('Erreur pré-contrats gestionnaire:', e?.response?.status, e?.response?.data)
      }
    } finally {
      chargement.value = false
    }
  }

  async function chargerLocataire(params = {}) {
    chargement.value = true
    erreur.value = null
    try {
      const res = await preContratsService.getParLocataire({
        page: page.value,
        size: size.value,
        ...params,
      })
      preContrats.value = mapPreContrats(_extrairePage(res))
    } catch (e) {
      if (e?.response?.status === 404) {
        preContrats.value = []
      } else {
        erreur.value = 'Impossible de charger les pré-contrats.'
        console.error('Erreur pré-contrats locataire:', e?.response?.status, e?.response?.data)
      }
    } finally {
      chargement.value = false
    }
  }


  async function creer(payload) {
    chargement.value = true
    erreur.value = null
    try {
      const res = await preContratsService.creer(payload)
      const created = unwrap(res)
      await chargerGestionnaire()
      return created
    } catch (e) {
      erreur.value = 'Impossible de créer le pré-contrat.'
      console.error('Erreur création pré-contrat:', e?.response?.status, e?.response?.data)
      throw e
    } finally {
      chargement.value = false
    }
  }

  async function valider(id) {
    try {
      await preContratsService.valider(id)
      await chargerLocataire()
    } catch (e) {
      erreur.value = 'Impossible de valider le pré-contrat.'
      throw e
    }
  }

  async function modifier(id) {
    try {
      await preContratsService.modifier(id)
      await chargerGestionnaire()
    } catch (e) {
      erreur.value = 'Impossible de modifier le pré-contrat.'
      throw e
    }
  }

  async function invalider(id) {
    try {
      await preContratsService.invalider(id)
      if (authStore.isGestionnaire) {
        await chargerGestionnaire()
      } else {
        await chargerLocataire()
      }
    } catch (e) {
      erreur.value = 'Impossible d\'invalider le pré-contrat.'
      throw e
    }
  }

  async function pageNext(roleEstGestionnaire = true) {
    if (page.value < totalPages.value - 1) {
      page.value++
      if (roleEstGestionnaire) await chargerGestionnaire()
      else await chargerLocataire()
    }
  }

  async function pagePrev(roleEstGestionnaire = true) {
    if (page.value > 0) {
      page.value--
      if (roleEstGestionnaire) await chargerGestionnaire()
      else await chargerLocataire()
    }
  }

  return {
    preContrats,
    chargement,
    erreur,
    page,
    size,
    totalPages,
    totalItems,
    enAttente,
    aValider,
    retours,
    valides,
    annules,
    chargerGestionnaire,
    chargerLocataire,
    creer,
    valider,
    modifier,
    invalider,
    pageNext,
    pagePrev,
  }
})
