<template>
  <div class="contrats-page">
    <div class="page-header">
      <h1 class="page-title">Contrats</h1>
      <p class="page-subtitle">
        Pré-contrats et contrats actifs. Ouvrez un contrat pour gérer les paiements.
      </p>
    </div>

    <button
      v-if="nbDemandesContrat > 0"
      type="button"
      class="alerte-contrat"
      @click="filtreStatut = 'precontrats'"
    >
      <span class="alerte-contrat__icone">📑</span>
      <span>
        <strong>{{ nbDemandesContrat }} demande(s) de contrat</strong> suite à une visite —
        finalisez les conditions du pré-contrat.
      </span>
    </button>

<div class="barre-filtres carte">
      <div class="recherche">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          v-model="recherche"
          type="text"
          placeholder="Filtrer par téléphone, nom client ou n° de contrat..."
        />
      </div>
      <div class="tabs">
        <button
          v-for="t in tabs"
          :key="t.cle"
          class="tab"
          :class="{ active: filtreStatut === t.cle }"
          @click="filtreStatut = t.cle; sousFiltre = 'tous'"
        >
          {{ t.libelle }}
        </button>
      </div>
    </div>

    <div class="sous-filtres">
      <button
        class="sous-filtre"
        :class="{ active: sousFiltre === 'tous' }"
        @click="sousFiltre = 'tous'"
      >
        Tous
      </button>
      <button
        v-for="sf in sousFiltresActifs"
        :key="sf.cle"
        class="sous-filtre"
        :class="{ active: sousFiltre === sf.cle }"
        @click="sousFiltre = sf.cle"
      >
        {{ sf.libelle }}
      </button>
    </div>

    <div class="carte liste-carte">
      <table v-if="contratsAffiches.length" class="tableau">
        <thead>
          <tr>
            <th>Client</th>
            <th>Téléphone</th>
            <th>Bien</th>
            <th class="ta-right">Loyer</th>
            <th class="ta-right">Caution</th>
            <th class="ta-center">Date début</th>
            <th class="ta-center">Statut</th>
            <th class="ta-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in contratsPage" :key="c.id">
            <td class="fort">{{ nom(c.locataire || c.client) || '—' }}</td>
            <td class="gris">{{ c.locataire?.telephone || c.client?.telephone || '—' }}</td>
            <td>{{ c.bien?.intitule || c.bienIntitule || '—' }}</td>
            <td class="ta-right">{{ formatMontant(c.montantLoyer) }} FCFA</td>
            <td class="ta-right">{{ formatMontant(c.montantCaution) }} FCFA</td>
            <td class="ta-center">{{ c.dateDebut ? formatDate(c.dateDebut) : '—' }}</td>
            <td class="ta-center"><span class="chip" :class="chipClass(c.statut)">{{ libelleStatut(c.statut) }}</span></td>
            <td class="ta-right">
              <button
                v-if="c.statut === 'VALIDE_CLIENT' || c.statut === 'VALIDER'"
                class="btn-creer-contrat"
                @click="creerContrat(c.id)"
                :disabled="enCours"
              >
                Créer contrat
              </button>
              <template v-else-if="filtreStatut === 'contrats' || ['ACTIF', 'EN_RUPTURE', 'ROMPU'].includes(c.statut)">
                <div class="actions-contrat">
                  <button v-if="c.cheminPDF" class="btn-pdf" @click="ouvrirPDF(c.cheminPDF)">Voir PDF</button>
                  <button
                    v-if="c.statut === 'ACTIF'"
                    class="btn-rompre"
                    :disabled="enCours"
                    @click="rompre(c)"
                  >
                    Rompre
                  </button>
                  <span v-else-if="c.statut === 'EN_RUPTURE'" class="rupture-attente">Rupture demandée</span>
                </div>
              </template>
              <button v-else class="btn-ouvrir" @click="ouvrir(c.id)">Ouvrir</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="vide">Aucun contrat ne correspond.</p>
    </div>

    <Pagination v-model="page" :total-pages="totalPages" />

