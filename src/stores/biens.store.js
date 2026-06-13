import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { biensService } from '@/services/biens.service'

export const useBiensStore = defineStore('biens', () => {
  const biens = ref([])
  const chargement = ref(false)
  const erreur = ref(null)
  const pagination = ref({ page: 0, size: 10, totalElements: 0, totalPages: 0 })

  const totalBiens = computed(() => biens.value.length)
  const biensDisponibles = computed(() => biens.value.filter((b) => b.statutBien === 'DISPONIBLE'))
  const biensLoues = computed(() => biens.value.filter((b) => b.statutBien === 'LOUE'))
  const biensReserves = computed(() => biens.value.filter((b) => b.statutBien === 'RESERVE'))

  // ─── GET /api/biens/gestionnaire ─────────────────────────────────────────
  async function charger(params = {}) {
    chargement.value = true
    erreur.value = null
    try {
      const res = await biensService.getMesBiens(params)
      const data = res.data

      // Réponse Spring Page : { content: [...], totalElements, totalPages, ... }
      if (data && Array.isArray(data.content)) {
        biens.value = data.content
        pagination.value = {
          page: data.number ?? 0,
          size: data.size ?? 10,
          totalElements: data.totalElements ?? 0,
          totalPages: data.totalPages ?? 1,
        }
      } else if (Array.isArray(data)) {
        biens.value = data
      } else {
        biens.value = []
      }
    } catch (e) {
      erreur.value = 'Impossible de charger les biens. Réessayez.'
      console.error('Erreur chargement biens:', e)
    } finally {
      chargement.value = false
    }
  }

  // ─── POST /api/biens ──────────────────────────────────────────────────────
  async function creer(donnees) {
    chargement.value = true
    erreur.value = null
    try {
      const formData = buildFormData(donnees)
      await biensService.creer(formData)
      await charger()
    } catch (e) {
      erreur.value = 'Impossible de créer le bien.'
      console.error('Erreur création bien:', e)
      throw e
    } finally {
      chargement.value = false
    }
  }

  // ─── PUT /api/biens/{id} ──────────────────────────────────────────────────
  async function modifier(id, donnees) {
    chargement.value = true
    erreur.value = null
    try {
      const formData = buildFormData(donnees)
      await biensService.modifier(id, formData)
      await charger()
    } catch (e) {
      erreur.value = 'Impossible de modifier le bien.'
      console.error('Erreur modification bien:', e)
      throw e
    } finally {
      chargement.value = false
    }
  }

  // ─── PATCH /api/biens/{id}/archiver ──────────────────────────────────────
  async function archiver(id) {
    try {
      await biensService.archiver(id)
      const bien = biens.value.find((b) => b.id === id)
      if (bien) bien.statutBien = 'ARCHIVE'
    } catch (e) {
      erreur.value = "Impossible d'archiver le bien."
      throw e
    }
  }

  function louer(id) {
    const bien = biens.value.find((b) => b.id === id)
    if (bien) bien.statutBien = 'LOUE'
  }

  function remettreDispo(id) {
    const bien = biens.value.find((b) => b.id === id)
    if (bien) bien.statutBien = 'DISPONIBLE'
  }

  // ─── DELETE /api/biens/{bienId}/photos/{photoId} ─────────────────────────
  async function supprimerPhoto(bienId, photoId) {
    try {
      await biensService.supprimerPhoto(bienId, photoId)
      const bien = biens.value.find((b) => b.id === bienId)
      if (bien) {
        bien.photos = bien.photos.filter((p) => p.id !== photoId)
      }
    } catch (e) {
      console.error('Erreur suppression photo:', e)
      throw e
    }
  }

  // ─── Utilitaire : construit le FormData pour POST et PUT ──────────────────
  function buildFormData(donnees) {
    const fd = new FormData()
    if (donnees.intitule) fd.append('intitule', donnees.intitule)
    if (donnees.typeBien) fd.append('typeBien', donnees.typeBien)
    if (donnees.adresse) fd.append('adresse', donnees.adresse)
    if (donnees.surface) fd.append('surface', donnees.surface)
    if (donnees.nombrePieces) fd.append('nombrePieces', donnees.nombrePieces)
    if (donnees.loyer) fd.append('loyer', donnees.loyer)
    if (donnees.charges) fd.append('charges', donnees.charges)
    if (donnees.description) fd.append('description', donnees.description)
    if (donnees.photos && donnees.photos.length > 0) {
      donnees.photos.forEach((fichier) => fd.append('photos[]', fichier))
    }
    return fd
  }

  return {
    biens,
    chargement,
    erreur,
    pagination,
    totalBiens,
    biensDisponibles,
    biensLoues,
    biensReserves,
    charger,
    creer,
    modifier,
    archiver,
    louer,
    remettreDispo,
    supprimerPhoto,
  }
})
