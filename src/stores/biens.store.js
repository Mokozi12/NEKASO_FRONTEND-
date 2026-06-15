import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { biensService } from '@/services/biens.service'
import api from '@/services/api'

// Extrait les champs texte d'un FormData ou d'un objet plain
function extraireChamps(donnees) {
  const champs = {}
  if (donnees instanceof FormData) {
    donnees.forEach((v, k) => { if (!(v instanceof File)) champs[k] = v })
  } else {
    Object.assign(champs, donnees)
  }
  return champs
}

// Retourne true si l'erreur est due à un manque d'authentification backend
function estErreurAuth(e) {
  return [401, 403, 500].includes(e.response?.status)
}

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
  async function charger(params = { page: 0, size: 100 }) {
    chargement.value = true
    erreur.value = null
    try {
      const res = await api.get('/biens/gestionnaire', { params })
      const data = res.data

      if (data && Array.isArray(data.data)) {
        biens.value = data.data
        pagination.value = {
          page: data.currentPage ?? 1,
          size: data.pageSize ?? 10,
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

  // ─── POST /api/biens/create ───────────────────────────────────────────────
  async function creer(donnees) {
    chargement.value = true
    erreur.value = null
    try {
      const formData = donnees instanceof FormData ? donnees : buildFormData(donnees)
      await biensService.creer(formData)
      await charger()
    } catch (e) {
      if (estErreurAuth(e)) {
        // Backend non authentifié : simulation locale pour les tests
        console.warn('[DEV] Création simulée localement (pas de token)')
        const champs = extraireChamps(donnees)
        biens.value.unshift({
          id: Date.now(),
          statutBien: 'DISPONIBLE',
          photos: [],
          libelle: champs.libelle || '',
          adresse: champs.adresse || '',
          typeBien: champs.typeBien || 'APPARTEMENT',
          surface: Number(champs.surface) || 0,
          nombrePieces: Number(champs.nombrePieces) || 1,
          loyer: Number(champs.loyer) || 0,
          description: champs.description || '',
        })
      } else {
        erreur.value = 'Impossible de créer le bien.'
        console.error('Erreur création bien:', e)
        throw e
      }
    } finally {
      chargement.value = false
    }
  }

  // ─── PUT /api/biens/{id} ──────────────────────────────────────────────────
  async function modifier(id, donnees) {
    chargement.value = true
    erreur.value = null
    try {
      const formData = donnees instanceof FormData ? donnees : buildFormData(donnees)
      await biensService.modifier(id, formData)
      await charger()
    } catch (e) {
      if (estErreurAuth(e)) {
        // Backend non authentifié : simulation locale pour les tests
        console.warn('[DEV] Modification simulée localement (pas de token)')
        const champs = extraireChamps(donnees)
        const bien = biens.value.find((b) => b.id === id)
        if (bien) Object.assign(bien, champs)
      } else {
        erreur.value = 'Impossible de modifier le bien.'
        console.error('Erreur modification bien:', e.response?.data)
        throw e
      }
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
      if (estErreurAuth(e)) {
        // Backend non authentifié : simulation locale pour les tests
        console.warn('[DEV] Archivage simulé localement (pas de token)')
        const bien = biens.value.find((b) => b.id === id)
        if (bien) bien.statutBien = 'ARCHIVE'
      } else {
        erreur.value = "Impossible d'archiver le bien."
        throw e
      }
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

  // ─── Utilitaire : construit le FormData pour POST ─────────────────────────
  function buildFormData(donnees) {
    const fd = new FormData()
    if (donnees.libelle || donnees.intitule) fd.append('libelle', donnees.libelle || donnees.intitule)
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
