<template>
  <div class="paiements-page">
    <div class="page-header">
      <h1 class="page-title">Paiements</h1>
      <p class="page-subtitle">Historique des loyers encaissés.</p>
    </div>

    <div class="stats">
      <div class="stat-carte">
        <span class="stat-label">{{ libelleTotal }}</span>
        <span class="stat-val vert">{{ formatMontant(totalPercu) }} FCFA</span>
      </div>
      <div class="stat-carte">
        <span class="stat-label">Nombre de paiements</span>
        <span class="stat-val">{{ paiementsFiltres.length }}</span>
      </div>
    </div>

    <div class="filtres">
      <select v-model="filtreMois" class="select-filtre">
        <option value="">Tous les mois</option>
        <option v-for="m in moisDisponibles" :key="m" :value="m">{{ formatMois(m) }}</option>
      </select>
      <select v-model="filtreLocataire" class="select-filtre">
        <option value="">Tous locataires</option>
        <option v-for="loc in locatairesDisponibles" :key="loc.id" :value="loc.id">{{ loc.nom }}</option>
      </select>
    </div>

    <div class="carte liste-carte">
      <div class="barre-action">
        <button class="btn-ajouter" @click="modalOuvert = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Enregistrer un paiement
        </button>
      </div>

      <div v-if="chargement" class="vide">Chargement des paiements…</div>

      <table v-else class="tableau">
        <thead>
          <tr>
            <th>Bien</th>
            <th>Locataire</th>
            <th>Mois</th>
            <th>Méthode</th>
            <th class="ta-right">Montant payé</th>
            <th class="ta-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in paiementsPage" :key="l.id">
            <td>
              <div class="bien-nom">{{ l.bien?.intitule || '—' }}</div>
              <div class="bien-adresse">{{ l.bien?.adresse || '' }}</div>
            </td>
            <td>{{ l.locataireNom }}</td>
            <td>{{ l.mois }}</td>
            <td class="gris">{{ l.methodeLibelle }}</td>
            <td class="ta-right montant-vert">{{ formatMontant(l.montant) }} FCFA</td>
            <td class="ta-right">
              <button class="btn-quittance" @click="ouvrirQuittance(l)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="7" x2="16" y2="7" /><line x1="8" y1="11" x2="16" y2="11" />
                </svg>
                Quittance
              </button>
            </td>
          </tr>
          <tr v-if="!paiementsFiltres.length">
            <td colspan="6" class="vide">Aucun paiement enregistré.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination v-if="paiementsFiltres.length" v-model="page" :total-pages="totalPages" />

    <ModalEnregistrerPaiement
      v-if="modalOuvert"
      :contrats="contratsActifs"
      :en-cours="enregistrementEnCours"
      @close="modalOuvert = false"
      @enregistrer="enregistrerPaiement"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContratsStore } from '@/stores/contrats.store'
import { paiementsService } from '@/services/paiements.service'
import { mapPaiements } from '@/services/mappers'
import { useFormat } from '@/composables/useFormat'
import { useNotification } from '@/composables/useNotification'
import { usePagination } from '@/composables/usePagination'
import { nomComplet, STATUT_CONTRAT } from '@/utils/constants'
import ModalEnregistrerPaiement from '@/components/paiements/ModalEnregistrerPaiement.vue'
import Pagination from '@/components/common/Pagination.vue'

const contratsStore = useContratsStore()
const { formatMontant, formatMois } = useFormat()
const { succes, erreur, info } = useNotification()

const filtreMois = ref('')
const filtreLocataire = ref('')

const paiementsReels = ref([])
const chargement = ref(false)
const modalOuvert = ref(false)
const enregistrementEnCours = ref(false)

const contratsActifs = computed(() =>
  contratsStore.contrats.filter((c) => c.statut === STATUT_CONTRAT.ACTIF),
)

onMounted(async () => {
  await contratsStore.chargerGestionnaire()
  await chargerPaiements()
})

async function chargerPaiements() {
  chargement.value = true
  const tous = []
  for (const contrat of contratsActifs.value) {
    try {
      const res = await paiementsService.getHistorique(contrat.id, { page: 0, size: 100 })
      const body = res?.data ?? res
      const items = body?.data || body?.content || body?.items || (Array.isArray(body) ? body : [])
      mapPaiements(items).forEach((p) => {
        tous.push({ ...p, contrat })
      })
    } catch (e) {
      if (e?.response?.status !== 404) console.error('chargerPaiements:', e)
    }
  }
  paiementsReels.value = tous
  chargement.value = false
}

function normaliserMois(valeur) {
  if (!valeur) return ''
  if (/^\d{4}-\d{2}/.test(valeur)) return valeur.slice(0, 10)
  return valeur
}

