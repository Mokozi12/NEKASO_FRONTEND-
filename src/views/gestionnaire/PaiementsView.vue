<template>
  <div class="page-paiements">

    <!-- Titre géré par le HeaderGestionnaire -->

    <!-- ────────────────────────────────────────────────
         3 CARTES STATISTIQUES
    ──────────────────────────────────────────────── -->
    <div class="stats-row">

      <!-- Carte 1 : Total perçu -->
      <div class="stat-card">
        <span class="stat-card__label">Total perçu ce mois</span>
        <span class="stat-card__value stat-card__value--green">
          {{ formatMontant(totalPercu) }}
        </span>
      </div>

      <!-- Carte 2 : Total en retard -->
      <div class="stat-card">
        <span class="stat-card__label">Total en retard</span>
        <span class="stat-card__value stat-card__value--red">
          {{ formatMontant(totalEnRetardMontant) }}
        </span>
      </div>

      <!-- Carte 3 : Taux de perception -->
      <div class="stat-card">
        <span class="stat-card__label">Taux de perception</span>
        <span class="stat-card__value">{{ tauxPerception }}%</span>
      </div>

    </div>

    <!-- ────────────────────────────────────────────────
         CONTENEUR TABLEAU
    ──────────────────────────────────────────────── -->
    <section class="panel">

      <!-- En-tête : titre + bouton -->
      <div class="panel__header">
        <h2 class="panel__title">Paiements et quittances</h2>
        <button id="btn-enregistrer-paiement" class="btn-nouveau" @click="ouvrirNouveau">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Enregistrer paiement
        </button>
      </div>

      <!-- Filtres -->
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

      <!-- Chargement -->
      <div v-if="paiementsStore.chargement" class="etat-vide">
        <div class="spinner"></div>
        <p>Chargement…</p>
      </div>

      <!-- Aucun résultat -->
      <div v-else-if="paiementsFiltres.length === 0" class="etat-vide">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
        <p>Aucun paiement trouvé</p>
      </div>

      <!-- ─── TABLEAU ──────────────────────────────── -->
      <div v-else class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th class="th--locataire">Locataire / Bien</th>
              <th>Date due</th>
              <th>Montant dû</th>
              <th>Montant payé</th>
              <th>Statut</th>
              <th class="th--actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in paiementsFiltres"
              :key="p.id"
              :class="{ 'tr--retard': p.statut === 'EN_RETARD' }"
            >
              <!-- Locataire / Bien -->
              <td class="td--locataire">
                <span class="cell-nom">{{ p.locataire?.prenom }} {{ p.locataire?.nom }}</span>
                <span class="cell-bien">{{ p.bien?.adresse || '—' }}</span>
              </td>

              <!-- Date due -->
              <td class="td--date">
                <span class="cell-date">
                  {{ p.mois }}
                  <svg
                    v-if="p.statut === 'EN_RETARD'"
                    class="cell-date__warn"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle cx="12" cy="12" r="10" stroke="#ef4444" stroke-width="2"/>
                    <path d="M12 8v4" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="12" cy="16" r="1" fill="#ef4444"/>
                  </svg>
                </span>
              </td>

              <!-- Montant dû -->
              <td class="td--montant">{{ formatMontant(p.montant) }}</td>

              <!-- Montant payé -->
              <td :class="[
                'td--montant',
                p.statut === 'PAYE' ? 'td--montant-vert' : 'td--montant-gris'
              ]">
                {{ p.statut === 'PAYE' ? formatMontant(p.montant) : '0 FCFA' }}
              </td>

              <!-- Statut -->
              <td>
                <span :class="['badge', `badge--${mapBadge(p.statut)}`]">
                  {{ mapLabel(p.statut) }}
                </span>
              </td>

              <!-- Actions -->
              <td class="td--actions">
                <div class="actions">
                  <!-- PAYÉ → Quittance -->
                  <template v-if="p.statut === 'PAYE'">
                    <button
                      :id="`quittance-${p.id}`"
                      class="btn-outline btn-outline--icon"
                      @click="telechargerQuittance(p.id)"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      Quittance
                    </button>
                  </template>

                  <!-- EN_RETARD / EN_ATTENTE → Encaisser (+Relancer) -->
                  <template v-else>
                    <button
                      :id="`encaisser-${p.id}`"
                      class="btn-green"
                      @click="ouvrirEncaisser(p)"
                    >Encaisser</button>

                    <button
                      v-if="p.statut === 'EN_RETARD'"
                      :id="`relancer-${p.id}`"
                      class="btn-outline btn-outline--icon"
                      @click="relancer(p)"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                      </svg>
                      Relancer
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </section>

    <!-- ────────────────────────────────────────────────
         MODALS
    ──────────────────────────────────────────────── -->
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
  [...new Set(paiementsStore.paiements.map(p => p.mois))].sort(),
)

const listeLocataires = computed(() => {
  const noms = paiementsStore.paiements
    .map(p => `${p.locataire?.prenom} ${p.locataire?.nom}`.trim())
    .filter(Boolean)
  return [...new Set(noms)].sort()
})

