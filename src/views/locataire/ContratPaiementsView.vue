<template>
  <div class="contrat-paiements">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Contrat & Paiements</h1>
        <p class="page-subtitle">
          Consultez votre bail et l'historique des loyers validés par votre gestionnaire.
        </p>
      </div>

      
      <div class="tabs-container">
        <div class="tabs">
          <button
            class="tab"
            :class="{ active: activeTab === 'contrat' }"
            @click="activeTab = 'contrat'"
          >
            Contrat
          </button>
          <button
            class="tab"
            :class="{ active: activeTab === 'historique' }"
            @click="activeTab = 'historique'"
          >
            Historique
          </button>
        </div>
      </div>

      
      <div v-if="activeTab === 'contrat'" class="tab-content">
        <div class="contrat-card">
          <div class="contrat-header">
            <div class="header-left">
              <div class="contrat-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div class="contrat-title-block">
                <h2 class="contrat-title">Bail de location résidentielle</h2>
                <div class="contrat-ref">Référence: {{ contrat?.reference || 'NKS-2025-P5' }}</div>
              </div>
            </div>
            <button class="btn-download" @click="telechargerPDF">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Télécharger PDF
            </button>
          </div>

          <div class="contrat-grid">
            <div class="contrat-section">
              <div class="section-label">Bien loué</div>
              <div class="section-value">{{ contrat?.bien?.titre || 'Appartement familial' }}</div>
            </div>

            <div class="contrat-section">
              <div class="section-label">Adresse</div>
              <div class="section-value">
                {{ contrat?.bien?.adresse?.quartier || 'Sacré-Cœur' }},
                {{ contrat?.bien?.adresse?.ville || 'Dakar' }}
              </div>
            </div>

            <div class="contrat-section">
              <div class="section-label">Loyer mensuel</div>
              <div class="section-value">{{ formatMontant(contrat?.loyerMensuel || 350000) }}</div>
            </div>

            <div class="contrat-section">
              <div class="section-label">Caution</div>
              <div class="section-value">{{ formatMontant(contrat?.caution || 700000) }}</div>
            </div>

            <div class="contrat-section">
              <div class="section-label">Date de début</div>
              <div class="section-value">{{ formatDate(contrat?.dateDebut) || '01/09/2025' }}</div>
            </div>

            <div class="contrat-section">
              <div class="section-label">Date de fin</div>
              <div class="section-value">{{ formatDate(contrat?.dateFin) || '31/08/2026' }}</div>
            </div>

            <div class="contrat-section">
              <div class="section-label">Gestionnaire</div>
              <div class="section-value">{{ contrat?.gestionnaire?.nom || 'Mme Faye' }}</div>
            </div>

            <div class="contrat-section">
              <div class="section-label">Contact</div>
              <div class="section-value">
                {{ contrat?.gestionnaire?.telephone || '+221 77 567 89 01' }}
              </div>
            </div>
          </div>

          <div class="info-banner bottom-banner">
            <div class="alert-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            Pour toute modification, contactez directement votre gestionnaire via WhatsApp.
          </div>
        </div>
      </div>

      
      <div v-if="activeTab === 'historique'" class="tab-content">
        <div class="info-banner top-banner">
          <div class="alert-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          Historique validé par votre gestionnaire. Les paiements s'effectuent en Orange Money, Wave
          ou espèces — aucune transaction en ligne.
        </div>

        <div class="paiements-table-container">
          <table class="paiements-table">
            <thead>
              <tr>
                <th>MOIS</th>
                <th>MONTANT</th>
                <th>DATE DE VALIDATION</th>
                <th>STATUT</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="paiement in displayPaiements" :key="paiement.id">
                <td class="font-medium">{{ paiement.mois }}</td>
                <td class="font-bold">{{ formatMontant(paiement.montant) }}</td>
                <td>{{ paiement.dateValidation ? paiement.dateValidation : '—' }}</td>
                <td>
                  <div class="status-pill" :class="getPaiementStatusClass(paiement.statut)">
                    <svg
                      v-if="paiement.statut === 'paye'"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <svg
                      v-else-if="paiement.statut === 'attente'"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {{ formatPaiementStatus(paiement.statut) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ChargementSpinner v-if="isLoading" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useContratsLocataireStore } from '@/stores/contratsLocataire.store'
import { usePaiementsLocataireStore } from '@/stores/paiementsLocataire.store'
import { useToast } from 'vue-toastification'
import ChargementSpinner from '@/components/biens/common/ChargementSpinner.vue'

const route = useRoute()
const contratsStore = useContratsLocataireStore()
const paiementsStore = usePaiementsLocataireStore()
const toast = useToast()

const activeTab = ref('contrat')
const contrat = ref(null)
const paiements = ref([])
const isLoading = ref(false)

const mockPaiements = [
  { id: 1, mois: 'Avril 2026', montant: 350000, dateValidation: null, statut: 'attente' },
  { id: 2, mois: 'Mars 2026', montant: 350000, dateValidation: '03/03/2026', statut: 'paye' },
  { id: 3, mois: 'Février 2026', montant: 350000, dateValidation: '02/02/2026', statut: 'paye' },
  { id: 4, mois: 'Janvier 2026', montant: 350000, dateValidation: '15/01/2026', statut: 'retard' },
  { id: 5, mois: 'Décembre 2025', montant: 350000, dateValidation: '02/12/2025', statut: 'paye' },
  { id: 6, mois: 'Novembre 2025', montant: 350000, dateValidation: '01/11/2025', statut: 'paye' },
]

onMounted(async () => {
  isLoading.value = true
  await contratsStore.chargerContratsActifs({ page: 1, size: 20 })

  if (route.params.id) {
    contrat.value = contratsStore.contratsActifs.find((c) => c.id == route.params.id)
  } else if (contratsStore.contratsActifs.length > 0) {
    contrat.value = contratsStore.contratsActifs[0]
  }

  if (contrat.value) {
    await paiementsStore.chargerPaiements(contrat.value.id, { page: 1, size: 20 })
    paiements.value = paiementsStore.paiements
  }

  isLoading.value = false
})

const displayPaiements = computed(() => {
  return mockPaiements
})

const formatMontant = (montant) => {
  if (!montant) return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'decimal' }).format(montant) + ' FCFA'
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const telechargerPDF = () => {
  toast.info('Téléchargement du contrat en PDF...')
}

