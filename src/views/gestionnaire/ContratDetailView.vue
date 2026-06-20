<template>
  <div class="detail-page" v-if="contrat">
    <button class="retour" @click="$router.push('/gestionnaire/contrats')">← Retour aux contrats</button>

<div class="carte entete">
      <div>
        <div class="numero">{{ contrat.numero }}</div>
        <h1 class="titre">{{ contrat.bien?.intitule }}</h1>
        <p class="client">
          {{ nom(contrat.client) }}
          <span class="tel">· {{ contrat.client?.telephone }}</span>
        </p>
      </div>
      <span class="chip" :class="chipClass(contrat.statut)">{{ libelleStatut(contrat.statut) }}</span>
    </div>

<div class="carte bloc">
      <h2 class="bloc-titre">Détails du contrat</h2>
      <div class="grille">
        <div><span class="lbl">Début</span><span class="val">{{ formatDate(contrat.dateDebut) }}</span></div>
        <div><span class="lbl">Fin</span><span class="val">{{ formatDate(contrat.dateFin) }}</span></div>
        <div><span class="lbl">Loyer</span><span class="val">{{ formatMontant(contrat.montantLoyer) }} FCFA</span></div>
        <div><span class="lbl">Caution</span><span class="val">{{ formatMontant(contrat.montantCaution) }} FCFA</span></div>
        <div><span class="lbl">Fréquence</span><span class="val">{{ contrat.frequence }}</span></div>
      </div>
      <div v-if="contrat.conditions" class="conditions">
        <span class="lbl">Conditions particulières</span>
        <p>{{ contrat.conditions }}</p>
      </div>
    </div>

<template v-if="estPreContrat">
      <div class="carte bloc">
        
        <template v-if="contrat.statut === 'VALIDE_CLIENT'">
          <div class="info-ok">
            Le client a validé ce pré-contrat. Enregistrez-le pour qu'il commence à s'exécuter.
          </div>
          <button class="btn-activer" :disabled="enCours" @click="activer">
            Enregistrer et activer le contrat
          </button>
        </template>

<template v-else-if="contrat.statut !== 'ANNULE'">
          <h2 class="bloc-titre">Corriger le pré-contrat</h2>
          <div class="grille-2">
            <div class="champ">
              <label>Date de début</label>
              <input v-model="edit.dateDebut" type="date" />
            </div>
            <div class="champ">
              <label>Loyer mensuel</label>
              <input v-model.number="edit.montantLoyer" type="number" />
            </div>
            <div class="champ">
              <label>Caution</label>
              <input v-model.number="edit.montantCaution" type="number" />
            </div>
          </div>
          <div class="champ">
            <label>Conditions particulières</label>
            <textarea v-model="edit.conditions" rows="3"></textarea>
          </div>
          <div class="actions">
            <button class="btn-corriger" :disabled="enCours" @click="corriger">Corriger et renvoyer</button>
            <button class="btn-invalider" :disabled="enCours" @click="invalider">Invalider</button>
          </div>
        </template>

        <div v-else class="info-danger">Ce pré-contrat a été invalidé.</div>
      </div>
    </template>