/* ── Paiements filtrés ───────────────────────────────── */
const paiementsFiltres = computed(() =>
  paiementsStore.paiements.filter(p => {
    const okMois = !filtreMois.value || p.mois === filtreMois.value
    const okLoc =
      !filtreLocataire.value ||
      `${p.locataire?.prenom} ${p.locataire?.nom}`.trim() === filtreLocataire.value
    return okMois && okLoc
  }),
)

/* ── Helpers ─────────────────────────────────────────── */
function formatMontant(val) {
  if (val == null) return ''
  return new Intl.NumberFormat('fr-FR').format(val) + ' FCFA'
}

function mapLabel(s) {
  return { PAYE: 'Payé', EN_RETARD: 'En retard', EN_ATTENTE: 'En attente' }[s] ?? s
}

function mapBadge(s) {
  return { PAYE: 'paye', EN_RETARD: 'retard', EN_ATTENTE: 'attente' }[s] ?? 'attente'
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
/*
 * ─────────────────────────────────────────────────────
 * PAGE
 * ─────────────────────────────────────────────────────
 */
.page-paiements {
  padding: 0;
}

/*
 * ─────────────────────────────────────────────────────
 * CARTES STATISTIQUES
 * ─────────────────────────────────────────────────────
 */
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

/*
 * ─────────────────────────────────────────────────────
 * PANEL (conteneur tableau)
 * ─────────────────────────────────────────────────────
 */
.panel {
  background: var(--fond-carte, #fff);
  border: 1px solid var(--bordure, #e5e7eb);
  border-radius: var(--bordure-radius, 12px);
  padding: 22px 24px 18px;
}

.panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.panel__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--texte-principal, #1f2937);
  margin: 0;
}

/*
 * ─── Bouton "+ Enregistrer paiement" ────────────────
 */
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

/*
 * ─────────────────────────────────────────────────────
 * FILTRES
 * ─────────────────────────────────────────────────────
 */
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
.filtre-select select:focus {
  border-color: #94a3b8;
}

.filtre-select__chevron {
  position: absolute;
  right: 11px;
  pointer-events: none;
}

/*
 * ─────────────────────────────────────────────────────
 * ÉTATS (chargement / vide)
 * ─────────────────────────────────────────────────────
 */
.etat-vide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 56px 0;
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

/*
 * ─────────────────────────────────────────────────────
 * TABLEAU
 * ─────────────────────────────────────────────────────
 */
.table-scroll {
  overflow-x: auto;
  margin: 0 -2px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

/* ── En-têtes ─────────────────────────────────────── */
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
.th--locataire { min-width: 180px; }
.th--actions   { text-align: right; padding-right: 6px; }

/* ── Cellules ─────────────────────────────────────── */
.table td {
  padding: 14px 14px;
  font-size: 13.5px;
  color: #1e293b;
  border-bottom: 1px solid #f5f7fa;
  vertical-align: middle;
}
.table tbody tr:last-child td { border-bottom: none; }

/* ── Hover ─────────────────────────────────────────── */
.table tbody tr:hover { background: #fafaff; }
.table tbody tr.tr--retard:hover { background: #fef2f2; }

/* ── Ligne en retard (fond rosé) ───────────────────── */
.tr--retard { background: #fff5f5; }

/* ── Colonne locataire ────────────────────────────── */
.td--locataire { min-width: 180px; }

.cell-nom {
  display: block;
  font-weight: 600;
  color: #0f172a;
  font-size: 13.5px;
  line-height: 1.25;
  margin-bottom: 2px;
}
.cell-bien {
  display: block;
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.3;
}

/* ── Colonne date ─────────────────────────────────── */
.td--date { white-space: nowrap; }

.cell-date {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.cell-date__warn { flex-shrink: 0; }

/* ── Colonne montant ──────────────────────────────── */
.td--montant {
  font-weight: 500;
  white-space: nowrap;
}
.td--montant-vert {
  color: #16a34a !important;
  font-weight: 700;
}
.td--montant-gris {
  color: #94a3b8 !important;
  font-weight: 400;
}

/*
 * ─────────────────────────────────────────────────────
 * BADGES
 * ─────────────────────────────────────────────────────
 */
.badge {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1.5;
}
.badge--paye {
  background: #dcfce7;
  color: #15803d;
}
.badge--retard {
  background: #fee2e2;
  color: #dc2626;
}
.badge--attente {
  background: #f1f5f9;
  color: #64748b;
}

/*
 * ─────────────────────────────────────────────────────
 * BOUTONS ACTIONS
 * ─────────────────────────────────────────────────────
 */
.td--actions {
  min-width: 170px;
  padding-right: 6px !important;
}

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 7px;
}

/* Encaisser (vert plein) */
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

/* Quittance / Relancer (outline) */
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
.btn-outline:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/*
 * ─────────────────────────────────────────────────────
 * RESPONSIVE
 * ─────────────────────────────────────────────────────
 */
@media (max-width: 860px) {
  .stats-row { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .stats-row { grid-template-columns: 1fr; }
  .panel__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .filtres-row { flex-wrap: wrap; }
}
</style>
