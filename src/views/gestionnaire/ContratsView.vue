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

      <button
        v-if="!modeWizard"
        class="btn-primaire"
        @click="ouvrirWizard"
      >
        + Nouveau contrat
      </button>
      <button
        v-else
        class="btn-primaire"
        @click="fermerWizard"
      >
        Voir la liste
      </button>
    </div>

    <!-- ═══════════ Contenu ═══════════ -->
    <ChargementSpinner v-if="contratsStore.chargement" message="Chargement des contrats..." />

    <MessageVide
      v-else-if="!modeWizard && contratsStore.contrats.length === 0"
      icone="📄"
      texte="Aucun contrat pour le moment"
    />

    <!-- Mode liste : tableau des contrats -->
    <ListeContrats
      v-else-if="!modeWizard"
      :contrats="contratsStore.contrats"
      @telecharger-pdf="contratsStore.telechargerPDF"
    />

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
import { ref, onMounted } from 'vue'
import { useContratsStore } from '@/stores/contrats.store'
import { useNotification } from '@/composables/useNotification'
import ChargementSpinner from '@/components/common/ChargementSpinner.vue'
import MessageVide from '@/components/common/MessageVide.vue'
import ListeContrats from '@/components/contrats/ListeContrats.vue'
import WizardContrat from '@/components/contrats/WizardContrat.vue'

const contratsStore = useContratsStore()
const { succes, erreur } = useNotification()

const modeWizard = ref(false)

/* ───── Ouverture / fermeture du wizard ───── */
function ouvrirWizard() {
  modeWizard.value = true
  // Charger les données nécessaires pour le wizard
  contratsStore.chargerCandidats()
  contratsStore.chargerBiens()
}

function fermerWizard() {
  modeWizard.value = false
}

/* ───── Callback : contrat créé depuis le wizard ───── */
async function onContratCree(contratData) {
  try {
    await contratsStore.creer(contratData)
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
</style>
