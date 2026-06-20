import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { biensService } from '@/services/biens.service'
import { mapBiens } from '@/services/mappers'
import { pageMeta } from '@/utils/apiResponse'
import { useAuthStore } from '@/stores/auth.store'


function bienToFormData(bien, overrides = {}) {
  const b = { ...bien, ...overrides }
  const fd = new FormData()
  const champs = ['typeBien', 'statutBien', 'libelle', 'adresse', 'description']
  champs.forEach((k) => {
    const v = b[k] ?? (k === 'libelle' ? b.intitule : undefined)
    if (v != null && v !== '') fd.append(k, String(v))
  })
  if (b.surface != null) fd.append('surface', String(b.surface))
  if (b.nombrePieces != null) fd.append('nombrePieces', String(b.nombrePieces))
  if (b.loyer != null) fd.append('loyer', String(b.loyer))
  if (b.gestionnaireId != null) fd.append('gestionnaireId', String(b.gestionnaireId))

  if (b.photosFichiers && Array.isArray(b.photosFichiers)) {
    b.photosFichiers.forEach((file) => {
      fd.append('photos', file)
    })
  }

  return fd
}

export const useBiensStore = defineStore('biens', () => {
  const biens = ref([])
  const chargement = ref(false)
  const erreur = ref(null)
  const pagination = ref({ page: 0, size: 100, totalElements: 0, totalPages: 1 })

  const totalBiens = computed(() => biens.value.length)
  const biensDisponibles = computed(() => biens.value.filter((b) => b.statutBien === 'DISPONIBLE'))
  const biensLoues = computed(() => biens.value.filter((b) => b.statutBien === 'LOUE'))
  const biensReserves = computed(() => biens.value.filter((b) => b.statutBien === 'RESERVE'))
  const biensEnReparation = computed(() => biens.value.filter((b) => b.statutBien === 'EN_REPARATION'))

  async function charger(params = { page: 0, size: 100 }) {
    chargement.value = true
    erreur.value = null
    try {
      const res = await biensService.getMesBiens(params)
      const meta = pageMeta(res)
      biens.value = mapBiens(meta.items)
      pagination.value = {
        page: meta.page,
        size: meta.size,
        totalElements: meta.totalElements,
        totalPages: meta.totalPages,
      }
    } catch (e) {
      erreur.value = "Impossible de charger les biens."
      console.error('charger biens:', e)
    } finally {
      chargement.value = false
    }
  }

  function getBien(id) {
    return biens.value.find((b) => String(b.id) === String(id)) || null
  }

  function injecterGestionnaire(formData) {
    const gid = useAuthStore().userId
    if (formData instanceof FormData) {
      if (gid != null && !formData.has('gestionnaireId')) {
        formData.append('gestionnaireId', String(gid))
      }
      return formData
    }
    return bienToFormData({ ...formData, gestionnaireId: formData.gestionnaireId ?? gid })
  }

  async function creer(donnees) {
    chargement.value = true
    try {
      await biensService.creer(injecterGestionnaire(donnees))
      await charger()
    } finally {
      chargement.value = false
    }
  }

  async function modifier(id, donnees) {
    chargement.value = true
    try {
      await biensService.modifier(id, injecterGestionnaire(donnees))
      await charger()
    } finally {
      chargement.value = false
    }
  }

  async function changerStatut(id, statutBien) {
    const bien = getBien(id)
    if (!bien) return
    const gid = useAuthStore().userId
    await biensService.modifier(id, bienToFormData(bien, { statutBien, gestionnaireId: bien.gestionnaireId ?? gid }))
    await charger()
  }
  const archiver = (id) => changerStatut(id, 'ARCHIVE')
  const louer = (id) => changerStatut(id, 'LOUE')
  const remettreDispo = (id) => changerStatut(id, 'DISPONIBLE')
  const mettreEnReparation = (id) => changerStatut(id, 'EN_REPARATION')
  const desactiver = (id) => changerStatut(id, 'DESACTIVE')
  const reactiver = (id) => changerStatut(id, 'DISPONIBLE')

  return {
    biens,
    chargement,
    erreur,
    pagination,
    totalBiens,
    biensDisponibles,
    biensLoues,
    biensReserves,
    biensEnReparation,
    charger,
    getBien,
    creer,
    modifier,
    changerStatut,
    archiver,
    louer,
    remettreDispo,
    mettreEnReparation,
    desactiver,
    reactiver,
  }
})
