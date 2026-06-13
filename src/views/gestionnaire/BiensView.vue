<template>
  <div class="biens-view">
    <!-- Actions Row -->
    <div class="page-actions-section">
      <span class="biens-count">{{ biensAffiches.length }} bien(s) trouvé(s)</span>
      <button class="btn-ajouter" @click="openAddModal">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Ajouter un bien
      </button>
    </div>

    <!-- Content Card -->
    <div class="content-card">
      <!-- Filters -->
      <div class="biens-filters">
        <div class="search-bar">
          <svg
            class="search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Rechercher par nom ou adresse..."
            class="search-input"
            v-model="searchQuery"
          />
        </div>

        <div class="filter-dropdowns">
          <div class="select-wrapper">
            <select class="filter-select" v-model="filterStatut">
              <option value="">Tous statuts</option>
              <option value="DISPONIBLE">Disponible</option>
              <option value="LOUE">Loué</option>
              <option value="RESERVE">Réservé</option>
            </select>
            <svg
              class="select-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <div class="select-wrapper">
            <select class="filter-select" v-model="filterType">
              <option value="">Tous types</option>
              <option value="APPARTEMENT">Appartement</option>
              <option value="STUDIO">Studio</option>
              <option value="BUREAU">Bureau</option>
              <option value="VILLA">Villa</option>
              <option value="CHAMBRE">Chambre</option>
            </select>
            <svg
              class="select-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <!-- Chargement -->
      <div v-if="biensStore.chargement" class="loading-state">
        Chargement des biens...
      </div>

      <!-- Erreur -->
      <div v-else-if="biensStore.erreur" class="error-state">
        {{ biensStore.erreur }}
        <button @click="biensStore.charger()" class="btn-retry">Réessayer</button>
      </div>

      <!-- Table -->
      <div v-else class="table-responsive">
        <table class="biens-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Intitulé</th>
              <th>Localisation</th>
              <th>Type</th>
              <th>Loyer</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bien in biensPagines" :key="bien.id">
              <td>
                <div class="bien-photo">
                  <img :src="getPhoto(bien)" :alt="getIntitule(bien)" />
                </div>
              </td>
              <td class="bien-intitule">{{ getIntitule(bien) }}</td>
              <td class="bien-localisation">{{ bien.adresse }}</td>
              <td class="bien-type">{{ formatTypeBien(bien.typeBien) }}</td>
              <td class="bien-loyer">{{ formatMontant(bien.loyer) }} FCFA</td>
              <td>
                <span :class="['status-badge', getStatutClass(bien.statutBien)]">
                  {{ formatStatut(bien.statutBien) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn" title="Voir les détails" @click="viewDetails(bien.id)">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                  <button
                    class="action-btn"
                    title="Modifier"
                    :disabled="bien.statutBien === 'LOUE'"
                    @click="openEditModal(bien)"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </button>
                  <button
                    class="action-btn action-btn--orange"
                    title="Archiver"
                    :disabled="bien.statutBien === 'LOUE'"
                    @click="openArchiveModal(bien)"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path
                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                      ></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="biensAffiches.length === 0">
              <td colspan="7" class="empty-state">
                <div class="empty-content">
                  <p>Aucun bien trouvé</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="biens-pagination">
      <div class="pagination-info">
        <span>Afficher 10 lignes</span>
      </div>
      <div class="pagination-controls">
        <button class="pagination-btn" :disabled="pageActuelle === 1" @click="pageActuelle--">
          Précédent
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          class="pagination-btn"
          :class="{ 'pagination-btn--active': page === pageActuelle }"
          @click="pageActuelle = page"
        >
          {{ page }}
        </button>
        <button
          class="pagination-btn"
          :disabled="pageActuelle === totalPages"
          @click="pageActuelle++"
        >
          Suivant
        </button>
      </div>
    </div>

    <!-- Modals -->
    <FormulaireBien
      :show="showAddModal"
      :is-edit="false"
      @cancel="showAddModal = false"
      @save="handleAddSave"
    />

    <FormulaireBien
      :show="showEditModal"
      :is-edit="true"
      :initial-data="selectedBien"
      @cancel="showEditModal = false"
      @save="handleEditSave"
    />

    <ModalConfirmation
      :show="showArchiveModal"
      @cancel="showArchiveModal = false"
      @confirm="handleArchiveConfirm"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBiensStore } from '@/stores/biens.store'
import { useFormat } from '@/composables/useFormat'
import FormulaireBien from '@/components/biens/FormulaireBien.vue'
import ModalConfirmation from '@/components/biens/common/ModalConfirmation.vue'

const router = useRouter()
const biensStore = useBiensStore()
const { formatMontant } = useFormat()

// Charger les biens au montage
onMounted(() => {
  biensStore.charger({ page: 1, size: 10 })
})

// Filtres
const searchQuery = ref('')
const filterStatut = ref('')
const filterType = ref('')

// Pagination
const pageActuelle = ref(1)
const parPage = ref(10)

// Modal states
const showAddModal = ref(false)
const showEditModal = ref(false)
const showArchiveModal = ref(false)
const selectedBien = ref(null)

// Biens filtrés
const biensAffiches = computed(() => {
  let result = biensStore.biens

  // Filtre recherche
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (b) =>
        (b.intitule && b.intitule.toLowerCase().includes(q)) || b.adresse.toLowerCase().includes(q),
    )
  }

  // Filtre statut
  if (filterStatut.value) {
    result = result.filter((b) => b.statutBien === filterStatut.value)
  }

  // Filtre type
  if (filterType.value) {
    result = result.filter((b) => b.typeBien === filterType.value)
  }

  return result
})

