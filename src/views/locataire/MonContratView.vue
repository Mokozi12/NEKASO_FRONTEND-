<template>
  <div class="page">
    <div class="container">
      <router-link to="/locataire/mes-locations" class="retour">← Mes locations</router-link>

      <div v-if="!contrat" class="carte vide">
        Ce contrat est introuvable ou ne vous appartient pas.
      </div>

      <!-- ═══ PRÉ-CONTRAT ═══ -->
      <template v-else-if="estPreContrat">
        <div class="page-header">
          <h1 class="page-title">Pré-contrat à valider</h1>
          <p class="page-subtitle">Relisez les termes proposés, validez ou envoyez vos suggestions au gestionnaire.</p>
        </div>

        <div class="carte">
          <div class="pc-head">
            <div>
              <div class="numero">{{ contrat.numero }}</div>
              <h2 class="bien-nom">{{ contrat.bien?.intitule }}</h2>
              <p class="adresse">{{ contrat.bien?.adresse }}</p>
            </div>
            <BadgeStatut :label="libellePre(contrat.statut)" :variant="variantPre(contrat.statut)" />
          </div>

          <div class="grille-infos">
            <div><span class="lbl">Loyer mensuel</span><span class="val">{{ formatMontant(contrat.montantLoyer) }} FCFA</span></div>
            <div><span class="lbl">Caution</span><span class="val">{{ formatMontant(contrat.montantCaution) }} FCFA</span></div>
            <div><span class="lbl">Date de début</span><span class="val">{{ formatDate(contrat.dateDebut) }}</span></div>
            <div><span class="lbl">Date de fin</span><span class="val">{{ formatDate(contrat.dateFin) }}</span></div>
          </div>

          <div v-if="contrat.conditions" class="conditions">{{ contrat.conditions }}</div>

          <div v-if="contrat.retours?.length" class="fil">
            <div
              v-for="r in contrat.retours"
              :key="r.id"
              class="msg"
              :class="r.auteur === 'CLIENT' ? 'msg-moi' : 'msg-gest'"
            >
              <strong>{{ r.auteur === 'CLIENT' ? 'Vous' : 'Gestionnaire' }}</strong>
              <p>{{ r.message }}</p>
            </div>
          </div>

          <template v-if="['PRE_CONTRAT_ENVOYE', 'PRE_CONTRAT_CORRIGE'].includes(contrat.statut)">
            <div class="actions-pc">
              <button class="btn-rouge" @click="annuler">Refuser le pré-contrat</button>
              <button class="btn-vert" @click="valider">Valider le pré-contrat</button>
            </div>
          </template>
          <div v-else-if="contrat.statut === 'RETOURS_CLIENT'" class="info">
            Vos retours ont été transmis. En attente de la correction du gestionnaire.
          </div>
          <div v-else-if="contrat.statut === 'VALIDE_CLIENT'" class="info info-ok">
            Vous avez validé ce pré-contrat. En attente de l'enregistrement par le gestionnaire.
          </div>
        </div>
      </template>

      <!-- ═══ CONTRAT ACTIF ═══ -->
      <template v-else-if="contrat.statut === 'ACTIF' || contrat.statut === 'ROMPU'">
        <div class="page-header">
          <h1 class="page-title">Contrat &amp; Paiements</h1>
          <p class="page-subtitle">Consultez votre bail et l'historique des loyers validés par votre gestionnaire.</p>
        </div>

        <div class="tabs">
          <button class="tab" :class="{ actif: onglet === 'contrat' }" @click="onglet = 'contrat'">Contrat</button>
          <button class="tab" :class="{ actif: onglet === 'historique' }" @click="onglet = 'historique'">Historique</button>
        </div>

        <!-- Onglet Contrat -->
        <div v-if="onglet === 'contrat'" class="carte">
          <div class="bail-head">
            <div class="bail-titre-bloc">
              <span class="doc-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              </span>
              <div>
                <h2 class="bail-titre">Bail de location résidentielle</h2>
                <p class="ref">Référence : {{ contrat.numero || `NKS-${contrat.id}` }}</p>
              </div>
            </div>
            <button class="btn-pdf" @click="telechargerPdf">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Télécharger PDF
            </button>
          </div>

          <div class="bail-grille">
            <div><span class="lbl">Bien loué</span><span class="val">{{ contrat.bien?.intitule || '—' }}</span></div>
            <div><span class="lbl">Adresse</span><span class="val">{{ contrat.bien?.adresse || '—' }}</span></div>
            <div><span class="lbl">Loyer mensuel</span><span class="val">{{ formatMontant(contrat.montantLoyer) }} FCFA</span></div>
            <div><span class="lbl">Caution</span><span class="val">{{ formatMontant(contrat.montantCaution) }} FCFA</span></div>
            <div><span class="lbl">Date de début</span><span class="val">{{ formatDate(contrat.dateDebut) }}</span></div>
            <div><span class="lbl">Date de fin</span><span class="val">{{ contrat.dateFin ? formatDate(contrat.dateFin) : '—' }}</span></div>
            <div><span class="lbl">Gestionnaire</span><span class="val">{{ nom(contrat.gestionnaire) || '—' }}</span></div>
            <div><span class="lbl">Contact</span><span class="val">{{ contrat.gestionnaire?.telephone || '—' }}</span></div>
          </div>

          <div class="banniere-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16" /><line x1="12" y1="8" x2="12" y2="8" /></svg>
            Pour toute modification, contactez directement votre gestionnaire via WhatsApp.
          </div>


        </div>

        <!-- Onglet Historique -->
        <div v-else class="carte">
          <div class="banniere-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16" /><line x1="12" y1="8" x2="12" y2="8" /></svg>
            Historique validé par votre gestionnaire. Les paiements s'effectuent en Orange Money, Wave ou espèces — aucune transaction en ligne.
          </div>

          <div v-if="chargementPaiements" class="etat-chargement">Chargement de l'historique…</div>

          <div v-else-if="paiements.length" class="table-scroll">
            <table class="tableau">
              <thead>
                <tr>
                  <th>Mois</th>
                  <th>Montant</th>
                  <th>Date de validation</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in paiementsPage" :key="p.id">
                  <td class="fort">{{ formaterMois(p.mois) }}</td>
                  <td class="fort">{{ formatMontant(p.montant) }} FCFA</td>
                  <td class="gris">{{ p.datePaiement ? formatDate(p.datePaiement) : '—' }}</td>
                  <td><BadgeStatut :label="statutPaiement(p).label" :variant="statutPaiement(p).variant" :icon="statutPaiement(p).icon" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="etat-vide-hist">Aucun paiement enregistré pour le moment.</div>

          <Pagination v-model="pagePaiements" :total-pages="totalPagesPaiements" />
        </div>
      </template>

      <div v-else class="carte vide">
        {{ contrat.statut === 'ANNULE' ? 'Ce pré-contrat a été invalidé.' : 'Contrat terminé.' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useContratsStore } from '@/stores/contrats.store'
import { usePreContratsStore } from '@/stores/preContrats.store'
import { useNotification } from '@/composables/useNotification'
import { useFormat } from '@/composables/useFormat'
import { nomComplet } from '@/utils/constants'
import BadgeStatut from '@/components/locataire/BadgeStatut.vue'
import Pagination from '@/components/common/Pagination.vue'
import { usePagination } from '@/composables/usePagination'
import { paiementsLocataireService } from '@/services/paiements-locataire.service'
import { mapPaiements } from '@/services/mappers'

const route = useRoute()
const contratsStore = useContratsStore()
const preContratsStore = usePreContratsStore()
const { succes, info, erreur } = useNotification()
const { formatMontant, formatDate } = useFormat()

const onglet = ref('contrat')
const suggestion = ref('')

// Paiements API
const paiements = ref([])
const chargementPaiements = ref(false)

onMounted(async () => {
  await contratsStore.chargerLocataire()
})

// ── Résolution du contrat ──
const contrat = computed(() => {
  const id = Number(route.params.id)
  // D'abord chercher dans les contrats définitifs (ACTIF/ROMPU)
  const definitif = contratsStore.contrats.find(c => Number(c.id) === id)
  if (definitif) return definitif
  // Sinon dans les pré-contrats
  return preContratsStore.preContrats.find(c => Number(c.id) === id) ?? null
})

const estPreContrat = computed(() =>
  ['PRE_CONTRAT_ENVOYE', 'PRE_CONTRAT_CORRIGE', 'RETOURS_CLIENT', 'VALIDE_CLIENT'].includes(
    contrat.value?.statut,
  ),
)

// ── Charger les paiements réels depuis l'API ──
watch(
  () => contrat.value,
  async (c) => {
    if (c && (c.statut === 'ACTIF' || c.statut === 'ROMPU')) {
      chargementPaiements.value = true
      try {
        const res = await paiementsLocataireService.getHistorique(c.id, { page: 0, size: 100 })
        const body = res?.data ?? res
        const items = body?.content || body?.items || body?.data || (Array.isArray(body) ? body : [])
        paiements.value = mapPaiements(items).sort((a, b) => {
          // Trier par mois décroissant
          return (b.mois || '').localeCompare(a.mois || '')
        })
      } catch (e) {
        console.warn('Impossible de charger l\'historique des paiements:', e)
        paiements.value = []
      } finally {
        chargementPaiements.value = false
      }
    }
  },
  { immediate: true },
)

const { page: pagePaiements, totalPages: totalPagesPaiements, itemsPage: paiementsPage } = usePagination(paiements, 6)

const nom = (p) => nomComplet(p)

// ── Formater le champ mois (ex: "2026-04" → "Avril 2026") ──
const MOIS_FR = [
  '', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]
function formaterMois(moisStr) {
  if (!moisStr) return '—'
  // Format attendu: "2026-04" ou "Avril 2026" ou "AVRIL_2026"
  if (moisStr.includes('-') && moisStr.length <= 7) {
    const [an, m] = moisStr.split('-')
    return `${MOIS_FR[parseInt(m, 10)] || m} ${an}`
  }
  // Si c'est déjà un libellé
  return moisStr.replace('_', ' ')
}

function statutPaiement(p) {
  if (!p.datePaiement) {
    return { label: 'Attente', variant: 'amber', icon: 'clock' }
  }
  // Si le paiement est en retard (date de paiement après le mois concerné)
  if (p.mois && p.datePaiement) {
    const [an, m] = (p.mois.includes('-') ? p.mois : '').split('-')
    if (an && m) {
      const finMois = new Date(Number(an), Number(m), 0) // dernier jour du mois
      const datePaye = new Date(p.datePaiement)
      if (datePaye > finMois) {
        return { label: 'Retard', variant: 'red', icon: 'alert' }
      }
    }
  }
  return { label: 'Payé', variant: 'green', icon: 'check' }
}

function libellePre(s) {
  return {
    PRE_CONTRAT_ENVOYE: 'À valider',
    PRE_CONTRAT_CORRIGE: 'Corrigé — à valider',
    RETOURS_CLIENT: 'Retours envoyés',
    VALIDE_CLIENT: 'Validé',
  }[s] || s
}
function variantPre(s) {
  return {
    PRE_CONTRAT_ENVOYE: 'amber',
    PRE_CONTRAT_CORRIGE: 'amber',
    RETOURS_CLIENT: 'info',
    VALIDE_CLIENT: 'green',
  }[s] || 'neutral'
}

async function valider() {
  try {
    await preContratsStore.valider(contrat.value.id)
    succes('Pré-contrat validé. Le gestionnaire va l\'enregistrer.')
  } catch (e) {
    erreur('Erreur lors de la validation.')
  }
}
async function annuler() {
  try {
    await preContratsStore.invalider(contrat.value.id)
    info('Pré-contrat refusé.')
  } catch (e) {
    erreur('Erreur lors du refus.')
  }
}
function telechargerPdf() {
  const chemin = contrat.value?.cheminPDF
  if (chemin) {
    const baseUrl = 'http://74.248.184.17:8080'
    const url = chemin.startsWith('http') ? chemin : `${baseUrl}${chemin.startsWith('/') ? '' : '/'}${chemin}`
    window.open(url, '_blank')
  } else {
    info('Le PDF de votre bail sera bientôt disponible au téléchargement.')
  }
}
</script>

<style scoped>
.page {
  padding: 32px 0 80px;
  background: #f4f6fa;
  min-height: calc(100vh - 70px);
}
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
}
.retour {
  display: inline-block;
  font-size: 14px;
  color: #64748b;
  text-decoration: none;
  margin-bottom: 18px;
}
.retour:hover {
  color: #1e293b;
}
.page-header {
  margin-bottom: 22px;
}
.page-title {
  font-size: 30px;
  font-weight: 700;
  color: #1e293b;
}
.page-subtitle {
  font-size: 15px;
  color: #64748b;
  margin-top: 4px;
}

