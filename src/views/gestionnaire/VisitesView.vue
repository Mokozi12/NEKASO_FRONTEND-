<template>
  <div class="visites-page">
    <div class="page-header">
      <h1 class="page-title">Demandes de visites</h1>
      <p class="page-subtitle">
        Proposez un créneau et un agent ; le client accepte, puis vous proposez le pré-contrat après la visite.
      </p>
    </div>

<div class="tabs-container">
      <div class="tabs">
        <button
          v-for="t in onglets"
          :key="t.cle"
          class="tab"
          :class="{ active: ongletActif === t.cle }"
          @click="ongletActif = t.cle"
        >
          {{ t.libelle }}
          <span v-if="t.liste.length" class="tab-badge" :class="t.badge">{{ t.liste.length }}</span>
        </button>
      </div>
    </div>

<div v-if="ongletActif === 'attente'" class="carte section-carte">
      <table v-if="visitesStore.enAttente.length" class="tableau">
        <thead>
          <tr>
            <th>Client</th>
            <th>Contact</th>
            <th>Bien</th>
            <th>Demande</th>
            <th class="ta-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in itemsPage" :key="v.id">
            <td class="fort">{{ nom(v.client) }}</td>
            <td class="gris">{{ v.client?.telephone || '—' }}</td>
            <td>{{ v.bien?.intitule }}</td>
            <td class="gris">{{ formatDateHeure(v.dateCreation) }}</td>
            <td class="ta-right">
              <button class="btn-act btn-valider" @click="ouvrirValidation(v)">Valider</button>
              <button class="btn-act btn-refuser" @click="refuser(v.id)">Refuser</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="vide">Aucune demande en attente.</p>
    </div>

<div v-if="ongletActif === 'proposees'" class="carte section-carte">
      <table v-if="visitesStore.proposees.length" class="tableau">
        <thead>
          <tr>
            <th>Client</th>
            <th>Contact</th>
            <th>Bien</th>
            <th>Demande</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in itemsPage" :key="v.id">
            <td class="fort">{{ nom(v.client) }}</td>
            <td class="gris">{{ v.client?.telephone || '—' }}</td>
            <td>{{ v.bien?.intitule }}</td>
            <td class="gris">{{ formatDateHeure(v.dateCreation) }}</td>
            <td><span class="chip chip--attente">Créneau proposé — en attente du client</span></td>
          </tr>
        </tbody>
      </table>
      <p v-else class="vide">Aucun créneau en attente d'acceptation.</p>
    </div>

<div v-if="ongletActif === 'confirmees'" class="carte section-carte">
      <table v-if="visitesStore.confirmees.length" class="tableau">
        <thead>
          <tr>
            <th>Client</th>
            <th>Contact</th>
            <th>Bien</th>
            <th>Demande</th>
            <th class="ta-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in itemsPage" :key="v.id">
            <td class="fort">{{ nom(v.client) }}</td>
            <td class="gris">{{ v.client?.telephone || '—' }}</td>
            <td>{{ v.bien?.intitule }}</td>
            <td class="gris">{{ formatDateHeure(v.dateCreation) }}</td>
            <td class="ta-right">
              <button class="btn-act btn-valider" @click="ouvrirPrecontrat(v)">
                Créer un pré-contrat
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="vide">Aucune visite confirmée.</p>
    </div>

<div v-if="ongletActif === 'terminees'" class="carte section-carte">
      <table v-if="visitesStore.terminees.length" class="tableau">
        <thead>
          <tr>
            <th>Client</th>
            <th>Contact</th>
            <th>Bien</th>
            <th>Demande</th>
            <th>Statut / Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in itemsPage" :key="v.id">
            <td class="fort">{{ nom(v.client) }}</td>
            <td class="gris">{{ v.client?.telephone || '—' }}</td>
            <td>{{ v.bien?.intitule }}</td>
            <td class="gris">{{ formatDateHeure(v.dateCreation) }}</td>
            <td>
              <span v-if="visitesStore.preContratExiste(v)" class="chip chip--ok">Pré-contrat envoyé au client</span>
              <span v-else class="chip chip--neutre">Visite terminée</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="vide">Aucune visite terminée.</p>
    </div>

    <Pagination v-model="page" :total-pages="totalPages" />

<ModalValiderVisite
      v-if="visiteAValider"
      :visite="visiteAValider"
      @close="visiteAValider = null"
      @valider="confirmerValidation"
    />
    <ModalProposerPrecontrat
      v-if="visitePrecontrat"
      :visite="visitePrecontrat"
      :en-cours="enCoursPrecontrat"
      @close="visitePrecontrat = null"
      @proposer="confirmerPrecontrat"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useVisitesGestionnaireStore } from '@/stores/visitesGestionnaire.store'
