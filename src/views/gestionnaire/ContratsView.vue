<!--
  ContratsView (gestionnaire) — §9, §10.

  Liste des contrats (pré-contrats + actifs), filtrable par téléphone, nom client
  ou numéro de contrat. La gestion des paiements se fait en ouvrant un contrat.
  Un assistant permet de créer un nouveau pré-contrat (§9-bis).
-->
<template>
  <div class="contrats-page">
    <div class="page-header page-header--flex">
      <div>
        <h1 class="page-title">Contrats</h1>
        <p class="page-subtitle">
          Pré-contrats et contrats actifs. Ouvrez un contrat pour gérer les paiements.
        </p>
      </div>
      <button class="btn-nouvelle" @click="wizardOuvert = true">+ Nouveau pré-contrat</button>
    </div>

    <!-- Filtres (§10) -->
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
          @click="filtreStatut = t.cle"
        >
          {{ t.libelle }}
        </button>
      </div>
    </div>

    <div class="carte liste-carte">
      <table v-if="contratsAffiches.length" class="tableau">
        <thead>
          <tr>
            <th>N° contrat</th>
            <th>Client</th>
            <th>Téléphone</th>
            <th>Bien</th>
            <th>Loyer</th>
            <th>Statut</th>
            <th class="ta-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in contratsPage" :key="c.id">
            <td class="fort">{{ c.numero }}</td>
            <td>{{ nom(c.client) }}</td>
            <td class="gris">{{ c.client?.telephone }}</td>
            <td>{{ c.bien?.intitule }}</td>
            <td>{{ formatMontant(c.montantLoyer) }} FCFA</td>
            <td><span class="chip" :class="chipClass(c.statut)">{{ libelleStatut(c.statut) }}</span></td>
            <td class="ta-right">
              <button class="btn-ouvrir" @click="ouvrir(c.id)">Ouvrir</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="vide">Aucun contrat ne correspond.</p>
    </div>

    <Pagination v-model="page" :total-pages="totalPages" />

    <!-- Wizard pré-contrat -->
    <div v-if="wizardOuvert" class="overlay" @click.self="wizardOuvert = false">
      <div class="wizard-modal">
        <button class="x" @click="wizardOuvert = false" aria-label="Fermer">✕</button>
        <WizardContrat
          :clients="clients"
          :biens="biensDisponibles"
          @cree="onPreContratCree"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useContratsStore } from '@/stores/contrats.store'
import { useBiensStore } from '@/stores/biens.store'
import { useNotification } from '@/composables/useNotification'
import { useFormat } from '@/composables/useFormat'
import { usePagination } from '@/composables/usePagination'
import { db, nomComplet, STATUTS_PRE_CONTRAT, STATUT_CONTRAT } from '@/mocks/db'
import WizardContrat from '@/components/contrats/WizardContrat.vue'
import Pagination from '@/components/common/Pagination.vue'

const router = useRouter()
const contratsStore = useContratsStore()
const biensStore = useBiensStore()
const { succes } = useNotification()
const { formatMontant } = useFormat()

const recherche = ref('')
const filtreStatut = ref('tous')
const wizardOuvert = ref(false)

const tabs = [
  { cle: 'tous', libelle: 'Tous' },
  { cle: 'precontrats', libelle: 'Pré-contrats' },
  { cle: 'actifs', libelle: 'Actifs' },
]

const clients = computed(() => db.clients)
const biensDisponibles = computed(() =>
  biensStore.biens.filter((b) => ['DISPONIBLE', 'RESERVE'].includes(b.statutBien)),
)

const contratsAffiches = computed(() => {
  let liste = contratsStore.filtrer(recherche.value)
  if (filtreStatut.value === 'precontrats') {
    liste = liste.filter((c) => STATUTS_PRE_CONTRAT.includes(c.statut))
  } else if (filtreStatut.value === 'actifs') {
    liste = liste.filter((c) => c.statut === STATUT_CONTRAT.ACTIF)
  }
  return liste
})

const { page, totalPages, itemsPage: contratsPage } = usePagination(contratsAffiches, 8)
// Revenir en page 1 quand le filtre ou la recherche change.
watch([recherche, filtreStatut], () => {
  page.value = 1
})

const nom = (p) => nomComplet(p)

function ouvrir(id) {
  router.push(`/gestionnaire/contrats/${id}`)
}

async function onPreContratCree(data) {
  const contrat = await contratsStore.creerPreContratDepuisWizard(data)
  wizardOuvert.value = false
  succes('Pré-contrat créé et envoyé au client.')
  router.push(`/gestionnaire/contrats/${contrat.id}`)
}

function libelleStatut(s) {
  return {
    PRE_CONTRAT_ENVOYE: 'Pré-contrat envoyé',
    RETOURS_CLIENT: 'Retours client',
    PRE_CONTRAT_CORRIGE: 'Corrigé (renvoyé)',
    VALIDE_CLIENT: 'Validé par le client',
    ACTIF: 'Actif',
    TERMINE: 'Terminé',
    ANNULE: 'Annulé',
  }[s] || s
}
function chipClass(s) {
  return {
    PRE_CONTRAT_ENVOYE: 'chip--info',
    RETOURS_CLIENT: 'chip--warn',
    PRE_CONTRAT_CORRIGE: 'chip--info',
    VALIDE_CLIENT: 'chip--ok',
    ACTIF: 'chip--green',
    ANNULE: 'chip--danger',
  }[s] || 'chip--neutre'
}
</script>

<style scoped>
.contrats-page {
  padding: 0;
}
.page-header--flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.btn-nouvelle {
  background: #212d4d;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
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
