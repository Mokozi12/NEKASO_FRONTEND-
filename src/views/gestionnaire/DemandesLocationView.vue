<template>
  <div class="page-demandes">

    <!-- ── Barre supérieure ─────────────────────────────── -->
    <div class="page-topbar">
      <div class="topbar-left">
        <button class="btn-retour" @click="$router.back()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Retour
        </button>
        <span class="sep">|</span>
        <span class="topbar-subtitle">Toutes les demandes de location reçues</span>
      </div>
      <button class="btn-nouvelle" @click="modaleOuverte = true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nouvelle demande
      </button>
    </div>

    <!-- ── Section 1 : En attente ──────────────────────── -->
    <div class="carte section-carte">
      <div class="section-header">
        <h3 class="section-title">
          En attente
          <span v-if="demandesEnAttente.length > 0" class="badge-count">{{ demandesEnAttente.length }}</span>
        </h3>
      </div>

      <div v-if="demandesEnAttente.length > 0" class="table-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th>Candidat</th>
              <th>Contact</th>
              <th>Bien</th>
              <th>Date</th>
              <th class="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="demande in demandesAttentesPaginees" :key="demande.id" class="row">
              <td class="td-candidat">{{ demande.locataire ? `${demande.locataire.prenom || ''} ${demande.locataire.nom || ''}`.trim() : `Locataire #${demande.locataireId}` }}</td>
              <td class="td-contact">{{ demande.locataire?.telephone || '—' }}</td>
              <td>{{ demande.bien?.adresse || demande.bien?.libelle || (demande.bienId ? `Bien #${demande.bienId}` : '—') }}</td>
              <td>{{ demande.dateDemande || '—' }}</td>
              <td class="td-actions">
                <button class="btn-act btn-confirmer" @click="demandesStore.valider(demande.id)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Confirmer
                </button>
                <button class="btn-act btn-refuser" @click="demandesStore.refuser(demande.id)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Refuser
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="section-vide">Aucune demande en attente</div>

      <!-- Pagination En attente -->
      <div v-if="totalPagesAttentes > 1" class="pagination-bar">
        <button class="pagination-btn" :disabled="pageAttentes === 1" @click="pageAttentes--">Précédent</button>
        <button
          v-for="p in totalPagesAttentes"
          :key="p"
          class="pagination-btn"
          :class="{ 'pagination-btn--active': p === pageAttentes }"
          @click="pageAttentes = p"
        >{{ p }}</button>
        <button class="pagination-btn" :disabled="pageAttentes === totalPagesAttentes" @click="pageAttentes++">Suivant</button>
      </div>
    </div>

    <!-- ── Section 2 : Demandes confirmées ─────────────── -->
    <div class="carte section-carte">
      <div class="section-header">
        <h3 class="section-title">
          Demandes confirmées
          <span v-if="demandesValidees.length > 0" class="badge-count badge-count--green">{{ demandesValidees.length }}</span>
        </h3>
      </div>

      <div v-if="demandesValidees.length > 0" class="table-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th>Candidat</th>
              <th>Contact</th>
              <th>Bien</th>
              <th>Date</th>
              <th class="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="demande in demandesValideesPaginees" :key="demande.id" class="row row--confirmed">
              <td class="td-candidat">{{ demande.locataire ? `${demande.locataire.prenom || ''} ${demande.locataire.nom || ''}`.trim() : `Locataire #${demande.locataireId}` }}</td>
              <td class="td-contact">{{ demande.locataire?.telephone || '—' }}</td>
              <td>{{ demande.bien?.adresse || demande.bien?.libelle || (demande.bienId ? `Bien #${demande.bienId}` : '—') }}</td>
              <td>{{ demande.dateDemande || '—' }}</td>
              <td class="td-actions">
                <button class="btn-act btn-contrat" @click="$router.push('/gestionnaire/contrats')">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  Créer contrat
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="section-vide">Aucune demande confirmée pour le moment</div>

      <!-- Pagination Confirmées -->
      <div v-if="totalPagesValidees > 1" class="pagination-bar">
        <button class="pagination-btn" :disabled="pageValidees === 1" @click="pageValidees--">Précédent</button>
        <button
          v-for="p in totalPagesValidees"
          :key="p"
          class="pagination-btn"
          :class="{ 'pagination-btn--active': p === pageValidees }"
          @click="pageValidees = p"
        >{{ p }}</button>
        <button class="pagination-btn" :disabled="pageValidees === totalPagesValidees" @click="pageValidees++">Suivant</button>
      </div>
    </div>

    <!-- ── Modale nouvelle demande ──────────────────────── -->
    <NouvelleDemandeModal v-if="modaleOuverte" @close="modaleOuverte = false" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDemandesLocationStore } from '@/stores/demandesLocation.store'
