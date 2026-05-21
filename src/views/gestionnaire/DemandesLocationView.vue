<template>
  <div>
    <div class="onglets" style="margin-bottom: 24px">
      <button
        v-for="onglet in onglets" :key="onglet.valeur"
        :class="['onglet-btn', { 'onglet-btn--actif': ongletActif === onglet.valeur }]"
        @click="ongletActif = onglet.valeur"
      >
        {{ onglet.label }} ({{ onglet.compte }})
      </button>
    </div>

    <ChargementSpinner v-if="demandesStore.chargement" message="Chargement des demandes..." />

    <MessageVide
      v-else-if="demandesFiltrees.length === 0"
      icone="📋"
      :texte="`Aucune demande ${ongletActif === 'EN_ATTENTE' ? 'en attente' : ongletActif.toLowerCase()}`"
    />

    <div v-else class="demandes-liste">
      <CarteDemandeLocation
        v-for="demande in demandesFiltrees" :key="demande.id"
        :demande="demande"
        @ouvrir-validation="ouvrirValidation"
        @refuser="confirmerRefus"
      />
    </div>

    <!-- Modale de validation du contrat -->
    <div v-if="demandeAValider" class="modal-overlay" @click.self="demandeAValider = null">
      <div class="modal">
        <h3 class="modal-titre">Valider la demande — Créer le contrat</h3>
        <p style="font-size:13px; color:var(--texte-secondaire); margin-bottom:20px">
          {{ demandeAValider.locataire.nom }} {{ demandeAValider.locataire.prenom }} —
          {{ demandeAValider.bien.adresse }}
        </p>

        <div class="champ">
          <label>Montant du loyer mensuel (FCFA) *</label>
          <input v-model.number="formValidation.montantLoyer" type="number" placeholder="350000" />
        </div>
        <div class="champ">
          <label>Montant de la caution (FCFA) *</label>
          <input v-model.number="formValidation.montantCaution" type="number" placeholder="700000" />
        </div>
        <div class="grille-2">
          <div class="champ">
            <label>Date de début *</label>
            <input v-model="formValidation.dateDebut" type="date" />
          </div>
          <div class="champ">
            <label>Date de fin *</label>
            <input v-model="formValidation.dateFin" type="date" />
          </div>
        </div>
        <div class="champ">
          <label>Conditions du bail</label>
          <textarea v-model="formValidation.conditions" rows="3" placeholder="Ex: Pas d'animaux..."></textarea>
        </div>

        <p v-if="erreurValidation" style="color:var(--couleur-danger);font-size:13px">{{ erreurValidation }}</p>

        <div class="modal-actions">
          <button class="btn-secondaire" @click="demandeAValider = null">Annuler</button>
          <button class="btn-primaire" @click="executerValidation">Créer le contrat</button>
        </div>
      </div>
    </div>

    <ModalConfirmation
      v-if="confirmationOuverte"
      titre="Refuser la demande"
      message="Êtes-vous sûr de vouloir refuser cette demande de location ?"
      texte-bouton="Refuser"
      :danger="true"
      @confirmer="executerRefus"
      @annuler="confirmationOuverte = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDemandesLocationStore } from '@/stores/demandesLocation.store'
import { useNotification } from '@/composables/useNotification'
import CarteDemandeLocation from '@/components/demandesLocation/CarteDemandeLocation.vue'
import ChargementSpinner from '@/components/common/ChargementSpinner.vue'
import MessageVide from '@/components/common/MessageVide.vue'
import ModalConfirmation from '@/components/common/ModalConfirmation.vue'

const demandesStore = useDemandesLocationStore()
const { succes, erreur } = useNotification()

const ongletActif = ref('EN_ATTENTE')
const demandeAValider = ref(null)
const demandeARefuser = ref(null)
const confirmationOuverte = ref(false)
const erreurValidation = ref('')

const formValidation = ref({
  montantLoyer: '', montantCaution: '', dateDebut: '', dateFin: '', conditions: ''
})

const onglets = computed(() => [
  { valeur: 'EN_ATTENTE', label: 'En attente', compte: demandesStore.enAttente.length },
  { valeur: 'VALIDEE',    label: 'Validées',   compte: demandesStore.validees.length },
  { valeur: 'REFUSEE',    label: 'Refusées',   compte: demandesStore.refusees.length }
])

const demandesFiltrees = computed(() => {
  if (ongletActif.value === 'EN_ATTENTE') return demandesStore.enAttente
  if (ongletActif.value === 'VALIDEE')    return demandesStore.validees
  return demandesStore.refusees
})

function ouvrirValidation(demande) {
  demandeAValider.value = demande
  formValidation.value.montantLoyer   = demande.bien.loyer
  formValidation.value.montantCaution = demande.bien.loyer * 2
}

function confirmerRefus(id) {
  demandeARefuser.value = id
  confirmationOuverte.value = true
}

async function executerValidation() {
  if (!formValidation.value.montantLoyer || !formValidation.value.dateDebut || !formValidation.value.dateFin) {
    erreurValidation.value = 'Remplissez tous les champs obligatoires *'
    return
  }
  try {
    await demandesStore.valider(demandeAValider.value.id, formValidation.value)
    succes('Contrat de bail créé avec succès !')
    demandeAValider.value = null
  } catch {
    erreur('Erreur lors de la validation')
  }
}

async function executerRefus() {
  try {
    await demandesStore.refuser(demandeARefuser.value)
    succes('Demande refusée')
  } catch {
    erreur('Erreur lors du refus')
  } finally {
    confirmationOuverte.value = false
  }
}

onMounted(() => demandesStore.charger())
</script>

<style scoped>
.onglets { display: flex; gap: 8px; flex-wrap: wrap; }
.onglet-btn {
  padding: 10px 16px; border: 1px solid var(--bordure);
  background: white; border-radius: 8px; cursor: pointer;
  font-size: 13px; font-weight: 500; transition: all 0.2s;
}
.onglet-btn--actif { background: var(--couleur-primaire); color: white; border-color: var(--couleur-primaire); }
.demandes-liste { display: flex; flex-direction: column; gap: 12px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: white; border-radius: 16px; padding: 32px; width: 100%; max-width: 540px; max-height: 90vh; overflow-y: auto; }
.modal-titre { font-size: 18px; font-weight: 700; color: var(--couleur-primaire); margin-bottom: 8px; }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--bordure); }
</style>
