<template>
  <div class="bien-detail-view">
    
    <div class="view-header">
      <h1 class="view-title">Fiche du bien</h1>
    </div>

    
    <div class="detail-actions-header">
      <div class="detail-title-group">
        <button class="btn-retour" @click="router.push('/gestionnaire/biens')">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Retour
        </button>
        <h2 class="bien-nom">{{ bien.libelle || bien.intitule }}</h2>
        <span :class="['status-badge', getStatutClass(bien.statutBien)]">
          {{ formatStatut(bien.statutBien) }}
        </span>
      </div>

      <div class="detail-actions-group">
        <button class="btn-icon" title="Favoris">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            ></polygon>
          </svg>
        </button>
        <button class="btn-modifier" @click="showEditModal = true">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Modifier
        </button>
      </div>
    </div>

    
    <div class="detail-layout">
      
      <div class="detail-main">
        
        <div class="main-photo-container">
          <img :src="getPhoto(bien)" :alt="bien.libelle || bien.intitule" />
        </div>

        
        <div class="info-card">
          <h3 class="card-title">Informations principales</h3>

          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">ADRESSE</span>
              <span class="info-value">{{ bien.adresse }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">TYPE</span>
              <span class="info-value">{{ formatTypeBien(bien.typeBien) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">SURFACE</span>
              <span class="info-value">{{ bien.surface }} m²</span>
            </div>
            <div class="info-item">
              <span class="info-label">PIÈCES</span>
              <span class="info-value">{{ bien.nombrePieces }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">LOYER</span>
              <span class="info-value">{{ formatMontant(bien.loyer) }} FCFA</span>
            </div>
            <div class="info-item">
              <span class="info-label">CHARGES</span>
              <span class="info-value">{{ formatMontant(bien.charges) }} FCFA</span>
            </div>
            <div class="info-item full-width">
              <span class="info-label">DESCRIPTION</span>
              <span class="info-value">{{ bien.description }}</span>
            </div>
          </div>
        </div>
      </div>

      
      <div class="detail-sidebar">
        
        <div class="sidebar-card">
          <h3 class="card-title">Locataire actuel</h3>
          <template v-if="bien.locataire">
            <div class="locataire-info">
              <div class="locataire-avatar">{{ getInitial(bien.locataire) }}</div>
              <div class="locataire-details">
                <span class="locataire-nom"
                  >{{ bien.locataire.prenom }} {{ bien.locataire.nom }}</span
                >
                <span class="locataire-date">Depuis {{ bien.locataire.dateDebut }}</span>
              </div>
            </div>
            <div class="locataire-loyer">
              Loyer : {{ formatMontant(bien.locataire.loyer || bien.loyer) }} FCFA
            </div>
            <button class="btn-outline full-width mt-16">Renouveler le bail</button>
          </template>
          <template v-else>
            <p class="no-locataire">Aucun locataire actuellement</p>
          </template>
        </div>

        
        <div class="sidebar-card">
          <h3 class="card-title">Paiements</h3>
          <div class="paiement-row">
            <span class="paiement-label">Total perçu</span>
            <span class="paiement-value success">{{ formatMontant(bien.loyer) }} FCFA</span>
          </div>
          <div class="paiement-row">
            <span class="paiement-label">Impayés</span>
            <span class="paiement-value danger">0 FCFA</span>
          </div>
          <button class="btn-outline full-width mt-16">Voir tous les paiements</button>
        </div>

        
        <div class="action-buttons-stack">
          <button class="btn-primary-dark" @click="telechargerContrat">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Télécharger le contrat
          </button>
          <button class="btn-secondary" @click="router.push('/gestionnaire/paiements')">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
            Historique des paiements
          </button>
        </div>
      </div>
    </div>

    
    <FormulaireBien
      :show="showEditModal"
      :is-edit="true"
      :initial-data="bien"
      @cancel="showEditModal = false"
      @save="handleEditSave"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBiensStore } from '@/stores/biens.store'
import { useFormat } from '@/composables/useFormat'
import FormulaireBien from '@/components/biens/FormulaireBien.vue'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const route = useRoute()
const biensStore = useBiensStore()
const { formatMontant } = useFormat()

const showEditModal = ref(false)
const { succes } = useNotification()

function telechargerContrat() {
  succes('Téléchargement du contrat en cours...')
}

onMounted(async () => {
  if (biensStore.biens.length === 0) {
    await biensStore.charger()
  }
})

const bien = computed(() => {
  const id = Number(route.params.id)
  return (
    biensStore.biens.find((b) => b.id === id) || {
      id: 1,
      libelle: 'Appartement Almadies',
      adresse: 'Rue 12, Almadies, Dakar',
      typeBien: 'APPARTEMENT',
      surface: 85,
      nombrePieces: 3,
      loyer: 450000,
      charges: 25000,
      statutBien: 'LOUE',
      description: 'Bel appartement lumineux avec vue mer.',
      photos: [
        {
          id: 1,
          urlPhoto:
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=400&fit=crop',
        },
      ],
      locataire: { id: 6, nom: 'Diop', prenom: 'Aminata', dateDebut: '2025-09-01', loyer: 450000 },
    }
  )
})

function getPhoto(bien) {
  if (bien.photos && bien.photos.length > 0 && bien.photos[0].urlPhoto) {
    return bien.photos[0].urlPhoto.replace('w=400&h=400', 'w=1200&h=500')
  }
  return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=500&fit=crop'
}

function formatTypeBien(type) {
  const types = {
    APPARTEMENT: 'Appartement',
    STUDIO: 'Studio',
    BUREAU: 'Bureau',
    VILLA: 'Villa',
    CHAMBRE: 'Chambre',
  }
  return types[type] || type
}

function formatStatut(statut) {
  const statuts = { LOUE: 'Loué', DISPONIBLE: 'Disponible', RESERVE: 'Réservé', ARCHIVE: 'Archivé' }
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

function getInitial(locataire) {
  return locataire.prenom ? locataire.prenom.charAt(0).toUpperCase() : 'L'
}

const handleEditSave = (data) => {
  if (import.meta.env.DEV) console.log('Modifié:', data)
  showEditModal.value = false
}

</script>

<style scoped>
.bien-detail-view {
  padding: 8px 0;
}

.view-header {
  margin-bottom: 24px;
}

.view-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}


.detail-actions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.detail-title-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-retour {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.btn-retour:hover {
  color: #111827;
}

.bien-nom {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

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

.detail-actions-group {
  display: flex;
  gap: 12px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background-color: #f9fafb;
  color: #111827;
}

.btn-modifier {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-modifier:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}


.detail-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}


.main-photo-container {
  width: 100%;
  height: 320px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.main-photo-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.info-card,
.sidebar-card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 24px;
  column-gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}


.sidebar-card {
  margin-bottom: 24px;
}

.locataire-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.locataire-avatar {
  width: 40px;
  height: 40px;
  background-color: #1e293b;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}

.locataire-details {
  display: flex;
  flex-direction: column;
}

.locataire-nom {
  font-weight: 600;
  font-size: 14px;
  color: #111827;
}

.locataire-date {
  font-size: 13px;
  color: #6b7280;
}

.locataire-loyer {
  font-size: 13px;
  color: #6b7280;
}

.no-locataire {
  font-size: 14px;
  color: #9ca3af;
  font-style: italic;
}

.paiement-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
}

.paiement-label {
  color: #6b7280;
}

.paiement-value {
  font-weight: 600;
}

.success {
  color: #10b981;
}
.danger {
  color: #ef4444;
}

.mt-16 {
  margin-top: 16px;
}


.btn-outline {
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #374151;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.full-width {
  width: 100%;
}

.action-buttons-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-buttons-stack button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.btn-primary-dark {
  background-color: #1e293b;
  color: white;
  border: none;
}

.btn-primary-dark:hover {
  background-color: #0f172a;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.3);
}

.btn-secondary {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

.btn-danger-outline {
  background-color: white;
  border: 1px solid #fecaca;
  color: #ef4444;
}

.btn-danger-outline:hover {
  background-color: #fef2f2;
}
</style>
