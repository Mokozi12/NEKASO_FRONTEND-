import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { STATUT_DEMANDE } from '@/utils/constants'
import { demandesLocationService } from '@/services/demandes-location.service'
import { demandesLocataireService } from '@/services/demandes-locataire.service'
import { listeOuVide, trierParDateDecroissante } from '@/utils/apiResponse'
import { mapBien } from '@/services/mappers'
import { useAuthStore } from '@/stores/auth.store'

export const useDemandesLocationStore = defineStore('demandesLocation', () => {
  const authStore = useAuthStore()
  const demandesBackend = ref([])
  const chargement = ref(false)

  function normaliser(d) {
    const clientId = d.id_Locataire ?? d.locataireId ?? d.clientId
    const nom = d.nomLocataire ?? d.locataireNom ?? null
    const prenom = d.prenomLocataire ?? d.locatairePrenom ?? null
    const telephone = d.telephoneLocataire ?? d.locataireTelephone ?? null
    const clientPlat = nom || prenom || telephone ? { id: clientId, nom, prenom, telephone } : null
    return {
      id: d.id ?? d.idDemande,
      bienId: d.bien?.id ?? d.id_Bien ?? d.bienId,
      clientId,
      statut: d.statut,
      dateCreation: d.dateDemande ?? d.dateCreation ?? new Date().toISOString(),
      bien: d.bien ? mapBien(d.bien) : null,
      client: d.locataire ?? d.client ?? clientPlat,
    }
  }

  async function chargerDemandesBackend() {
    chargement.value = true
    try {
      const items = await listeOuVide(demandesLocationService.getListe({ size: 100 }))
      demandesBackend.value = trierParDateDecroissante(items.map(normaliser), 'dateCreation')
    } catch (e) {
      console.error('chargerDemandesBackend:', e)
      demandesBackend.value = []
    } finally {
      chargement.value = false
    }
  }

  const demandes = computed(() => demandesBackend.value)

  const nbEnAttente = computed(
    () => demandesBackend.value.filter((d) => d.statut === STATUT_DEMANDE.EN_ATTENTE).length,
  )

  const biensAvecDemandes = computed(() => {
    const parBien = new Map()
    demandesBackend.value.forEach(d => {
      const key = d.bienId
      if (!parBien.has(key)) parBien.set(key, [])
      parBien.get(key).push(d)
    })
    return Array.from(parBien.entries()).map(([bienId, liste]) => {
      const triees = liste.slice().sort((a, b) => new Date(a.dateCreation) - new Date(b.dateCreation))
      const enAttente = triees.filter(d => d.statut === STATUT_DEMANDE.EN_ATTENTE)
      return {
        bien: liste[0]?.bien ?? { id: bienId, intitule: `Bien #${bienId}` },
        demandes: triees,
        demandesEnAttente: enAttente,
        nbEnAttente: enAttente.length,
        prioritaireId: enAttente[0]?.id ?? null,
        validee: triees.find(d => d.statut === STATUT_DEMANDE.ACCEPTEE) || null,
      }
    })
  })

  const mesDemandes = computed(() =>
    demandesBackend.value.slice().sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation)),
  )

  function demandesDuBien(bienId) {
    return biensAvecDemandes.value.find(g => Number(g.bien?.id) === Number(bienId)) || null
  }

  async function creerDemandeDirecte(bienId) {
    chargement.value = true
    try {
      await demandesLocataireService.creer(bienId)
      await chargerDemandesBackend()
    } catch (e) {
      console.error('creerDemandeDirecte:', e)
      throw e
    } finally {
      chargement.value = false
    }
  }


  async function validerDemande(id) {
    try {
      await demandesLocationService.valider(id)
      await chargerDemandesBackend()
    } catch (e) {
      console.error('validerDemande:', e)
      throw e
    }
    return null
  }

  async function toutAnnuler(bienId) {
    const enAttente = demandesBackend.value.filter(
      d => Number(d.bienId) === Number(bienId) && d.statut === STATUT_DEMANDE.EN_ATTENTE
    )
    for (const d of enAttente) {
      try {
        await demandesLocationService.annuler(d.id)
      } catch (e) {
        console.error('toutAnnuler:', e)
      }
    }
    await chargerDemandesBackend()
  }

  async function annulerClient(id) {
    try {
      await demandesLocationService.annuler(id)
      await chargerDemandesBackend()
    } catch (e) {
      console.error('annulerClient:', e)
      throw e
    }
  }

  return {
    demandesBackend,
    chargement,
    chargerDemandesBackend,
    demandes,
    nbEnAttente,
    biensAvecDemandes,
    mesDemandes,
    demandesDuBien,
    creerDemandeDirecte,
    validerDemande,
    toutAnnuler,
    annulerClient,
  }
})
