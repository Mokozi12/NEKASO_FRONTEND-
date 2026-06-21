<template>
  <div class="detail-page">
    <button class="retour" @click="$router.push('/gestionnaire/demandes-location')">
      ← Retour aux biens
    </button>

    <div v-if="groupe" class="entete carte">
      <img :src="photo" :alt="groupe.bien.intitule" class="photo" />
      <div class="entete-info">
        <h1 class="titre">{{ groupe.bien.intitule }}</h1>
        <p class="adresse">{{ groupe.bien.adresse }}</p>
        <p class="loyer">{{ formatMontant(groupe.bien.loyer) }} FCFA / mois</p>
      </div>
      <button
        v-if="groupe.nbEnAttente > 0"
        class="btn-tout-annuler"
        @click="toutAnnuler"
      >
        Tout annuler
      </button>
    </div>

    <div v-if="groupe" class="carte liste-carte">
      <h2 class="section-titre">
        {{ groupe.demandes.length }} demande(s) — ordre chronologique (priorité au 1er arrivé)
      </h2>
      <table class="tableau">
        <thead>
          <tr>
            <th>#</th>
            <th>Client</th>
            <th>Téléphone</th>
            <th>Origine</th>
            <th>Demandé le</th>
            <th>Statut</th>
            <th class="ta-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(d, i) in groupe.demandes"
            :key="d.id"
            :class="{ 'ligne--prio': d.id === groupe.prioritaireId }"
          >
            <td>
              <span class="rang">{{ i + 1 }}</span>
              <span v-if="d.id === groupe.prioritaireId" class="badge-prio">Prioritaire</span>
            </td>
            <td class="fort">{{ nomClient(d) }}</td>
            <td class="gris">{{ d.client?.telephone || '—' }}</td>
            <td>
              <span class="source" :class="d.source === 'DIRECTE' ? 'source--express' : ''">
                {{ d.source === 'DIRECTE' ? 'Express' : 'Visite' }}
              </span>
            </td>
            <td class="gris">{{ formatDateHeure(d.dateCreation) }}</td>
            <td><span class="chip" :class="chipClass(d.statut)">{{ libelleStatut(d.statut) }}</span></td>
            <td class="ta-right">
              <button
                v-if="d.statut === 'EN_ATTENTE'"
                class="btn-valider"
                @click="valider(d)"
              >
                Valider
              </button>
              <button
                v-else-if="d.statut === 'ACCEPTEE'"
                class="btn-precontrat"
                @click="ouvrirPrecontrat(d)"
              >
                Créer un pré-contrat
              </button>
              <span v-else class="gris">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="carte vide">Bien introuvable.</div>

    <ModalProposerPrecontrat
      v-if="demandePrecontrat"
      :visite="demandePrecontrat"
      :en-cours="enCoursPrecontrat"
      @close="demandePrecontrat = null"
      @proposer="confirmerPrecontrat"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDemandesLocationStore } from '@/stores/demandesLocation.store'
import { usePreContratsStore } from '@/stores/preContrats.store'
import { useNotification } from '@/composables/useNotification'
import { useFormat } from '@/composables/useFormat'
import { nomComplet } from '@/utils/constants'
import { extraireMessageErreur } from '@/utils/apiResponse'
import ModalProposerPrecontrat from '@/components/visites/ModalProposerPrecontrat.vue'

const route = useRoute()
const router = useRouter()
const store = useDemandesLocationStore()
const preContratsStore = usePreContratsStore()
const { succes, info, erreur } = useNotification()
const { formatMontant, formatDateHeure } = useFormat()

const bienId = computed(() => Number(route.params.bienId))
const groupe = computed(() => store.demandesDuBien(bienId.value))

const photo = computed(
  () => groupe.value?.bien?.photos?.[0]?.urlPhoto || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
)

// Le backend ne renvoie que locataireId (cf. DemandeLocationDTO) — ni nom ni
// téléphone. À défaut, on identifie la demande par l'id du locataire.
function nomClient(d) {
  const complet = nomComplet(d.client)
  if (complet && complet !== '—') return complet
  return d.clientId ? `Locataire #${d.clientId}` : '—'
}