<div v-if="wizardOuvert" class="overlay" @click.self="wizardOuvert = false">
      <div class="wizard-modal">
        <button class="x" @click="wizardOuvert = false" aria-label="Fermer">✕</button>
        <WizardContrat
          :demandes="demandesAcceptees"
          @cree="onPreContratCree"
        />
      </div>
    </div>

    <ModalConfirmation
      v-if="contratARompre"
      titre="Demander la rupture du contrat ?"
      :message="messageRupture"
      label-confirmer="Rompre le contrat"
      :en-cours="enCours"
      @confirmer="confirmerRupture"
      @annuler="contratARompre = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContratsStore } from '@/stores/contrats.store'
import { usePreContratsStore } from '@/stores/preContrats.store'
import { useBiensStore } from '@/stores/biens.store'
import { useDemandesLocationStore } from '@/stores/demandesLocation.store'
import { useNotification } from '@/composables/useNotification'
import { useFormat } from '@/composables/useFormat'
import { usePagination } from '@/composables/usePagination'
import { extraireMessageErreur } from '@/utils/apiResponse'
import { nomComplet, STATUTS_PRE_CONTRAT, STATUT_CONTRAT } from '@/utils/constants'
import WizardContrat from '@/components/contrats/WizardContrat.vue'
import Pagination from '@/components/common/Pagination.vue'
import ModalConfirmation from '@/components/common/ModalConfirmation.vue'

const router = useRouter()
const contratsStore = useContratsStore()
const preContratsStore = usePreContratsStore()
const biensStore = useBiensStore()
const demandesStore = useDemandesLocationStore()
const { succes, erreur: notifErreur } = useNotification()
const { formatMontant, formatDate } = useFormat()

const recherche = ref('')
const filtreStatut = ref('precontrats')
const sousFiltre = ref('tous')
const wizardOuvert = ref(false)
const contratARompre = ref(null)

const nbDemandesContrat = computed(
  () => preContratsStore.preContrats.filter((p) => p.statut === 'EN_ATTENTE').length,
)

onMounted(() => {
  contratsStore.chargerGestionnaire()
  biensStore.charger({ page: 0, size: 100 })
  demandesStore.chargerDemandesBackend()
})

const tabs = [
  { cle: 'precontrats', libelle: 'Pré-contrats' },
  { cle: 'contrats', libelle: 'Contrats' },
]

const sousFiltresPrecontrat = [
  { cle: 'EN_ATTENTE', libelle: 'En attente' },
  { cle: 'VALIDER', libelle: 'Validé' },
  { cle: 'INVALIDER', libelle: 'Invalidé' },
]

const sousFiltresContrat = [
  { cle: 'ACTIF', libelle: 'Actif' },
  { cle: 'EN_RUPTURE', libelle: 'Rupture demandée' },
  { cle: 'ROMPU', libelle: 'Rompu' },
]

const sousFiltresActifs = computed(() => {
  return filtreStatut.value === 'precontrats' ? sousFiltresPrecontrat : sousFiltresContrat
})

const demandesAcceptees = computed(() =>
  demandesStore.demandes
    .filter((d) => d.statut === 'ACCEPTEE')
    .map((d) => ({
      ...d,
      bien: d.bien || biensStore.biens.find((b) => Number(b.id) === Number(d.bienId)) || null,
    })),
)

const tousLesContrats = computed(() => {
  return contratsStore.contrats
})

