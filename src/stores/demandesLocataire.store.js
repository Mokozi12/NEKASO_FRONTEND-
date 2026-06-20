import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { demandesLocataireService } from '@/services/demandes-locataire.service'
import { biensPublicsService } from '@/services/biens-publics.service'
import { listeOuVide } from '@/utils/apiResponse'
import { mapDemandesLocation } from '@/services/mappers'

export const useDemandesLocataireStore = defineStore('demandesLocataire', () => {
  const demandes = ref([])
  const chargement = ref(false)

  async function hydraterBiens(liste) {
    if (!liste.length) return liste
    let catalogue = []
    try {
      catalogue = await biensPublicsService.getAll({ page: 0, size: 200 })
    } catch (e) {
    }
    const parId = new Map(catalogue.map((b) => [String(b.id), b]))
    return liste.map((d) => ({
      ...d,
      bien: d.bien || parId.get(String(d.bienId)) || { id: d.bienId, intitule: `Bien #${d.bienId}` },
    }))
  }

  async function chargerDemandes(params = { size: 100 }) {
    chargement.value = true
    try {
      const liste = mapDemandesLocation(await listeOuVide(demandesLocataireService.getDemandes(params)))
      demandes.value = await hydraterBiens(liste)
    } catch (e) {
      console.error('Erreur chargement demandes locataire:', e?.response?.status, e?.response?.data)
    } finally {
      chargement.value = false
    }
  }

  const mesDemandes = computed(() =>
    demandes.value
      .slice()
      .sort((a, b) => new Date(b.dateDemande || b.dateCreation || 0) - new Date(a.dateDemande || a.dateCreation || 0)),
  )

  async function creerDemande(idBien) {
    chargement.value = true
    try {
      await demandesLocataireService.creer(idBien)
      await chargerDemandes()
    } catch (e) {
      console.error('Erreur creation demande locataire:', e)
      throw e
    } finally {
      chargement.value = false
    }
  }

  async function annuler(id) {
    await demandesLocataireService.changerStatut(id, 'ANNULEE')
    await chargerDemandes()
  }

  return { demandes, mesDemandes, chargement, chargerDemandes, creerDemande, annuler }
})