const paiementsListe = computed(() =>
  paiementsReels.value
    .map((p) => ({
      id: `pay-${p.id}`,
      bien: p.contrat.bien,
      locataireNom: nomComplet(p.contrat.locataire),
      locataireId: p.contrat.locataire?.id ?? p.contrat.id,
      mois: normaliserMois(p.mois || p.datePaiement),
      moisCle: (p.mois || '').slice(0, 7),
      montant: p.montant,
      methodeLibelle: p.methodeLibelle,
      quittance: p.quittance,
    }))
    .sort((a, b) => (b.mois || '').localeCompare(a.mois || '')),
)

const paiementsFiltres = computed(() =>
  paiementsListe.value.filter((l) => {
    if (filtreMois.value && l.moisCle !== filtreMois.value) return false
    if (filtreLocataire.value && String(l.locataireId) !== String(filtreLocataire.value)) return false
    return true
  }),
)

const { page, totalPages, itemsPage: paiementsPage } = usePagination(paiementsFiltres, 8)

const moisDisponibles = computed(() => {
  const set = new Set()
  paiementsListe.value.forEach((l) => l.moisCle && set.add(l.moisCle))
  return [...set].sort().reverse()
})

const locatairesDisponibles = computed(() => {
  const map = new Map()
  paiementsListe.value.forEach((l) => {
    if (l.locataireId && !map.has(l.locataireId)) map.set(l.locataireId, { id: l.locataireId, nom: l.locataireNom })
  })
  return [...map.values()]
})

const totalPercu = computed(() =>
  paiementsFiltres.value.reduce((s, l) => s + Number(l.montant || 0), 0),
)

const libelleTotal = computed(() => {
  if (filtreMois.value) return `Total perçu — ${formatMois(filtreMois.value)}`
  if (filtreLocataire.value) return 'Total perçu (locataire)'
  return 'Total perçu'
})

async function enregistrerPaiement(payload) {
  enregistrementEnCours.value = true
  try {
    await paiementsService.enregistrer(payload.contratId, payload.mois, payload.methodePaiement, {
      montant: payload.montant,
      reference: payload.reference,
      mois: payload.mois,
    })
    succes('Paiement enregistré.')
    modalOuvert.value = false
    await chargerPaiements()
  } catch (e) {
    console.error('enregistrerPaiement:', e)
    erreur("Impossible d'enregistrer le paiement.")
  } finally {
    enregistrementEnCours.value = false
  }
}

function ouvrirQuittance(ligne) {
  if (ligne.quittance) {
    const baseUrl = 'http://74.248.184.17:8080'
    const url = ligne.quittance.startsWith('http')
      ? ligne.quittance
      : `${baseUrl}${ligne.quittance.startsWith('/') ? '' : '/'}${ligne.quittance}`
    window.open(url, '_blank')
  } else {
    info('La quittance sera bientôt disponible.')
  }
}
</script>

<style scoped>
.paiements-page {
  padding: 0;
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
  margin-top: 6px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}
.stat-carte {
  background: #fff;
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.stat-label {
  font-size: 14px;
  color: #64748b;
}
.stat-val {
  font-size: 30px;
  font-weight: 700;
  color: #1e293b;
}
.stat-val.vert {
  color: #16a34a;
}

.filtres {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}
.select-filtre {
  padding: 11px 16px;
  border: none;
  background: #fff;
  border-radius: 10px;
  font-size: 14px;
  color: #475569;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
  min-width: 200px;
  outline: none;
}

.carte {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}
.liste-carte {
  padding: 0;
  overflow: hidden;
}
.barre-action {
  display: flex;
  justify-content: flex-end;
  padding: 18px 24px 0;
}
.btn-ajouter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #1e293b;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.tableau {
  width: 100%;
  border-collapse: collapse;
}
.tableau th {
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  padding: 18px 24px;
}
.tableau td {
  padding: 18px 24px;
  font-size: 14px;
  color: #1e293b;
  border-top: 1px solid #f1f5f9;
  vertical-align: middle;
}
.ta-right {
  text-align: right;
}
.bien-nom {
  font-weight: 600;
  color: #1e293b;
}
.bien-adresse {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 2px;
}
.gris {
  color: #64748b;
}
.montant-vert {
  color: #16a34a;
  font-weight: 600;
}
.btn-quittance {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #475569;
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.vide {
  text-align: center;
  color: #94a3b8;
  padding: 40px;
}

@media (max-width: 860px) {
  .stats {
    grid-template-columns: 1fr;
  }
  .filtres {
    flex-direction: column;
  }
  .select-filtre {
    min-width: 0;
  }
}
</style>