.carte {
  background: #fff;
  border-radius: 16px;
  padding: 26px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}
.vide {
  text-align: center;
  color: #94a3b8;
  padding: 50px;
}

.tabs {
  display: inline-flex;
  background: #fff;
  border-radius: 11px;
  padding: 5px;
  margin-bottom: 18px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}
.tab {
  border: none;
  background: transparent;
  padding: 9px 22px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
}
.tab.actif {
  background: #1e293b;
  color: #fff;
}

.pc-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
}
.numero {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
}
.bien-nom {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}
.adresse {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
}
.grille-infos {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}
.grille-infos > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.lbl {
  font-size: 12px;
  color: #94a3b8;
}
.val {
  font-size: 14.5px;
  font-weight: 600;
  color: #1e293b;
}
.conditions {
  background: #f8fafc;
  border-radius: 10px;
  padding: 14px;
  font-size: 13.5px;
  color: #475569;
  white-space: pre-wrap;
  margin-bottom: 16px;
}
.fil {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
}
.msg {
  border-radius: 11px;
  padding: 10px 13px;
  font-size: 13.5px;
  max-width: 85%;
}
.msg strong {
  font-size: 12px;
  display: block;
  margin-bottom: 2px;
}
.msg-moi {
  background: #ecfdf3;
  align-self: flex-end;
}
.msg-gest {
  background: #f1f5f9;
  align-self: flex-start;
}
.info {
  background: #f8fafc;
  border-radius: 10px;
  padding: 13px 15px;
  font-size: 13.5px;
  color: #475569;
}
.info-ok {
  background: #f0fdf4;
  color: #15803d;
}