import NouvelleDemandeModal from '@/components/demandesLocation/NouvelleDemandeModal.vue'

const demandesStore = useDemandesLocationStore()
const modaleOuverte = ref(false)

onMounted(() => demandesStore.charger())

// Sections — utilise les computed du store (gèrent VALIDEE + ACCEPTEE, REFUSEE + REFUSE)
const demandesEnAttente = computed(() => demandesStore.enAttente)
const demandesValidees = computed(() => demandesStore.validees)

// Pagination En attente
const pageAttentes = ref(1)
const parPage = 5

const totalPagesAttentes = computed(() =>
  Math.max(1, Math.ceil(demandesEnAttente.value.length / parPage)),
)
const demandesAttentesPaginees = computed(() => {
  const debut = (pageAttentes.value - 1) * parPage
  return demandesEnAttente.value.slice(debut, debut + parPage)
})

// Pagination Confirmées
const pageValidees = ref(1)

const totalPagesValidees = computed(() =>
  Math.max(1, Math.ceil(demandesValidees.value.length / parPage)),
)
const demandesValideesPaginees = computed(() => {
  const debut = (pageValidees.value - 1) * parPage
  return demandesValidees.value.slice(debut, debut + parPage)
})
</script>

<style scoped>
/* ── Page ─────────────────────────────────────────────── */
.page-demandes {
  padding: 0;
}

/* ── Topbar ───────────────────────────────────────────── */
.page-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-retour {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 7px;
  padding: 7px 14px;
  font-size: 13.5px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.btn-retour:hover { background: #f9fafb; }

.sep {
  color: #d1d5db;
  font-size: 16px;
  user-select: none;
}

.topbar-subtitle {
  font-size: 13.5px;
  color: #9ca3af;
}

.btn-nouvelle {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #111827;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}
.btn-nouvelle:hover { background: #1f2937; }

/* ── Sections ─────────────────────────────────────────── */
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

.section-vide {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 14px;
}

/* ── Tableau ──────────────────────────────────────────── */
.table-wrap {
  width: 100%;
  overflow-x: auto;
}

.tbl {
  width: 100%;
  border-collapse: collapse;
}

.tbl thead tr {
  background: #ffffff;
}

.tbl th {
  padding: 11px 20px;
  text-align: left;
  font-size: 13px;
  font-weight: 500;
  color: #9ca3af;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
}

.th-actions { text-align: right; }

.tbl td {
  padding: 15px 20px;
  font-size: 13.5px;
  color: #374151;
  border-bottom: 1px solid #f8f8f8;
  vertical-align: middle;
  white-space: nowrap;
}

.tbl tbody tr:last-child td { border-bottom: none; }
.row:hover td { background: #fafafa; }
.row--confirmed td { background: #f0fdf4; }
.row--confirmed:hover td { background: #dcfce7; }

.td-candidat {
  font-weight: 600;
  color: #111827 !important;
}

.td-contact {
  color: #9ca3af !important;
}

/* ── Actions ──────────────────────────────────────────── */
.td-actions {
  text-align: right;
}

.btn-act {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.btn-confirmer {
  background: #16a34a;
  color: white;
  border: none;
  margin-right: 6px;
}
.btn-confirmer:hover { background: #15803d; }

.btn-refuser {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}
.btn-refuser:hover { background: #f9fafb; }

.btn-contrat {
  background: #1e293b;
  color: white;
  border: none;
}
.btn-contrat:hover { background: #0f172a; }

/* ── Pagination ───────────────────────────────────────── */
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
.pagination-btn:hover:not(:disabled) { background: #f8fafc; color: #1e293b; }
.pagination-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pagination-btn--active { font-weight: 700; color: #1e293b; border-color: #cbd5e1; }
</style>