const formatPaiementStatus = (statut) => {
  const statuts = {
    attente: 'Attente',
    paye: 'Payé',
    retard: 'Retard',
  }
  return statuts[statut] || statut
}

const getPaiementStatusClass = (statut) => {
  if (statut === 'paye') return 'status-success'
  if (statut === 'attente') return 'status-warning'
  if (statut === 'retard') return 'status-danger'
  return ''
}
</script>

<style scoped>
.contrat-paiements {
  padding: 40px 0 80px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 15px;
  color: #64748b;
}


.tabs-container {
  margin-bottom: 32px;
}

.tabs {
  display: inline-flex;
  background-color: #ffffff;
  padding: 4px;
  border-radius: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}

.tab {
  background: transparent;
  border: none;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab.active {
  background-color: #1e293b; 
  color: #ffffff;
}

.tab:hover:not(.active) {
  color: #1e293b;
}


.tab-content {
  background-color: white;
  border-radius: 12px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 2px 4px rgba(0, 0, 0, 0.05);
}

.contrat-card {
  padding: 32px;
}

.contrat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.contrat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.contrat-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
  margin-top: 0;
}

.contrat-ref {
  font-size: 13px;
  color: #94a3b8;
}

.btn-download {
  background-color: #1e293b;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-download:hover {
  background-color: #0f172a;
}

.contrat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px 24px;
  margin-bottom: 40px;
}

.contrat-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-value {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}


.info-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #f1f5f9; 
  border-radius: 8px;
  padding: 16px;
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
}

.alert-icon {
  display: flex;
  align-items: center;
  color: #64748b;
}

.bottom-banner {
  margin-top: 24px;
}

.top-banner {
  margin: 32px 32px 0 32px;
  background-color: #ffffff;
  border: 1px solid #f1f5f9; 
  color: #64748b;
}


.paiements-table-container {
  padding: 32px;
}

.paiements-table {
  width: 100%;
  border-collapse: collapse;
}

.paiements-table th {
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 16px 8px;
  border-bottom: 1px solid #e2e8f0;
}

.paiements-table td {
  padding: 20px 8px;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
  font-size: 14px;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

.paiements-table tr:last-child td {
  border-bottom: none;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-success {
  background-color: #dcfce7;
  color: #16a34a;
}

.status-warning {
  background-color: #fef3c7;
  color: #d97706;
}

.status-danger {
  background-color: #fee2e2;
  color: #dc2626;
}

@media (max-width: 768px) {
  .contrat-grid {
    grid-template-columns: 1fr;
  }

  .contrat-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
</style>