import { useNotification } from '@/composables/useNotification'
import { useFormat } from '@/composables/useFormat'
import { usePagination } from '@/composables/usePagination'
import ModalValiderVisite from '@/components/visites/ModalValiderVisite.vue'
import ModalProposerPrecontrat from '@/components/visites/ModalProposerPrecontrat.vue'
import Pagination from '@/components/common/Pagination.vue'
import { extraireMessageErreur } from '@/utils/apiResponse'

const visitesStore = useVisitesGestionnaireStore()
const { succes, info, erreur } = useNotification()
const { formatDateHeure } = useFormat()

onMounted(() => visitesStore.charger())

const ongletActif = ref('attente')
const onglets = computed(() => [
  { cle: 'attente', libelle: 'En attente', liste: visitesStore.enAttente, badge: '' },
  { cle: 'proposees', libelle: 'Proposées', liste: visitesStore.proposees, badge: 'tab-badge--blue' },
  { cle: 'confirmees', libelle: 'Confirmées', liste: visitesStore.confirmees, badge: visitesStore.confirmees.length ? 'tab-badge--red' : 'tab-badge--green' },
  { cle: 'terminees', libelle: 'Terminées', liste: visitesStore.terminees, badge: '' },
])

const listeActive = computed(
  () =>
    ({
      attente: visitesStore.enAttente,
      proposees: visitesStore.proposees,
      confirmees: visitesStore.confirmees,
      terminees: visitesStore.terminees,
    })[ongletActif.value] || [],
)
const { page, totalPages, itemsPage } = usePagination(listeActive, 8)
watch(ongletActif, () => {
  page.value = 1
})

const nom = (p) => p ? `${p.prenom || ''} ${p.nom || ''}`.trim() || p.telephone || '—' : '—'

const visiteAValider = ref(null)
function ouvrirValidation(v) {
  visiteAValider.value = v
}
function versCreneau(date, heure) {
  if (!date) return undefined
  const [y, m, d] = date.split('-')
  return `${d}/${m}/${y} ${heure || '00:00'}`
}
async function confirmerValidation(payload) {
  const { date, heure, agentId } = payload
  try {
    await visitesStore.proposerCreneau(visiteAValider.value.id, {
      creneauVisite: versCreneau(date, heure),
      idAgent: agentId,
    })
    succes('Créneau proposé au client (en attente de son acceptation).')
    visiteAValider.value = null
  } catch (e) {
    erreur(extraireMessageErreur(e, 'Impossible de proposer le créneau'))
  }
}
async function refuser(id) {
  await visitesStore.refuser(id)
  info('Demande de visite refusée.')
}

const visitePrecontrat = ref(null)
const enCoursPrecontrat = ref(false)
function ouvrirPrecontrat(v) {
  visitePrecontrat.value = v
}
async function confirmerPrecontrat(payload) {
  enCoursPrecontrat.value = true
  try {
    await visitesStore.proposerPrecontrat(visitePrecontrat.value.id, payload)
    succes('Pré-contrat envoyé au client pour validation. La visite passe en « Terminées ».')
    visitePrecontrat.value = null
  } catch (e) {
    erreur(extraireMessageErreur(e, 'Impossible de proposer le pré-contrat'))
  } finally {
    enCoursPrecontrat.value = false
  }
}
</script>

<style scoped>
.visites-page {
  padding: 0;
}
.tabs-container {
  margin-bottom: 20px;
}
.tabs {
  display: inline-flex;
  background: #fff;
  padding: 4px;
  border-radius: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  flex-wrap: wrap;
}
.tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s;
}
.tab.active {
  background: #1e293b;
  color: #fff;
}
.tab-badge {
  background: #e2e8f0;
  color: #475569;
  border-radius: 20px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
}
.tab-badge--green {
  background: #dcfce7;
  color: #16a34a;
}
.tab-badge--blue {
  background: #dbeafe;
  color: #2563eb;
}
.tab-badge--red {
  background: #fee2e2;
  color: #ef4444;
}
.section-carte {
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
.btn-act {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  margin-left: 6px;
}
.btn-valider {
  background: #00d15a;
  color: #fff;
}
.btn-refuser {
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
}
.btn-cloturer {
  background: #212d4d;
  color: #fff;
}
.chip {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.chip--attente {
  background: #fef3c7;
  color: #b45309;
}
.chip--ok {
  background: #dcfce7;
  color: #16a34a;
}
.chip--neutre {
  background: #f3f4f6;
  color: #6b7280;
}
.vide {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 14px;
}
</style>
