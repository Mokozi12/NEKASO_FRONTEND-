<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Mes demandes de visite</h1>
          <p class="page-subtitle">Suivez l'avancement de vos demandes de visite</p>
        </div>
        <button class="btn-nouvelle" @click="router.push('/locataire/biens')">+ Nouvelle visite</button>
      </div>

      <div v-if="visites.length === 0" class="etat-vide">
        <p>Aucune demande de visite pour le moment.</p>
        <button class="btn-primaire" @click="router.push('/locataire/biens')">Parcourir les biens</button>
      </div>

      <div v-else class="liste">
        <div v-for="v in itemsPage" :key="v.id" class="carte">
          
          <div class="carte-head">
            <img :src="photo(v.bien)" :alt="v.bien?.intitule" class="vignette" />
            <div class="infos">
              <h3 class="titre">{{ v.bien?.intitule }}</h3>
              <p class="meta">{{ metaLigne(v) }}</p>
              <p class="demandee">Demandée le {{ formatDate(v.dateCreation) }}</p>
            </div>
            <BadgeStatut :label="statut(v).label" :variant="statut(v).variant" />
          </div>

<div class="progression">
            <EtapesProgression :etapes="ETAPES" :courante="statut(v).etape" :ton="statut(v).ton" />
            <span class="etape-label" :class="`tl-${statut(v).ton}`">{{ statut(v).label }}</span>
          </div>

<div v-if="v.statut === 'PROPOSEE'" class="panneau">
            <p class="pn-info">
              Un créneau de visite vous a été proposé par le gestionnaire. Acceptez-le pour
              confirmer la visite.
            </p>
            <div class="pn-actions">
              <button class="btn-vert" @click="accepterCreneau(v)">Accepter le créneau</button>
              <button class="btn-annuler" @click="annuler(v)">Refuser</button>
            </div>
          </div>

<div v-else-if="v.statut === 'CONFIRMEE'" class="panneau">
            <p class="pn-info">Votre visite est confirmée. Une fois effectuée, validez-la ci-dessous.</p>
            <div class="pn-actions">
              <button class="btn-vert" @click="ouvrirCloture(v)">Valider la visite</button>
              <button class="btn-annuler" @click="annuler(v)">Annuler la visite</button>
            </div>
          </div>

<router-link
            v-else-if="v.statut === 'TERMINEE' && preContratDe(v)"
            :to="`/locataire/contrat/${preContratDe(v).id}`"
            class="lien-precontrat"
          >
            Visite terminée — consulter le pré-contrat proposé →
          </router-link>

<p v-else-if="message(v)" class="message" :class="`msg-${statut(v).ton}`">{{ message(v) }}</p>
        </div>
      </div>

      <Pagination v-model="page" :total-pages="totalPages" />
    </div>

    <ModalValiderVisiteLocataire
      v-if="visiteACloturer"
      :visite="visiteACloturer"
      :en-cours="enCoursCloture"
      @close="visiteACloturer = null"
      @valider="confirmerCloture"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useVisitesLocataireStore } from '@/stores/visitesLocataire.store'
import { useContratsStore } from '@/stores/contrats.store'
import { useNotification } from '@/composables/useNotification'
import { useFormat } from '@/composables/useFormat'
import BadgeStatut from '@/components/locataire/BadgeStatut.vue'
import EtapesProgression from '@/components/locataire/EtapesProgression.vue'
import Pagination from '@/components/common/Pagination.vue'
import ModalValiderVisiteLocataire from '@/components/visites/ModalValiderVisiteLocataire.vue'
import { usePagination } from '@/composables/usePagination'
import { extraireMessageErreur } from '@/utils/apiResponse'

const router = useRouter()
const visitesStore = useVisitesLocataireStore()
const contratsStore = useContratsStore()
const { succes, info, erreur } = useNotification()
const { formatDate } = useFormat()

onMounted(() => visitesStore.chargerVisites())

const ETAPES = ['Demandée', 'Proposée', 'Confirmée', 'Terminée']

const visites = computed(() => visitesStore.visites)
const { page, totalPages, itemsPage } = usePagination(visites, 5)