// Pagination calculée
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(biensAffiches.value.length / parPage.value))
})

const biensPagines = computed(() => {
  const debut = (pageActuelle.value - 1) * parPage.value
  return biensAffiches.value.slice(debut, debut + parPage.value)
})

// Helpers d'affichage
function getIntitule(bien) {
  return bien.intitule || `${formatTypeBien(bien.typeBien)} - ${bien.adresse}`
}

function getPhoto(bien) {
  if (bien.photos && bien.photos.length > 0 && bien.photos[0].urlPhoto) {
    return bien.photos[0].urlPhoto
  }
  return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&h=100&fit=crop'
}

function formatTypeBien(type) {
  const types = {
    APPARTEMENT: 'Appartement',
    STUDIO: 'Studio',
    CHAMBRE: 'Chambre',
    LOCAL: 'Local',
  }
  return types[type] || type
}

function formatStatut(statut) {
  const statuts = {
    LOUE: 'Loué',
    DISPONIBLE: 'Disponible',
    RESERVE: 'Réservé',
    ARCHIVE: 'Archivé',
  }
  return statuts[statut] || statut
}

function getStatutClass(statut) {
  const classes = {
    LOUE: 'status-badge--loue',
    DISPONIBLE: 'status-badge--disponible',
    RESERVE: 'status-badge--reserve',
    ARCHIVE: 'status-badge--archive',
  }
  return classes[statut] || ''
}

// Actions
const openAddModal = () => {
  showAddModal.value = true
}

const openEditModal = (bien) => {
  selectedBien.value = bien
  showEditModal.value = true
}

const openArchiveModal = (bien) => {
  selectedBien.value = bien
  showArchiveModal.value = true
}

const handleAddSave = async (data) => {
  try {
    await biensStore.creer(data)
    showAddModal.value = false
  } catch (error) {
    console.error('Erreur lors de la création', error)
  }
}

const handleEditSave = async (data) => {
  try {
    if (selectedBien.value) {
      await biensStore.modifier(selectedBien.value.id, data)
    }
    showEditModal.value = false
  } catch (error) {
    console.error('Erreur lors de la modification', error)
  }
}

const handleArchiveConfirm = () => {
  if (selectedBien.value) {
    biensStore.archiver(selectedBien.value.id)
  }
  showArchiveModal.value = false
}

const viewDetails = (id) => {
  router.push(`/gestionnaire/biens/${id}`)
}
</script>

<style scoped>
.loading-state {
  text-align: center;
  padding: 48px 0;
  color: #64748b;
  font-size: 14px;
}

.error-state {
  text-align: center;
  padding: 32px 0;
  color: #dc2626;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.btn-retry {
  padding: 8px 16px;
  background-color: #1e293b;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.biens-view {
  padding: 0 16px;
  background-color: transparent;
}

.page-actions-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.biens-count {
  font-size: 14px;
  color: #64748b;
}

.btn-ajouter {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #1e293b;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.content-card {
  background-color: white;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  padding: 16px 24px;
  margin-bottom: 24px;
}

.biens-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-bar {
  flex: 2;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  background-color: #f8fafc;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  outline: none;
}

.filter-dropdowns {
  flex: 1.5;
  display: flex;
  gap: 16px;
}

.select-wrapper {
  flex: 1;
  position: relative;
}

.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.filter-select {
  width: 100%;
  padding: 10px 32px 10px 16px;
  background-color: #f8fafc;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  appearance: none;
  cursor: pointer;
  outline: none;
}

.biens-table {
  width: 100%;
  border-collapse: collapse;
}

.biens-table thead th {
  background-color: white;
  border-bottom: 1px solid #f1f5f9;
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.biens-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.biens-table tbody tr {
  transition: background-color 0.15s ease;
}

.biens-table tbody tr:hover {
  background-color: #f8fafc;
}

.biens-table tbody tr:last-child td {
  border-bottom: none;
}

.bien-photo {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  overflow: hidden;
}

.bien-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bien-intitule {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.bien-localisation {
  color: #64748b;
  font-size: 14px;
}

.bien-type,
.bien-loyer {
  color: #334155;
  font-size: 14px;
}

/* Status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  padding: 6px 0;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.025em;
}

.status-badge--loue {
  background-color: #dbeafe;
  color: #2563eb;
}

.status-badge--disponible {
  background-color: #dcfce7;
  color: #16a34a;
}

.status-badge--reserve {
  background-color: #fef3c7;
  color: #d97706;
}

.status-badge--archive {
  background-color: #f3f4f6;
  color: #4b5563;
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-btn {
  background: none;
  border: none;
  color: #334155;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border-radius: 6px;
}

.action-btn:hover {
  background-color: #f1f5f9;
}

.action-btn--orange {
  color: #f59e0b;
}

.action-btn--orange:hover {
  background-color: #fffbeb;
}

.action-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 48px 0 !important;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #9ca3af;
  font-size: 14px;
}

.biens-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.pagination-info {
  font-size: 14px;
  color: #64748b;
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.pagination-btn {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  background-color: white;
  border-radius: 6px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f8fafc;
  color: #1e293b;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn--active {
  background-color: white;
  color: #1e293b;
  font-weight: 600;
  border-color: #cbd5e1;
}
</style>