const contratsAffiches = computed(() => {
  const q = recherche.value.trim().toLowerCase()
  let liste = tousLesContrats.value

  // Filtre principal : Pré-contrats vs Contrats
  if (filtreStatut.value === 'precontrats') {
    liste = liste.filter((c) => (STATUTS_PRE_CONTRAT.includes(c.statut) || c.statutPreContrat) && c.statut !== 'TERMINE' && c.statut !== 'ACTIF')
  } else if (filtreStatut.value === 'contrats') {
    liste = liste.filter((c) => ['ACTIF', 'EN_RUPTURE', 'ROMPU'].includes(c.statut))
  }

  // Sous-filtre par statut exact
  if (sousFiltre.value !== 'tous') {
    liste = liste.filter((c) => c.statut === sousFiltre.value || c.statutPreContrat === sousFiltre.value)
  }

  if (q) {
    liste = liste.filter((c) => {
      const tel = (c.client?.telephone || c.locataire?.telephone || '').toLowerCase()
      const nom = `${c.locataire?.prenom || c.client?.prenom || ''} ${c.locataire?.nom || c.client?.nom || ''}`.toLowerCase()
      const num = (c.numero || c.reference || '').toLowerCase()
      return tel.includes(q) || nom.includes(q) || num.includes(q)
    })
  }
  return liste
})

const { page, totalPages, itemsPage: contratsPage } = usePagination(contratsAffiches, 8)
watch([recherche, filtreStatut, sousFiltre], () => {
  page.value = 1
})

const nom = (p) => nomComplet(p)

const enCours = ref(false)

function ouvrir(id) {
  router.push(`/gestionnaire/contrats/${id}`)
}

function ouvrirPDF(cheminPDF) {
  if (!cheminPDF) return
  // Si le chemin ne commence pas par http, on le préfixe avec l'URL du backend
  const baseUrl = 'http://74.248.184.17:8080'
  const url = cheminPDF.startsWith('http') 
    ? cheminPDF 
    : `${baseUrl}${cheminPDF.startsWith('/') ? '' : '/'}${cheminPDF}`
  window.open(url, '_blank')
}

function rompre(contrat) {
  contratARompre.value = contrat
}

async function confirmerRupture() {
  if (enCours.value || !contratARompre.value) return
  enCours.value = true
  try {
    await contratsStore.demanderRupture(contratARompre.value.id)
    succes('Demande de rupture envoyée au locataire.')
    contratARompre.value = null
  } catch (e) {
    notifErreur('Erreur lors de la demande de rupture.')
  } finally {
    enCours.value = false
  }
}

const messageRupture = computed(() => {
  const c = contratARompre.value
  if (!c) return ''
  const nomClient = nom(c.locataire || c.client) || 'ce locataire'
  return `Contrat de ${nomClient}${c.bien?.intitule ? ` (${c.bien.intitule})` : ''}.\nLe locataire devra accepter ou refuser cette rupture.`
})

async function creerContrat(id) {
  if (enCours.value) return
  enCours.value = true
  try {
    await contratsStore.creerContratDefinitif(id)
    
    // Masquer localement le pré-contrat converti
    const statuts = JSON.parse(localStorage.getItem('nekaso_precontrats_statuts') || '{}')
    statuts[id] = 'TERMINE'
    localStorage.setItem('nekaso_precontrats_statuts', JSON.stringify(statuts))

    succes('Le contrat a été créé et activé avec succès.')
    await contratsStore.chargerGestionnaire()
  } catch (e) {
    const statut = e?.response?.status
    if (statut === 500) {
      notifErreur(
        "La création du contrat a échoué côté serveur (erreur 500). Réessayez plus tard ou contactez le support.",
      )
    } else {
      notifErreur(extraireMessageErreur(e, 'Erreur lors de la création du contrat.'))
    }
  } finally {
    enCours.value = false
  }
}

async function onPreContratCree(data) {
  try {
    const contrat = await preContratsStore.creer(data)
    wizardOuvert.value = false
    succes('Pré-contrat créé et envoyé au client.')
    if (contrat?.id) router.push(`/gestionnaire/contrats/${contrat.id}`)
  } catch (e) {
    notifErreur('Erreur lors de la création du pré-contrat.')
  }
}