function libelleStatut(s) {
  return {
    EN_ATTENTE: 'En attente',
    ACCEPTEE: 'Retenue',
    ANNULEE: 'Annulée',
    REFUSEE: 'Refusée',
  }[s] || s
}
function chipClass(s) {
  return {
    EN_ATTENTE: 'chip--attente',
    ACCEPTEE: 'chip--ok',
    ANNULEE: 'chip--neutre',
    REFUSEE: 'chip--danger',
  }[s] || ''
}

async function valider(d) {
  await store.validerDemande(d.id)
  succes(`Demande de ${nomClient(d)} validée. Vous pouvez maintenant créer le pré-contrat.`)
}

async function toutAnnuler() {
  await store.toutAnnuler(bienId.value)
  info('Toutes les demandes en attente ont été annulées.')
}

const demandePrecontrat = ref(null)
const enCoursPrecontrat = ref(false)
function ouvrirPrecontrat(d) {
  demandePrecontrat.value = d
}
async function confirmerPrecontrat(payload) {
  enCoursPrecontrat.value = true
  try {
    await preContratsStore.creer({
      ...payload,
      demandeLocationId: demandePrecontrat.value.id,
    })
    succes('Pré-contrat envoyé au client pour validation.')
    demandePrecontrat.value = null
  } catch (e) {
    const status = e?.response?.status
    if (status === 500) {
      erreur(
        "Le serveur a refusé la création du pré-contrat (erreur 500). " +
          "Le bien passe « réservé » dès la validation de la demande, " +
          "ce que le backend rejette ensuite : correction attendue côté serveur.",
      )
    } else {
      erreur(extraireMessageErreur(e, 'Impossible de créer le pré-contrat'))
    }
  } finally {
    enCoursPrecontrat.value = false
  }
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
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
.photo {
  width: 120px;
  height: 90px;
  border-radius: 10px;
  object-fit: cover;
}
.entete-info {
  flex: 1;
}
.titre {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
}
.adresse {
  font-size: 14px;
  color: #64748b;
  margin: 4px 0;
}
.loyer {
  font-size: 15px;
  font-weight: 600;
  color: #212d4d;
}
.btn-tout-annuler {
  background: #fff;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 8px;
  padding: 9px 16px;
  font-weight: 600;
  font-size: 13.5px;
  cursor: pointer;
}
.liste-carte {
  padding: 0;
  overflow: hidden;
}
.section-titre {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  padding: 18px 20px;
  border-bottom: 1px solid #f1f5f9;
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
  padding: 12px 20px;
  border-bottom: 1px solid #f1f5f9;
}
.tableau td {
  padding: 14px 20px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f8fafc;
}
.tableau tr:last-child td {
  border-bottom: none;
}
.ligne--prio td {
  background: #fffdf5;
}
.rang {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  background: #f1f5f9;
  color: #475569;
  font-weight: 700;
  font-size: 12px;
  margin-right: 8px;
}
.badge-prio {
  background: #fef3c7;
  color: #b45309;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
}
.fort {
  font-weight: 600;
  color: #111827;
}
.gris {
  color: #94a3b8;
}
.source {
  background: #eef2ff;
  color: #4338ca;
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 600;
}
.source--express {
  background: #ecfeff;
  color: #0e7490;
}
.ta-right {
  text-align: right;
}
.btn-valider {
  background: #00d15a;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.btn-precontrat {
  background: #212d4d;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.chip {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.chip--attente {
  background: #fef3c7;
  color: #b45309;
}
.chip--ok {
  background: #dcfce7;
  color: #16a34a;
}
.chip--neutre {
  background: #f3f4f6;
  color: #6b7280;
}
.chip--danger {
  background: #fee2e2;
  color: #dc2626;
}
.vide {
  text-align: center;
  color: #94a3b8;
  padding: 40px;
}
</style>
