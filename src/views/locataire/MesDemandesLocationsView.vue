<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Mes demandes de location</h1>
          <p class="page-subtitle">Suivez l'avancement de vos dossiers de location</p>
        </div>
        <button class="btn-nouvelle" @click="router.push('/locataire/biens')">+ Nouvelle demande</button>
      </div>

      <div v-if="demandes.length === 0" class="etat-vide">
        <p>Aucune demande de location pour le moment.</p>
        <button class="btn-primaire" @click="router.push('/locataire/biens')">Parcourir les biens</button>
      </div>

      <div v-else class="grille">
        <div v-for="d in itemsPage" :key="d.id" class="carte">
          <div class="carte-head">
            <img :src="photo(d.bien)" :alt="d.bien?.intitule" class="vignette" />
            <div class="infos">
              <h3 class="titre">{{ d.bien?.intitule }}</h3>
              <p class="meta">{{ quartier(d.bien?.adresse) }} · {{ d.source === 'DIRECTE' ? 'Demande express' : 'Suite à une visite' }}</p>
              <p class="envoyee">Envoyée le {{ formatDate(d.dateDemande || d.dateCreation) }}</p>
            </div>
            <BadgeStatut :label="st(d).label" :variant="st(d).variant" />
          </div>

          <div class="progression">
            <EtapesProgression :etapes="ETAPES" :courante="st(d).etape" :ton="st(d).ton" />
          </div>

          <p v-if="message(d)" class="message" :class="`msg-${st(d).ton}`">{{ message(d) }}</p>

          <div class="actions">
            <button v-if="d.statut === 'EN_ATTENTE'" class="btn-annuler" @click="annuler(d)">
              Annuler la demande
            </button>
            <router-link
              v-else-if="d.statut === 'VALIDEE' && preContratDe(d)"
              :to="`/locataire/contrat/${preContratDe(d).id}`"
              class="btn-vert lien"
            >
              {{ preContratDe(d).statut === 'ACTIF' ? 'Voir mon contrat →' : 'Voir mon pré-contrat →' }}
            </router-link>
          </div>
        </div>
      </div>

      <Pagination v-model="page" :total-pages="totalPages" />
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDemandesLocataireStore } from '@/stores/demandesLocataire.store'
import { useContratsStore } from '@/stores/contrats.store'
import { useNotification } from '@/composables/useNotification'
import { useFormat } from '@/composables/useFormat'
import BadgeStatut from '@/components/locataire/BadgeStatut.vue'
import EtapesProgression from '@/components/locataire/EtapesProgression.vue'
import Pagination from '@/components/common/Pagination.vue'
import { usePagination } from '@/composables/usePagination'

const router = useRouter()
const store = useDemandesLocataireStore()
const contratsStore = useContratsStore()
const { info } = useNotification()
const { formatDate } = useFormat()

onMounted(() => store.chargerDemandes())

const ETAPES = ['Demande envoyée', 'Pré-contrat', 'Bail actif']

const demandes = computed(() => store.mesDemandes)
const { page, totalPages, itemsPage } = usePagination(demandes, 6)

function photo(b) {
  return b?.photos?.[0]?.urlPhoto || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300'
}
function quartier(adresse) {
  if (!adresse) return ''
  const parts = adresse.split(',').map((s) => s.trim())
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0]
}
function preContratDe(d) {
  return contratsStore.contrats.find(
    (c) => c.origine?.type === 'DEMANDE_RESERVATION' && c.origine?.refId === d.id,
  )
}

function st(d) {
  if (d.statut === 'ANNULEE') return { label: 'Annulée', variant: 'neutral', etape: 0, ton: 'red' }
  if (d.statut === 'REFUSEE') return { label: 'Non retenue', variant: 'red', etape: 0, ton: 'red' }
  if (d.statut === 'VALIDEE') {
    const c = preContratDe(d)
    if (c?.statut === 'ACTIF') return { label: 'Bail actif', variant: 'green', etape: 2, ton: 'green' }
    return { label: 'Retenue', variant: 'green', etape: 1, ton: 'green' }
  }
  return { label: 'En attente', variant: 'amber', etape: 0, ton: 'green' }
}
function message(d) {
  return {
    EN_ATTENTE: 'En attente de validation par le gestionnaire.',
    VALIDEE: 'Félicitations ! Votre demande a été retenue, un pré-contrat vous est proposé.',
    ANNULEE: 'Cette demande a été annulée.',
    REFUSEE: 'Ce bien ne vous a pas été octroyé.',
  }[d.statut] || ''
}

async function annuler(d) {
  await store.annuler(d.id)
  info('Demande annulée.')
}
</script>

<style scoped>
.page {
  padding: 40px 0 80px;
  background: #f4f6fa;
  min-height: calc(100vh - 70px);
}
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 28px;
}
.page-title {
  font-size: 30px;
  font-weight: 700;
  color: #1e293b;
}
.page-subtitle {
  font-size: 15px;
  color: #64748b;
  margin-top: 2px;
}
.btn-nouvelle {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  background: #fff;
  border: 1px solid #e2e8f0;
  padding: 10px 16px;
  border-radius: 9px;
  cursor: pointer;
  white-space: nowrap;
}
.btn-nouvelle:hover {
  border-color: #cbd5e1;
}

.grille {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}
.carte {
  background: #fff;
  border-radius: 14px;
  padding: 20px 22px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
}
.carte-head {
  display: flex;
  gap: 14px;
  align-items: center;
}
.vignette {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}
.infos {
  flex: 1;
  min-width: 0;
}
.titre {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}
.meta {
  font-size: 12.5px;
  color: #64748b;
  margin-top: 2px;
}
.envoyee {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 3px;
}
.progression {
  margin-top: 18px;
}
.message {
  margin-top: 14px;
  font-size: 13px;
  color: #64748b;
}
.msg-red {
  color: #dc2626;
}
.actions {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
}
.actions:empty {
  display: none;
}
.btn-annuler {
  background: #fff;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 9px;
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.btn-vert {
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 9px 16px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}
.btn-vert:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.lien {
  text-decoration: none;
}

.etat-vide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px 0;
  color: #94a3b8;
}
.btn-primaire {
  background: #1e293b;
  color: #fff;
  border: none;
  padding: 11px 22px;
  border-radius: 9px;
  font-weight: 600;
  cursor: pointer;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}
.modal {
  background: #fff;
  border-radius: 16px;
  padding: 26px;
  width: 100%;
  max-width: 460px;
}
.modal h3 {
  font-size: 19px;
  font-weight: 600;
  color: #1e293b;
}
.modal-sub {
  font-size: 13.5px;
  color: #64748b;
  margin: 6px 0 16px;
}
.select {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  font-size: 14px;
  font-family: inherit;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}
.btn-secondaire {
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #475569;
  border-radius: 9px;
  padding: 10px 18px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 760px) {
  .page-header {
    flex-direction: column;
  }
  .grille {
    grid-template-columns: 1fr;
  }
}
</style>
