<template>
  <div class="visites-page">
    <div class="page-header">
      <h1 class="page-title">Demandes de visites</h1>
      <p class="page-subtitle">
        Validez les visites en affectant un créneau et un agent, puis suivez-les jusqu'à la clôture.
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

<div v-if="ongletActif === 'validees'" class="carte section-carte">
      <table v-if="visitesStore.validees.length" class="tableau">
        <thead>
          <tr>
            <th>Client</th>
            <th>Bien</th>
            <th>Créneau</th>
            <th>Agent affecté</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in itemsPage" :key="v.id">
            <td class="fort">{{ nom(v.client) }}</td>
            <td>{{ v.bien?.intitule }}</td>
            <td>{{ formatDate(v.creneau?.date) }} à {{ v.creneau?.heure }}</td>
            <td>{{ nom(v.agent) }} <span class="gris">· {{ v.agent?.telephone }}</span></td>
            <td><span class="chip chip--attente">En attente d'acceptation client</span></td>
          </tr>
        </tbody>
      </table>
      <p v-else class="vide">Aucune visite validée.</p>
    </div>

<div v-if="ongletActif === 'confirmees'" class="carte section-carte">
      <table v-if="visitesStore.confirmees.length" class="tableau">
        <thead>
          <tr>
            <th>Client</th>
            <th>Bien</th>
            <th>Créneau</th>
            <th>Agent</th>
            <th class="ta-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in itemsPage" :key="v.id">
            <td class="fort">{{ nom(v.client) }}</td>
            <td>{{ v.bien?.intitule }}</td>
            <td>{{ formatDate(v.creneau?.date) }} à {{ v.creneau?.heure }}</td>
            <td>{{ nom(v.agent) }}</td>
            <td class="ta-right">
              <button class="btn-act btn-cloturer" @click="ouvrirCloture(v)">Clôturer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="vide">Aucune visite confirmée.</p>
    </div>

<div v-if="ongletActif === 'cloturees'" class="carte section-carte">
      <table v-if="visitesStore.cloturees.length" class="tableau">
        <thead>
          <tr>
            <th>Client</th>
            <th>Bien</th>
            <th>Issue</th>
            <th>Compte-rendu</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in itemsPage" :key="v.id">
            <td class="fort">{{ nom(v.client) }}</td>
            <td>{{ v.bien?.intitule }}</td>
            <td>
              <span
                class="chip"
                :class="v.statut === 'CLOTUREE_AVEC_CONTRAT' ? 'chip--ok' : 'chip--neutre'"
              >
                {{ v.statut === 'CLOTUREE_AVEC_CONTRAT' ? 'Avec contrat' : 'Sans suite' }}
              </span>
            </td>
            <td class="gris">{{ v.compteRendu?.texte || '—' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="vide">Aucune visite clôturée.</p>
    </div>

    <Pagination v-model="page" :total-pages="totalPages" />

<ModalValiderVisite
      v-if="visiteAValider"
      :visite="visiteAValider"
      @close="visiteAValider = null"
      @valider="confirmerValidation"
    />
    <ModalCloturerVisite
      v-if="visiteACloturer"
      :visite="visiteACloturer"
      @close="visiteACloturer = null"
      @cloturer="confirmerCloture"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVisitesGestionnaireStore } from '@/stores/visitesGestionnaire.store'
import { useNotification } from '@/composables/useNotification'
import { useFormat } from '@/composables/useFormat'
import { usePagination } from '@/composables/usePagination'
import ModalValiderVisite from '@/components/visites/ModalValiderVisite.vue'
import ModalCloturerVisite from '@/components/visites/ModalCloturerVisite.vue'
import Pagination from '@/components/common/Pagination.vue'

const router = useRouter()
const visitesStore = useVisitesGestionnaireStore()
const { succes, info } = useNotification()
const { formatDate, formatDateHeure } = useFormat()

onMounted(() => visitesStore.charger())

const ongletActif = ref('attente')
const onglets = computed(() => [
  { cle: 'attente', libelle: 'En attente', liste: visitesStore.enAttente, badge: '' },
  { cle: 'validees', libelle: 'Validées', liste: visitesStore.validees, badge: 'tab-badge--blue' },
  { cle: 'confirmees', libelle: 'Confirmées', liste: visitesStore.confirmees, badge: 'tab-badge--green' },
  { cle: 'cloturees', libelle: 'Clôturées', liste: visitesStore.cloturees, badge: '' },
])

const listeActive = computed(
  () =>
    ({
      attente: visitesStore.enAttente,
      validees: visitesStore.validees,
      confirmees: visitesStore.confirmees,
      cloturees: visitesStore.cloturees,
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
async function confirmerValidation(payload) {
  const { date, heure, agentId } = payload
  await visitesStore.confirmer(visiteAValider.value.id, visiteAValider.value.bien?.id || visiteAValider.value.bienId, agentId)
  succes('Visite validée : le client a été notifié du créneau et de l\'agent.')
  visiteAValider.value = null
}
async function refuser(id) {
  await visitesStore.refuser(id)
  info('Demande de visite refusée.')
}

const visiteACloturer = ref(null)
function ouvrirCloture(v) {
  visiteACloturer.value = v
}
async function confirmerCloture(payload) {
  const statut = payload.issue === 'AVEC_CONTRAT' ? 'CLOTUREE_AVEC_CONTRAT' : 'CLOTUREE_SANS_CONTRAT'
  await visitesStore.changerStatut(visiteACloturer.value.id, statut)
  visiteACloturer.value = null
  if (payload.issue === 'AVEC_CONTRAT') {
    succes('Visite clôturée. Contactez le locataire pour créer le contrat.')
  } else {
    info('Visite clôturée sans suite.')
  }
  ongletActif.value = 'cloturees'
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
