<!--
  ContratsView — Page principale de gestion des contrats.
  
  Deux modes d'affichage :
  1. Mode LISTE   → Tableau des contrats existants (ListeContrats)
  2. Mode WIZARD  → Assistant de création en 4 étapes (WizardContrat)
  
  L'utilisateur bascule entre les deux via les boutons
  « + Nouveau contrat » et « Voir la liste ».
-->
<template>
  <div>
    <!-- ═══════════ En-tête ═══════════ -->
    <div class="contrats-header">
      <p class="contrats-compteur">{{ contratsStore.contrats.length }} contrat(s)</p>

      <button v-if="!modeWizard" class="btn-primaire" @click="ouvrirWizard">
        + Nouveau contrat
      </button>
      <button v-else class="btn-primaire" @click="fermerWizard">Voir la liste</button>
    </div>

    <!-- ═══════════ Contenu ═══════════ -->
    <ChargementSpinner v-if="contratsStore.chargement" message="Chargement des contrats..." />

    <MessageVide
      v-else-if="!modeWizard && contratsStore.contrats.length === 0"
      icone="📄"
      texte="Aucun contrat pour le moment"
    />

    <!-- Mode liste : tableau des contrats -->
    <template v-else-if="!modeWizard">
      <ListeContrats :contrats="contratsPagines" @telecharger-pdf="contratsStore.telechargerPDF" />
      <div v-if="totalPagesContrats > 1" class="pagination-bar">
        <button class="pagination-btn" :disabled="pageCourante === 1" @click="pageCourante--">
          Précédent
        </button>
        <button
          v-for="p in totalPagesContrats"
          :key="p"
          class="pagination-btn"
          :class="{ 'pagination-btn--active': p === pageCourante }"
          @click="pageCourante = p"
        >
          {{ p }}
        </button>
        <button
          class="pagination-btn"
          :disabled="pageCourante === totalPagesContrats"
          @click="pageCourante++"
        >
          Suivant
        </button>
      </div>
    </template>

    <!-- Mode wizard : assistant de création -->
    <WizardContrat
      v-else
      :candidats="contratsStore.candidats"
      :biens="contratsStore.biensDisponibles"
      @contrat-cree="onContratCree"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContratsStore } from '@/stores/contrats.store'
import { useBiensStore } from '@/stores/biens.store'
import { useNotification } from '@/composables/useNotification'
import ChargementSpinner from '@/components/biens/common/ChargementSpinner.vue'
import MessageVide from '@/components/biens/common/MessageVide.vue'
import ListeContrats from '@/components/contrats/ListeContrats.vue'
import WizardContrat from '@/components/contrats/WizardContrat.vue'

const contratsStore = useContratsStore()
const biensStore = useBiensStore()
const { succes, erreur } = useNotification()

const modeWizard = ref(false)

const pageCourante = ref(1)
const parPageContrats = 6
const totalPagesContrats = computed(() =>
  Math.max(1, Math.ceil(contratsStore.contrats.length / parPageContrats)),
)
const contratsPagines = computed(() => {
  const debut = (pageCourante.value - 1) * parPageContrats
  return contratsStore.contrats.slice(debut, debut + parPageContrats)
})

/* ───── Ouverture / fermeture du wizard ───── */
function ouvrirWizard() {
  modeWizard.value = true
  // Charger les données nécessaires pour le wizard
  contratsStore.chargerCandidats()
  contratsStore.chargerBiens({ page: 1, size: 20 })
}

function fermerWizard() {
  modeWizard.value = false
}

/* ───── Callback : contrat créé depuis le wizard ───── */
async function onContratCree(contratData) {
  try {
    await contratsStore.creer(contratData)
    const bienId = contratData.bienId ?? contratData.bien?.id
    if (bienId) biensStore.louer(bienId)
    succes('Contrat créé avec succès !')
    modeWizard.value = false
  } catch (e) {
    erreur('Erreur lors de la création du contrat')
  }
}

/* ───── Chargement initial ───── */
onMounted(() => contratsStore.charger())
</script>

<style scoped>
.contrats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.contrats-compteur {
  font-size: 14px;
  color: var(--texte-secondaire);
}

.pagination-bar {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
  padding: 12px 0 4px;
  margin-top: 8px;
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
.pagination-btn:hover:not(:disabled) {
  background: #f8fafc;
  color: #1e293b;
}
.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.pagination-btn--active {
  font-weight: 700;
  color: #1e293b;
  border-color: #cbd5e1;
}
</style>
