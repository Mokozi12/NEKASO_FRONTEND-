<template>
  <div class="visites-page">
    <!-- En-tête (sans boutons) -->
    <div class="visites-header">
      <h2 class="visites-titre">Demandes de visites</h2>
    </div>

    <ChargementSpinner v-if="visitesStore.chargement" message="Chargement des visites..." />

    <template v-else>
      <!-- Section 1 : En attente -->
      <div class="carte section-carte">
        <div class="section-header">
          <h3 class="section-title">
            En attente
            <span v-if="visitesEnAttente.length > 0" class="badge-count">{{
              visitesEnAttente.length
            }}</span>
          </h3>
        </div>
        <div v-if="visitesEnAttente.length > 0" class="tableau-wrapper">
          <table class="tableau">
            <thead>
              <tr>
                <th>Locataire</th>
                <th>Bien</th>
                <th>Date demande</th>
                <th>Statut</th>
                <th class="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="visite in visitesAttentesPaginees" :key="visite.id">
                <td>
                  <strong>Locataire #{{ visite.id_Locataire }}</strong>
                </td>
                <td>{{ visite.bien?.libelle || visite.bien?.adresse || '—' }}</td>
                <td>{{ visite.dateCreation ? new Date(visite.dateCreation).toLocaleDateString('fr-FR') : '—' }}</td>
                <td>{{ visite.statut || '—' }}</td>
                <td class="cellule-actions">
                  <button
                    type="button"
                    class="btn-action btn-action--confirmer"
                    @click="confirmer(visite.id)"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Confirmer
                  </button>
                  <button
                    type="button"
                    class="btn-action btn-action--refuser"
                    @click="refuser(visite.id)"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Refuser
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Pagination En attente -->
          <div v-if="totalPagesAttentes > 1" class="pagination-bar">
            <button class="pagination-btn" :disabled="pageAttentes === 1" @click="pageAttentes--">
              Précédent
            </button>
            <button
              v-for="p in totalPagesAttentes"
              :key="p"
              class="pagination-btn"
              :class="{ 'pagination-btn--active': p === pageAttentes }"
              @click="pageAttentes = p"
            >
              {{ p }}
            </button>
            <button
              class="pagination-btn"
              :disabled="pageAttentes === totalPagesAttentes"
              @click="pageAttentes++"
            >
              Suivant
            </button>
          </div>
        </div>
        <MessageVide v-else icone="📅" texte="Aucune demande en attente" class="visites-vide" />
      </div>

      <!-- Section 2 : Visites confirmées (avec pagination) -->
      <div class="carte section-carte">
        <div class="section-header">
          <h3 class="section-title">
            Visites confirmées
            <span v-if="visitesTraitees.length > 0" class="badge-count badge-count--green">{{
              visitesTraitees.length
            }}</span>
          </h3>
          <button type="button" class="btn-export" @click="exporterCalendrier">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Exporter
          </button>
        </div>

        <template v-if="visitesTraitees.length > 0">
          <div class="tableau-wrapper">
            <table class="tableau">
              <thead>
                <tr>
                  <th>Locataire</th>
                  <th>Bien</th>
                  <th>Date demande</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="visite in visitesPaginees" :key="visite.id">
                  <td>
                    <strong>Locataire #{{ visite.id_Locataire }}</strong>
                  </td>
                  <td>{{ visite.bien?.libelle || visite.bien?.adresse || '—' }}</td>
                  <td>{{ visite.dateCreation ? new Date(visite.dateCreation).toLocaleDateString('fr-FR') : '—' }}</td>
                  <td>{{ visite.statut || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div class="pagination-bar">
            <button
              class="pagination-btn"
              :disabled="pageConfirmees === 1"
              @click="pageConfirmees--"
            >
              Précédent
            </button>
            <button
              v-for="p in totalPagesConfirmees"
              :key="p"
              class="pagination-btn"
              :class="{ 'pagination-btn--active': p === pageConfirmees }"
              @click="pageConfirmees = p"
            >
              {{ p }}
            </button>
            <button
              class="pagination-btn"
              :disabled="pageConfirmees === totalPagesConfirmees"
              @click="pageConfirmees++"
            >
              Suivant
            </button>
          </div>
        </template>
        <MessageVide
          v-else
          icone="✅"
          texte="Aucune visite confirmée pour l'instant"
          class="visites-vide"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useVisitesStore } from '@/stores/visites.store'
import ChargementSpinner from '@/components/biens/common/ChargementSpinner.vue'
import MessageVide from '@/components/biens/common/MessageVide.vue'

const visitesStore = useVisitesStore()

const visitesEnAttente = computed(() =>
  visitesStore.visites.filter((v) => v.statut === 'EN_ATTENTE'),
)

const visitesTraitees = computed(() =>
  visitesStore.visites.filter((v) => v.statut !== 'EN_ATTENTE'),
)

// Pagination En attente
const pageAttentes = ref(1)
const parPageAttentes = 5
const totalPagesAttentes = computed(() =>
  Math.max(1, Math.ceil(visitesEnAttente.value.length / parPageAttentes)),
)
const visitesAttentesPaginees = computed(() => {
  const debut = (pageAttentes.value - 1) * parPageAttentes
  return visitesEnAttente.value.slice(debut, debut + parPageAttentes)
})

// Pagination pour les visites traitées (confirmées/refusées)
const pageConfirmees = ref(1)
const parPageConfirmees = 5

const totalPagesConfirmees = computed(() =>
  Math.max(1, Math.ceil(visitesTraitees.value.length / parPageConfirmees)),
)

const visitesPaginees = computed(() => {
  const debut = (pageConfirmees.value - 1) * parPageConfirmees
  return visitesTraitees.value.slice(debut, debut + parPageConfirmees)
})

function confirmer(id) {
  visitesStore.confirmer(id)
}

function refuser(id) {
  visitesStore.refuser(id)
}

function exporterCalendrier() {
  const evenements = visitesTraitees.value.map((v) => {
    const date = (v.dateCreation || '').split('T')[0].replace(/-/g, '') || new Date().toISOString().split('T')[0].replace(/-/g, '')
    return [
      'BEGIN:VEVENT',
      `UID:visite-${v.id}@nekaso`,
      `DTSTART:${date}T090000`,
      `SUMMARY:Visite - Locataire #${v.id_Locataire}`,
      `DESCRIPTION:${v.bien?.libelle || v.bien?.adresse || ''}`,
      'END:VEVENT',
    ].join('\r\n')
  })
  const contenu = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NEKASO//FR',
    ...evenements,
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([contenu], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const lien = document.createElement('a')
  lien.href = url
  lien.download = 'visites-nekaso.ics'
  lien.click()
  URL.revokeObjectURL(url)
}

onMounted(() => visitesStore.charger())
</script>

<style scoped>
.visites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.visites-titre {
  font-size: 20px;
  font-weight: 700;
  color: var(--couleur-primaire);
  margin: 0;
}

/* Sections */
.section-carte {
  margin-bottom: 20px;
  padding: 0;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-count {
  background: #e2e8f0;
  color: #475569;
  border-radius: 20px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
}

.badge-count--green {
  background: #dcfce7;
  color: #16a34a;
}

/* Tableau */
.tableau-wrapper {
  overflow-x: auto;
}

.th-actions {
  text-align: right;
}

.cellule-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;
}

/* Boutons d'action */
.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.btn-action--confirmer,
.btn-action--attribuer {
  background-color: #16a34a;
  color: white;
  border: none;
}
.btn-action--confirmer:hover,
.btn-action--attribuer:hover {
  opacity: 0.9;
}

.btn-action--refuser {
  background-color: white;
  color: var(--texte-principal);
  border: 1px solid var(--bordure);
}
.btn-action--refuser:hover {
  color: var(--couleur-danger);
  border-color: #fecaca;
}

.btn-action--texte {
  background: transparent;
  border: none;
  color: var(--texte-principal);
  padding: 6px 8px;
  font-weight: 500;
}
.btn-action--texte:hover {
  color: var(--couleur-primaire);
}

/* Bouton export */
.btn-export {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  background: white;
  color: var(--texte-principal);
  border: 1px solid var(--bordure);
  border-radius: 7px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-export:hover {
  background: var(--fond-general);
}

.visites-vide {
  padding: 40px 20px;
}

/* Pagination */
.pagination-bar {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
  padding: 12px 20px;
  border-top: 1px solid #f3f4f6;
}

.pagination-btn {
  padding: 5px 11px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
}
.pagination-btn:hover:not(:disabled) {
  background: #f8fafc;
  color: #1e293b;
}
.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.pagination-btn--active {
  font-weight: 700;
  color: #1e293b;
  border-color: #cbd5e1;
}

@media (max-width: 768px) {
  .visites-header {
    flex-direction: column;
    gap: 12px;
  }
  .cellule-actions {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
</style>