function libelleStatut(s) {
  return {
    PRE_CONTRAT_ENVOYE: 'Pré-contrat envoyé',
    EN_ATTENTE: 'En attente',
    RETOURS_CLIENT: 'Retours client',
    PRE_CONTRAT_CORRIGE: 'Corrigé (renvoyé)',
    VALIDE_CLIENT: 'Validé par le client',
    VALIDER: 'Validé',
    INVALIDER: 'Invalidé',
    ACTIF: 'Actif',
    EN_RUPTURE: 'Rupture demandée',
    ROMPU: 'Rompu',
    TERMINE: 'Terminé',
    ANNULE: 'Annulé',
  }[s] || s
}
function chipClass(s) {
  return {
    PRE_CONTRAT_ENVOYE: 'chip--info',
    EN_ATTENTE: 'chip--warn',
    RETOURS_CLIENT: 'chip--warn',
    PRE_CONTRAT_CORRIGE: 'chip--info',
    VALIDE_CLIENT: 'chip--ok',
    VALIDER: 'chip--ok',
    INVALIDER: 'chip--danger',
    ACTIF: 'chip--green',
    EN_RUPTURE: 'chip--warn',
    ROMPU: 'chip--danger',
    ANNULE: 'chip--danger',
  }[s] || 'chip--neutre'
}
</script>

<style scoped>
.contrats-page {
  padding: 0;
}
.alerte-contrat {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 16px;
  font-size: 14px;
  cursor: pointer;
}
.alerte-contrat:hover {
  background: #d1fae5;
}
.alerte-contrat__icone {
  font-size: 20px;
}
.sous-filtres {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.sous-filtre {
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.sous-filtre:hover {
  background: #f1f5f9;
}
.sous-filtre.active {
  background: #1e293b;
  color: #fff;
  border-color: #1e293b;
}
.barre-filtres {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 14px 20px;
  flex-wrap: wrap;
}
.recherche {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px 12px;
  flex: 1;
  min-width: 260px;
}
.recherche input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  width: 100%;
  font-family: inherit;
}
.tabs {
  display: inline-flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 20px;
}
.tab {
  border: none;
  background: transparent;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  border-radius: 20px;
  cursor: pointer;
}
.tab.active {
  background: #fff;
  color: #1e293b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.liste-carte {
  padding: 0;
  overflow: hidden;
}
.tableau {
  width: 100%;
  border-collapse: collapse;
}
.tableau th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f9;
}
.tableau td {
  padding: 15px 20px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f8fafc;
}
.tableau tr:last-child td {
  border-bottom: none;
}
.fort {
  font-weight: 600;
  color: #111827;
}
.gris {
  color: #94a3b8;
}
.ta-right {
  text-align: right;
}
.ta-center {
  text-align: center;
}
.btn-ouvrir {
  background: #f1f5f9;
  border: none;
  border-radius: 7px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
}
.btn-creer-contrat {
  background: var(--couleur-primaire, #212d4d);
  border: none;
  border-radius: 7px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
}
.btn-creer-contrat:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.actions-contrat {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.btn-pdf {
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 7px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #dc2626;
  cursor: pointer;
}
.btn-rompre {
  background: #dc2626;
  border: none;
  border-radius: 7px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
}
.btn-rompre:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.rupture-attente {
  font-size: 12.5px;
  font-weight: 600;
  color: #b45309;
  white-space: nowrap;
}
.chip {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.chip--info {
  background: #dbeafe;
  color: #2563eb;
}
.chip--warn {
  background: #fef3c7;
  color: #b45309;
}
.chip--ok {
  background: #e0f2fe;
  color: #0369a1;
}
.chip--green {
  background: #dcfce7;
  color: #16a34a;
}
.chip--danger {
  background: #fee2e2;
  color: #dc2626;
}
.chip--neutre {
  background: #f3f4f6;
  color: #6b7280;
}
.vide {
  text-align: center;
  color: #94a3b8;
  padding: 40px;
}
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}
.wizard-modal {
  position: relative;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 14px;
}
.x {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #fff;
  border: none;
  border-radius: 6px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: #6b7280;
  z-index: 1;
}
</style>