<template v-if="contrat.statut === 'ACTIF'">
      <div class="carte bloc">
        <div class="bloc-head">
          <h2 class="bloc-titre">Échéances de paiement</h2>
          <button v-if="!contrat.echeances.length" class="btn-mini" @click="regenererEcheances">
            Générer les échéances
          </button>
        </div>
        <table v-if="contrat.echeances.length" class="tableau">
          <thead>
            <tr><th>Échéance</th><th>Date</th><th>Montant</th><th>Statut</th></tr>
          </thead>
          <tbody>
            <tr v-for="e in echeancesPage" :key="e.id">
              <td class="fort">{{ e.libelle }}</td>
              <td class="gris">{{ formatDate(e.dateEcheance) }}</td>
              <td>{{ formatMontant(e.montant) }} FCFA</td>
              <td>
                <span class="chip" :class="e.statut === 'PAYE' ? 'chip--green' : 'chip--warn'">
                  {{ e.statut === 'PAYE' ? 'Payée' : 'À payer' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="gris">Aucune échéance définie.</p>
        <Pagination v-model="pageEcheances" :total-pages="totalPagesEcheances" />
      </div>

<div class="carte bloc">
        <h2 class="bloc-titre">Enregistrer un paiement</h2>
        <div v-if="echeancesAPayer.length" class="grille-2">
          <div class="champ">
            <label>Échéance (présélectionnée)</label>
            <select v-model.number="paiement.echeanceId">
              <option v-for="e in echeancesAPayer" :key="e.id" :value="e.id">
                {{ e.libelle }} — {{ formatMontant(e.montant) }} FCFA
              </option>
            </select>
          </div>
          <div class="champ">
            <label>Montant</label>
            <input v-model.number="paiement.montant" type="number" />
          </div>
          <div class="champ">
            <label>Méthode</label>
            <select v-model="paiement.methodePaiement">
              <option value="ORANGE_MONEY">Orange Money</option>
              <option value="WAVE">Wave</option>
              <option value="ESPECES">Espèces</option>
              <option value="VIREMENT">Virement</option>
            </select>
          </div>
          <div class="champ">
            <label>Référence (optionnel)</label>
            <input v-model="paiement.reference" type="text" placeholder="Auto si vide" />
          </div>
        </div>
        <p v-else class="info-ok">Toutes les échéances sont payées. 🎉</p>
        <button
          v-if="echeancesAPayer.length"
          class="btn-activer"
          :disabled="enCours || !paiement.echeanceId"
          @click="enregistrerPaiement"
        >
          Valider le paiement
        </button>
      </div>

<div class="carte bloc">
        <h2 class="bloc-titre">Historique des paiements</h2>
        <table v-if="historique.length" class="tableau">
          <thead>
            <tr><th>Date</th><th>Montant</th><th>Méthode</th><th>Référence</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in historiquePage" :key="p.id">
              <td>{{ formatDate(p.datePaiement) }}</td>
              <td class="fort">{{ formatMontant(p.montant) }} FCFA</td>
              <td>{{ libelleMethode(p.methodePaiement) }}</td>
              <td class="gris">{{ p.reference }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="gris">Aucun paiement enregistré.</p>
        <Pagination v-model="pageHistorique" :total-pages="totalPagesHistorique" />
      </div>
    </template>
  </div>

  <div v-else class="carte vide">Contrat introuvable.</div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useContratsStore } from '@/stores/contrats.store'
import { usePaiementsStore } from '@/stores/paiements.store'
import { useNotification } from '@/composables/useNotification'
import { useFormat } from '@/composables/useFormat'
import { usePagination } from '@/composables/usePagination'
import { nomComplet, STATUTS_PRE_CONTRAT } from '@/utils/constants'
import Pagination from '@/components/common/Pagination.vue'

const route = useRoute()
const contratsStore = useContratsStore()
const paiementsStore = usePaiementsStore()
const { succes, info } = useNotification()
const { formatMontant, formatDate } = useFormat()

const enCours = ref(false)
const id = computed(() => Number(route.params.id))
const contrat = computed(() => preContratsStore.preContrats.find(c => Number(c.id) === id.value))

const estPreContrat = computed(
  () => contrat.value && (STATUTS_PRE_CONTRAT.includes(contrat.value.statut) || contrat.value.statut === 'ANNULE'),
)

const nom = (p) => nomComplet(p)

const edit = reactive({ dateDebut: '', montantLoyer: 0, montantCaution: 0, conditions: '' })
watch(
  contrat,
  (c) => {
    if (c) {
      edit.dateDebut = c.dateDebut
      edit.montantLoyer = c.montantLoyer
      edit.montantCaution = c.montantCaution
      edit.conditions = c.conditions
    }
  },
  { immediate: true },
)

const echeancesTriees = computed(() =>
  (contrat.value?.echeances || [])
    .slice()
    .sort((a, b) => new Date(a.dateEcheance) - new Date(b.dateEcheance)),
)
const echeancesAPayer = computed(() => paiementsStore.echeancesAPayer(contrat.value))

watch(id, (newId) => {
  if (newId) {
    paiementsStore.chargerHistorique(newId, { page: 0, size: 100 })
  }
}, { immediate: true })

const historique = computed(() => {
  return paiementsStore.historique
})

const { page: pageEcheances, totalPages: totalPagesEcheances, itemsPage: echeancesPage } =
  usePagination(echeancesTriees, 5)
const { page: pageHistorique, totalPages: totalPagesHistorique, itemsPage: historiquePage } =
  usePagination(historique, 5)

const paiement = reactive({ echeanceId: null, montant: 0, methodePaiement: 'ORANGE_MONEY', reference: '' })

watch(
  () => contrat.value?.statut === 'ACTIF' && echeancesAPayer.value,
  () => {
    const courante = paiementsStore.echeanceCourante(contrat.value)
    if (courante) {
      paiement.echeanceId = courante.id
      paiement.montant = courante.montant
    }
  },
  { immediate: true },
)
watch(
  () => paiement.echeanceId,
  (eId) => {
    const e = echeancesAPayer.value.find((x) => x.id === eId)
    if (e) paiement.montant = e.montant
  },
)

async function corriger() {
  enCours.value = true
  try {
    await preContratsStore.modifier(id.value)
    succes('Pré-contrat corrigé et renvoyé au client.')
  } catch (e) {
    info('Erreur lors de la correction.')
  }
  enCours.value = false
}
async function invalider() {
  enCours.value = true
  try {
    await preContratsStore.invalider(id.value)
    info('Pré-contrat invalidé.')
  } catch(e) {
    info('Erreur lors de l\'invalidation.')
  }
  enCours.value = false
}
async function activer() {
  enCours.value = true
  try {
    await contratsStore.creerContratDefinitif(id.value)
    succes('Le contrat de bail a été édité et activé avec succès !')
  } catch(e) {
    info('Erreur lors de la création du contrat de bail.')
  }
  enCours.value = false
}

function regenererEcheances() {
  const ech = contratsStore.genererEcheances(contrat.value)
  contratsStore.definirEcheances(id.value, ech)
  info('Échéances générées.')
}

function getMoisBackend(dateString) {
  if (!dateString) return 'AOUT'
  const m = new Date(dateString).getMonth()
  return [
    'JANVIER', 'FEVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
    'JUILLET', 'AOUT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DECEMBRE'
  ][m]
}

async function enregistrerPaiement() {
  enCours.value = true
  const ech = echeancesAPayer.value.find((x) => x.id === paiement.echeanceId)
  
  const moisStr = ech ? getMoisBackend(ech.dateEcheance) : "AOUT"
  
  try {
    await paiementsStore.enregistrerPaiementBackend(id.value, moisStr, paiement.methodePaiement)
    succes('Paiement enregistré sur le serveur.')
  } catch (err) {
    info('Erreur lors de l\'enregistrement du paiement.')
  }

  await paiementsStore.chargerHistorique(id.value, { page: 0, size: 100 })

  paiement.reference = ''
  enCours.value = false
}

function libelleStatut(s) {
  return {
    PRE_CONTRAT_ENVOYE: 'Pré-contrat envoyé',
    RETOURS_CLIENT: 'Retours client',
    PRE_CONTRAT_CORRIGE: 'Corrigé (renvoyé)',
    VALIDE_CLIENT: 'Validé par le client',
    ACTIF: 'Actif',
    TERMINE: 'Terminé',
    ANNULE: 'Annulé',
  }[s] || s
}
function chipClass(s) {
  return {
    PRE_CONTRAT_ENVOYE: 'chip--info',
    RETOURS_CLIENT: 'chip--warn',
    PRE_CONTRAT_CORRIGE: 'chip--info',
    VALIDE_CLIENT: 'chip--ok',
    ACTIF: 'chip--green',
    ANNULE: 'chip--danger',
  }[s] || 'chip--neutre'
}
function libelleMethode(m) {
  return { ORANGE_MONEY: 'Orange Money', WAVE: 'Wave', ESPECES: 'Espèces', VIREMENT: 'Virement' }[m] || m
}
</script>

<style scoped>
.detail-page {
  padding: 0;
}
.retour {
  background: none;
  border: none;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
  padding: 0;
}
.entete {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}
.numero {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 600;
}
.titre {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 2px 0;
}
.client {
  font-size: 14px;
  color: #1e293b;
  font-weight: 600;
}
.tel {
  color: #94a3b8;
  font-weight: 400;
}
.bloc {
  margin-bottom: 20px;
}
.bloc-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bloc-titre {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}
.grille {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.grille > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.grille-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.lbl {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.val {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}
.conditions {
  margin-top: 18px;
  border-top: 1px solid #f1f5f9;
  padding-top: 14px;
}
.conditions p {
  font-size: 14px;
  color: #374151;
  margin-top: 6px;
  white-space: pre-wrap;
}
.fil {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.message {
  border-radius: 10px;
  padding: 12px 14px;
  max-width: 80%;
}
.message--client {
  background: #f1f5f9;
  align-self: flex-start;
}
.message--gest {
  background: #eef2ff;
  align-self: flex-end;
}
.message-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 12px;
  margin-bottom: 4px;
}
.message p {
  font-size: 14px;
  color: #1e293b;
}
.champ {
  margin-bottom: 14px;
}
.champ label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
}
.champ input,
.champ select,
.champ textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
}
.actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}
.btn-activer {
  background: #00d15a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 11px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
}
.btn-corriger {
  background: #212d4d;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.btn-invalider {
  background: #fff;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.btn-mini {
  background: #f1f5f9;
  border: none;
  border-radius: 7px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
}
.info-ok {
  background: #f0fdf4;
  color: #16a34a;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;
}
.info-danger {
  background: #fef2f2;
  color: #dc2626;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;
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
  padding: 10px 12px;
  border-bottom: 1px solid #f1f5f9;
}
.tableau td {
  padding: 12px;
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
.chip {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.chip--info {
  background: #dbeafe;
  color: #2563eb;
}
.chip--warn {
  background: #fef3c7;
  color: #b45309;
}
.chip--ok {
  background: #e0f2fe;
  color: #0369a1;
}
.chip--green {
  background: #dcfce7;
  color: #16a34a;
}
.chip--danger {
  background: #fee2e2;
  color: #dc2626;
}
.chip--neutre {
  background: #f3f4f6;
  color: #6b7280;
}
.vide {
  text-align: center;
  color: #94a3b8;
  padding: 40px;
}
</style>
