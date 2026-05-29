<template>
  <div>
    <!-- 3 onglets pour filtrer -->
    <div class="onglets" style="margin-bottom: 24px">
      <button
        v-for="onglet in onglets"
        :key="onglet.valeur"
        class="onglet-btn"
        :class="{ 'onglet-btn-actif': ongletActif === onglet.valeur }"
        @click="ongletActif = onglet.valeur"
      >
        {{ onglet.label }} ({{ onglet.complete }})
      </button>
    </div>

    <!-- Chargement -->
    <ChargementSpinner
      v-if="visitesStore.chargement"
      message="Chargement des visites"
    />

    <!-- Aucune visite -->
    <MessageVide
      v-else-if="visitesFiltrees.length === 0"
      icone=" · "
      texte="Aucune visite dans cette catégorie"
      sous-titre="Les demandes de visite apparaîtront ici"
    />

    <!-- Liste des visites -->
    <div v-else class="visites-liste">
      <CarteVisite
        v-for="visite in visitesFiltrees"
        :key="visite.id"
        :visite="visite"
        @approuver="approuverVisite"
        @refuser="refuserVisite"
      />
    </div>

    <!-- Modale de confirmation -->
    <ModalConfirmation
      v-if="modalOuverte"
      :titre="modalType === 'approuver' ? 'Approuver la visite' : 'Refuser la visite'"
      :message="
        modalType === 'approuver'
          ? 'Êtes-vous sûr de vouloir approuver cette visite ?'
          : 'Êtes-vous sûr de vouloir refuser cette visite ?'
      "
      :texte-bouton="modalType === 'approuver' ? 'Approuver' : 'Refuser'"
      :danger="modalType === 'refuser'"
      @confirmer="executerAction"
      @annuler="modalOuverte = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useVisitesStore } from '@/stores/visites.store'
import { useNotification } from '@/composables/useNotification'
import CarteVisite from '@/components/visites/CarteVisite.vue'
import ChargementSpinner from '@/components/common/ChargementSpinner.vue'
import MessageVide from '@/components/common/MessageVide.vue'
import ModalConfirmation from '@/components/common/ModalConfirmation.vue'

const visitesStore = useVisitesStore()
const { succes, erreur } = useNotification()

const ongletActif = ref('EN_ATTENTE')
const modalOuverte = ref(false)
const modalType = ref(null)
const visiteATraiter = ref(null)

const onglets = computed(() => [
  {
    valeur: 'EN_ATTENTE',
    label: 'En attente',
    complete: visitesStore.enAttente?.length || 0
  },
  {
    valeur: 'CONFIRMEE',
    label: 'Confirmées',
    complete: visitesStore.confirmees?.length || 0
  },
  {
    valeur: 'REFUSEE',
    label: 'Refusées',
    complete: visitesStore.refusees?.length || 0
  }
])

const visitesFiltrees = computed(() => {
  if (ongletActif.value === 'EN_ATTENTE') return visitesStore.enAttente
  if (ongletActif.value === 'CONFIRMEE') return visitesStore.confirmees
  if (ongletActif.value === 'REFUSEE') return visitesStore.refusees
  return []
})

function approuverVisite(id) {
  visiteATraiter.value = id
  modalType.value = 'approuver'
  modalOuverte.value = true
}

function refuserVisite(id) {
  visiteATraiter.value = id
  modalType.value = 'refuser'
  modalOuverte.value = true
}

async function executerAction() {
  try {
    if (modalType.value === 'approuver') {
      await visitesStore.approuver(visiteATraiter.value)
      succes('Visite approuvée')
    } else {
      await visitesStore.refuser(visiteATraiter.value)
      succes('Visite refusée')
    }
  } catch (err) {
    erreur('Erreur lors du traitement')
  } finally {
    modalOuverte.value = false
  }
}

onMounted(() => visitesStore.charger())
</script>

<style scoped>
.onglets {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.onglet-btn {
  padding: 10px 16px;
  border: 1px solid var(--bordure);
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}

.onglet-btn:hover {
  background: var(--fond-general);
}

.onglet-btn-actif {
  background: var(--couleur-primaire);
  color: white;
  border-color: var(--couleur-primaire);
}

.visites-liste {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