const nom = (p) => p ? `${p.prenom || ''} ${p.nom || ''}`.trim() || p.telephone || '—' : '—'
function photo(b) {
  return b?.photos?.[0]?.urlPhoto || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300'
}
function quartier(adresse) {
  if (!adresse) return ''
  const parts = adresse.split(',').map((s) => s.trim())
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0]
}
function metaLigne(v) {
  const q = quartier(v.bien?.adresse)
  if (v.creneau) return `${q} · ${formatDate(v.creneau.date)} · ${v.creneau.heure}`
  return q
}
function preContratDe(v) {
  return contratsStore.contrats.find(
    (c) => c.origine?.type === 'VISITE' && c.origine?.refId === v.id,
  )
}

const STATUTS = {
  EN_ATTENTE: { label: 'En attente', variant: 'amber', etape: 0, ton: 'green' },
  PROPOSEE: { label: 'Créneau proposé', variant: 'info', etape: 1, ton: 'green' },
  CONFIRMEE: { label: 'Confirmée', variant: 'green', etape: 2, ton: 'green' },
  TERMINEE: { label: 'Terminée', variant: 'green', etape: 3, ton: 'green' },
  REFUSEE: { label: 'Refusée', variant: 'red', etape: 0, ton: 'red' },
  ANNULEE: { label: 'Annulée', variant: 'neutral', etape: 0, ton: 'red' },
}
function statut(v) {
  return STATUTS[v.statut] || STATUTS.EN_ATTENTE
}
function message(v) {
  return {
    EN_ATTENTE: 'Votre demande a été transmise. En attente de confirmation par le gestionnaire.',
    TERMINEE: 'Visite terminée.',
    REFUSEE: 'Votre demande n\'a pas été retenue.',
    ANNULEE: 'Vous avez annulé cette visite.',
  }[v.statut] || ''
}

async function annuler(v) {
  info('Demande d\'annulation envoyée. La liste sera mise à jour prochainement.')
  await visitesStore.chargerVisites()
}

async function accepterCreneau(v) {
  try {
    await visitesStore.accepterCreneau(v.id)
    succes('Créneau accepté — votre visite est confirmée.')
  } catch (e) {
    erreur(extraireMessageErreur(e, "Impossible d'accepter le créneau"))
  }
}

const visiteACloturer = ref(null)
const enCoursCloture = ref(false)
function ouvrirCloture(v) {
  visiteACloturer.value = v
}
async function confirmerCloture({ choix, payload }) {
  enCoursCloture.value = true
  try {
    await visitesStore.cloturer(visiteACloturer.value.id, choix, payload)
    succes(
      choix === 'AVEC_CONTRAT'
        ? 'Visite validée — votre pré-contrat a été créé.'
        : 'Visite clôturée sans suite.',
    )
    visiteACloturer.value = null
  } catch (e) {
    erreur(extraireMessageErreur(e, 'Impossible de valider la visite'))
  } finally {
    enCoursCloture.value = false
  }
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

.liste {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.carte {
  background: #fff;
  border-radius: 14px;
  padding: 20px 22px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}
.carte-head {
  display: flex;
  gap: 16px;
  align-items: center;
}
.vignette {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}
.infos {
  flex: 1;
  min-width: 0;
}
.titre {
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
}
.meta {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
}
.demandee {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

.progression {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 18px;
  padding-top: 4px;
}
.etape-label {
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
}
.tl-green {
  color: #1e293b;
}
.tl-red {
  color: #dc2626;
}

.panneau {
  margin-top: 16px;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  border-radius: 10px;
  padding: 14px 16px;
}
.pn-lignes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pn-l {
  display: flex;
  justify-content: space-between;
  font-size: 13.5px;
}
.pn-l span {
  color: #94a3b8;
}
.pn-l strong {
  color: #1e293b;
  font-weight: 600;
}
.tel {
  color: #1e293b;
  font-weight: 700;
  text-decoration: none;
}
.pn-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}
.btn-vert {
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 10px 18px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}
.btn-vert:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-annuler {
  background: #fff;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 9px;
  padding: 10px 18px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}
.lien-precontrat {
  display: inline-block;
  margin-top: 14px;
  color: #15803d;
  font-weight: 600;
  font-size: 13.5px;
  text-decoration: none;
}
.message {
  margin-top: 14px;
  font-size: 13px;
  color: #64748b;
}
.msg-red {
  color: #dc2626;
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

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
  }
  .progression {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .pn-actions {
    flex-direction: column;
  }
  .btn-vert,
  .btn-annuler {
    width: 100%;
  }
}
</style>
