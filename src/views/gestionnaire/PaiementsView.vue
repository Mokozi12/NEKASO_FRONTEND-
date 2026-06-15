<template>
  <div class="page-paiements">

    <!-- ── 3 cartes statistiques ──────────────────────── -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-card__label">Total perçu ce mois</span>
        <span class="stat-card__value stat-card__value--green">{{ formatMontant(totalPercu) }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__label">Total en retard</span>
        <span class="stat-card__value stat-card__value--red">{{ formatMontant(totalEnRetardMontant) }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__label">Taux de perception</span>
        <span class="stat-card__value">{{ tauxPerception }}%</span>
      </div>
    </div>

    <!-- ── Filtres globaux ────────────────────────────── -->
    <div class="filtres-row">
      <div class="filtre-select">
        <select id="filtre-mois" v-model="filtreMois">
          <option value="">Tous les mois</option>
          <option v-for="m in listeMois" :key="m" :value="m">{{ m }}</option>
        </select>
        <svg class="filtre-select__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="#64748b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="filtre-select">
        <select id="filtre-locataire" v-model="filtreLocataire">
          <option value="">Tous locataires</option>
          <option v-for="l in listeLocataires" :key="l" :value="l">{{ l }}</option>
        </select>
        <svg class="filtre-select__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="#64748b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- ── Section 1 : Paiements effectués ───────────── -->
    <section class="panel section-panel">
      <div class="panel__header">
        <h2 class="panel__title">
          Paiements effectués
          <span v-if="paiementsPayes.length > 0" class="badge-compte">{{ paiementsPayes.length }}</span>
        </h2>
      </div>

      <div v-if="paiementsStore.chargement" class="etat-vide">
        <div class="spinner"></div><p>Chargement…</p>
      </div>
      <div v-else-if="paiementsPayes.length === 0" class="etat-vide">
        <p>Aucun paiement effectué</p>
      </div>
      <div v-else class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th class="th--bien">Bien</th>
              <th class="th--locataire">Locataire</th>
              <th>Mois</th>
              <th>Montant payé</th>
              <th class="th--actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in payesPagines" :key="p.id">
              <td class="td--bien">
                <span class="cell-intitule">{{ p.bien?.libelle || p.bien?.intitule || p.bien?.adresse || '—' }}</span>
                <span class="cell-adresse">{{ p.bien?.adresse || '' }}</span>
              </td>
              <td class="td--locataire">
                <span class="cell-nom">{{ p.locataire?.prenom }} {{ p.locataire?.nom }}</span>
              </td>
              <td class="td--date">{{ p.mois }}</td>
              <td class="td--montant td--montant-vert">{{ formatMontant(p.montant) }}</td>
              <td class="td--actions">
                <div class="actions">
                  <button :id="`quittance-${p.id}`" class="btn-outline btn-outline--icon" @click="telechargerQuittance(p.id)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Quittance
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination payés -->
      <div v-if="totalPagesPayes > 1" class="pagination-bar">
        <button class="pagination-btn" :disabled="pagePayes === 1" @click="pagePayes--">Précédent</button>
        <button v-for="p in totalPagesPayes" :key="p" class="pagination-btn" :class="{ 'pagination-btn--active': p === pagePayes }" @click="pagePayes = p">{{ p }}</button>
        <button class="pagination-btn" :disabled="pagePayes === totalPagesPayes" @click="pagePayes++">Suivant</button>
      </div>
    </section>

    <!-- ── Section 2 : Paiements à recevoir ──────────── -->
    <section class="panel section-panel">
      <div class="panel__header">
        <h2 class="panel__title">
          Paiements à recevoir
          <span v-if="paiementsImpayes.length > 0" class="badge-compte badge-compte--red">{{ paiementsImpayes.length }}</span>
        </h2>
        <button id="btn-enregistrer-paiement" class="btn-nouveau" @click="ouvrirNouveau">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Enregistrer paiement
        </button>
      </div>

      <div v-if="paiementsImpayes.length === 0" class="etat-vide">
        <p>Tous les paiements sont à jour</p>
      </div>
      <div v-else class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th class="th--bien">Bien</th>
              <th class="th--locataire">Locataire</th>
              <th>Mois</th>
              <th>Montant payé</th>
              <th class="th--actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in impayesPagines"
              :key="p.id"
              :class="{ 'tr--retard': p.statut === 'EN_RETARD' }"
            >
              <td class="td--bien">
                <span class="cell-intitule">{{ p.bien?.libelle || p.bien?.intitule || p.bien?.adresse || '—' }}</span>
                <span class="cell-adresse">{{ p.bien?.adresse || '' }}</span>
              </td>
              <td class="td--locataire">
                <span class="cell-nom">{{ p.locataire?.prenom }} {{ p.locataire?.nom }}</span>
              </td>
              <td class="td--date">
                <span class="cell-date">
                  {{ p.mois }}
                  <svg v-if="p.statut === 'EN_RETARD'" class="cell-date__warn" width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#ef4444" stroke-width="2"/>
                    <path d="M12 8v4" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="12" cy="16" r="1" fill="#ef4444"/>
                  </svg>
                </span>
              </td>
              <td class="td--montant td--montant-gris">0 FCFA</td>
              <td class="td--actions">
                <div class="actions">
                  <button :id="`encaisser-${p.id}`" class="btn-green" @click="ouvrirEncaisser(p)">Encaisser</button>
                  <button v-if="p.statut === 'EN_RETARD'" :id="`relancer-${p.id}`" class="btn-outline btn-outline--icon" @click="relancer(p)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                    Relancer
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination impayés -->
      <div v-if="totalPagesImpayes > 1" class="pagination-bar">
        <button class="pagination-btn" :disabled="pageImpayes === 1" @click="pageImpayes--">Précédent</button>
        <button v-for="p in totalPagesImpayes" :key="p" class="pagination-btn" :class="{ 'pagination-btn--active': p === pageImpayes }" @click="pageImpayes = p">{{ p }}</button>
        <button class="pagination-btn" :disabled="pageImpayes === totalPagesImpayes" @click="pageImpayes++">Suivant</button>
      </div>
    </section>

    <!-- ── Modals ──────────────────────────────────────── -->
    <ModalPaiement
      :show="modalEncaisser"
      :paiement="paiementSelectionne"
      mode="encaisser"
      @close="modalEncaisser = false"
      @submit="handleEncaissement"
    />
    <ModalPaiement
      :show="modalNouveau"
      mode="nouveau"
      :contrats="contratsStore.enCours"
      @close="modalNouveau = false"
      @submit="handleNouveauPaiement"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePaiementsStore } from '@/stores/paiements.store'
import { useContratsStore } from '@/stores/contrats.store'
import ModalPaiement from '@/components/paiements/ModalPaiement.vue'
import { useNotification } from '@/composables/useNotification'

const paiementsStore = usePaiementsStore()
const contratsStore = useContratsStore()
const { succes, erreur } = useNotification()

/* ── État local ──────────────────────────────────────── */
const modalEncaisser = ref(false)
const modalNouveau = ref(false)
const paiementSelectionne = ref(null)
const filtreMois = ref('')
const filtreLocataire = ref('')

/* ── Statistiques ────────────────────────────────────── */
const totalPercu = computed(() => paiementsStore.totalMois || 0)

const totalEnRetardMontant = computed(() =>
  paiementsStore.enRetard.reduce((s, p) => s + (p.montant || 0), 0),
)

const tauxPerception = computed(() => {
  const d = totalPercu.value + totalEnRetardMontant.value
  return d ? Math.round((totalPercu.value / d) * 100) : 0
})

/* ── Listes pour les filtres ─────────────────────────── */
const listeMois = computed(() =>
  [...new Set(paiementsStore.paiements.map((p) => p.mois))].sort(),
)

const listeLocataires = computed(() => {
  const noms = paiementsStore.paiements
    .map((p) => `${p.locataire?.prenom} ${p.locataire?.nom}`.trim())
    .filter(Boolean)
  return [...new Set(noms)].sort()
})

/* ── Paiements filtrés ───────────────────────────────── */
const paiementsFiltres = computed(() =>
  paiementsStore.paiements.filter((p) => {
    const okMois = !filtreMois.value || p.mois === filtreMois.value
    const okLoc =
      !filtreLocataire.value ||
      `${p.locataire?.prenom} ${p.locataire?.nom}`.trim() === filtreLocataire.value
    return okMois && okLoc
  }),
)

const paiementsPayes = computed(() =>
  paiementsFiltres.value.filter((p) => p.statut === 'PAYE'),
)

const paiementsImpayes = computed(() =>
  paiementsFiltres.value.filter((p) => p.statut !== 'PAYE'),
)

/* ── Pagination ──────────────────────────────────────── */
const parPage = 5

const pagePayes = ref(1)
const totalPagesPayes = computed(() =>
  Math.max(1, Math.ceil(paiementsPayes.value.length / parPage)),
)
const payesPagines = computed(() => {
  const debut = (pagePayes.value - 1) * parPage
  return paiementsPayes.value.slice(debut, debut + parPage)
})

const pageImpayes = ref(1)
const totalPagesImpayes = computed(() =>
  Math.max(1, Math.ceil(paiementsImpayes.value.length / parPage)),
)
const impayesPagines = computed(() => {
  const debut = (pageImpayes.value - 1) * parPage
  return paiementsImpayes.value.slice(debut, debut + parPage)
})

/* ── Helpers ─────────────────────────────────────────── */
function formatMontant(val) {
  if (val == null) return ''
  return new Intl.NumberFormat('fr-FR').format(val) + ' FCFA'
}

/* ── Handlers ────────────────────────────────────────── */
function ouvrirEncaisser(p) {
  paiementSelectionne.value = p
  modalEncaisser.value = true
}

async function handleEncaissement(payload) {
  try {
    await paiementsStore.enregistrer(payload)
    succes('Encaissement enregistré')
    modalEncaisser.value = false
  } catch (e) {
    erreur(e?.response?.data?.message || "Erreur lors de l'encaissement")
  }
}

function ouvrirNouveau() {
  modalNouveau.value = true
}

function handleNouveauPaiement() {
  succes('Paiement enregistré')
  modalNouveau.value = false
}

function telechargerQuittance(id) {
  paiementsStore.telechargerQuittance(id)
}

function relancer(p) {
  succes(`Relance envoyée pour ${p.locataire?.prenom}`)
}

onMounted(async () => {
  await Promise.all([paiementsStore.charger(), contratsStore.charger()])
})
</script>

<style scoped>
.page-paiements {
  padding: 0;
}

/* ── Stats ─────────────────────────────────────────────── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 18px;
}

.stat-card {
  background: var(--fond-carte, #fff);
  border: 1px solid var(--bordure, #e5e7eb);
  border-radius: var(--bordure-radius, 12px);
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: var(--ombre-carte);
}

.stat-card__label {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--texte-secondaire, #6b7280);
  line-height: 1;
}

.stat-card__value {
  font-size: 24px;
  font-weight: 800;
  color: var(--texte-principal, #1f2937);
  letter-spacing: -0.4px;
  line-height: 1.15;
}

.stat-card__value--green { color: #16a34a; }
.stat-card__value--red   { color: #dc2626; }

/* ── Filtres ──────────────────────────────────────────── */
.filtres-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.filtre-select {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.filtre-select select {
  appearance: none;
  -webkit-appearance: none;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 34px 8px 13px;
  font-size: 13px;
  color: #334155;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  min-width: 150px;
  line-height: 1.35;
  transition: border-color .15s;
}
.filtre-select select:focus { border-color: #94a3b8; }

.filtre-select__chevron {
  position: absolute;
  right: 11px;
  pointer-events: none;
}

/* ── Sections ─────────────────────────────────────────── */
.section-panel {
  margin-bottom: 20px;
}

.panel {
  background: var(--fond-carte, #fff);
  border: 1px solid var(--bordure, #e5e7eb);
  border-radius: var(--bordure-radius, 12px);
  overflow: hidden;
}

.panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid #f3f4f6;
}

.panel__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--texte-principal, #1f2937);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-compte {
  background: #e2e8f0;
  color: #475569;
  border-radius: 20px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
}

.badge-compte--red {
  background: #fee2e2;
  color: #dc2626;
}

/* ── Bouton Enregistrer ──────────────────────────────── */
.btn-nouveau {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #0f172a;
  color: #fff;
  border: none;
  padding: 9px 16px;
  border-radius: var(--bordure-radius-petit, 8px);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  line-height: 1;
  transition: background .15s;
}
.btn-nouveau:hover { background: #1e293b; }

/* ── État vide ────────────────────────────────────────── */
.etat-vide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 48px 0;
  color: #94a3b8;
  font-size: 14px;
}
.etat-vide p { margin: 0; }

.spinner {
  width: 26px;
  height: 26px;
  border: 3px solid #e2e8f0;
  border-top-color: #0f172a;
  border-radius: 50%;
  animation: spin .65s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Tableau ──────────────────────────────────────────── */
.table-scroll {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.table thead tr {
  border-bottom: 1px solid #eef2f6;
}

.table th {
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-align: left;
  white-space: nowrap;
  letter-spacing: 0.15px;
}
.th--bien { min-width: 160px; }
.th--locataire { min-width: 140px; }
.th--actions   { text-align: right; padding-right: 6px; }

.table td {
  padding: 14px 14px;
  font-size: 13.5px;
  color: #1e293b;
  border-bottom: 1px solid #f5f7fa;
  vertical-align: middle;
}
.table tbody tr:last-child td { border-bottom: none; }
.table tbody tr:hover { background: #fafaff; }
.table tbody tr.tr--retard { background: #fff5f5; }
.table tbody tr.tr--retard:hover { background: #fef2f2; }

/* ── Colonnes ─────────────────────────────────────────── */
.td--bien { min-width: 160px; }

.cell-intitule {
  display: block;
  font-weight: 600;
  color: #0f172a;
  font-size: 13.5px;
  line-height: 1.25;
  margin-bottom: 2px;
}

.cell-adresse {
  display: block;
  font-size: 11.5px;
  color: #94a3b8;
  line-height: 1.3;
}

.td--locataire { min-width: 140px; }

.cell-nom {
  display: block;
  font-weight: 500;
  color: #334155;
  font-size: 13.5px;
}

.td--date { white-space: nowrap; }

.cell-date {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.cell-date__warn { flex-shrink: 0; }

.td--montant {
  font-weight: 500;
  white-space: nowrap;
}
.td--montant-vert { color: #16a34a !important; font-weight: 700; }
.td--montant-gris { color: #94a3b8 !important; font-weight: 400; }

/* ── Boutons actions ──────────────────────────────────── */
.td--actions {
  min-width: 160px;
  padding-right: 6px !important;
}

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 7px;
}

.btn-green {
  background: #16a34a;
  color: #fff;
  border: none;
  padding: 6px 15px;
  border-radius: 7px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  line-height: 1.4;
  transition: background .15s;
}
.btn-green:hover { background: #15803d; }

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #334155;
  padding: 6px 12px;
  border-radius: 7px;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  line-height: 1.4;
  transition: background .12s, border-color .12s;
  white-space: nowrap;
}
.btn-outline:hover { background: #f8fafc; border-color: #cbd5e1; }

/* ── Pagination ───────────────────────────────────────── */
.pagination-bar {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
  padding: 12px 14px;
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

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 860px) {
  .stats-row { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .stats-row { grid-template-columns: 1fr; }
  .panel__header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .filtres-row { flex-wrap: wrap; }
}
</style>