.bail-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 20px;
}
.bail-titre-bloc {
  display: flex;
  gap: 14px;
  align-items: center;
}
.doc-ic {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  background: #eef2f9;
  color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.doc-ic svg {
  width: 21px;
  height: 21px;
}
.bail-titre {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}
.ref {
  font-size: 13px;
  color: #94a3b8;
}
.btn-pdf {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #1e293b;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 10px 16px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}
.btn-pdf svg {
  width: 16px;
  height: 16px;
}
.bail-grille {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 24px;
  margin-bottom: 22px;
}
.bail-grille > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.banniere-info {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #eef2f9;
  border-radius: 10px;
  padding: 13px 16px;
  font-size: 13.5px;
  color: #475569;
}
.banniere-info svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #64748b;
}
.btn-foncé {
  align-self: flex-start;
  background: #1e293b;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 10px 18px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}
.btn-foncé:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-vert {
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 11px 18px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  flex: 1;
}
.actions-pc {
  display: flex;
  gap: 12px;
}
.btn-rouge {
  background: #fff;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 9px;
  padding: 11px 18px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  flex: 1;
}

.etat-chargement {
  text-align: center;
  color: #94a3b8;
  padding: 40px 0;
  font-size: 14px;
}
.etat-vide-hist {
  text-align: center;
  color: #94a3b8;
  padding: 40px 0;
  font-size: 14px;
}

.table-scroll {
  margin-top: 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.tableau {
  width: 100%;
  min-width: 460px;
  border-collapse: collapse;
}
.tableau th {
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 10px 12px;
  border-bottom: 1px solid #f1f5f9;
}
.tableau td {
  padding: 14px 12px;
  font-size: 14px;
  color: #475569;
  border-bottom: 1px solid #f6f8fb;
}
.tableau tr:last-child td {
  border-bottom: none;
}
.fort {
  font-weight: 600;
  color: #1e293b;
}
.gris {
  color: #94a3b8;
}

@media (max-width: 640px) {
  .grille-infos,
  .bail-grille {
    grid-template-columns: 1fr;
  }
  .bail-head {
    flex-direction: column;
    align-items: flex-start;
  }
  .actions-pc {
    flex-direction: column;
  }
}
</style>
