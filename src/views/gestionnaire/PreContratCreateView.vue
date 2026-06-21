<template>
  <section class="precontrat-create">
    <div class="page-header">
      <h1>Créer un pré-contrat</h1>
      <p>Renseignez les informations pour créer un pré-contrat pour un bien.</p>
    </div>

    <div class="carte bloc">
      <div class="grille-2">
        <div class="champ">
          <label>Id du bien</label>
          <input v-model="form.bienId" type="number" />
        </div>
        <div class="champ">
          <label>Id du locataire</label>
          <input v-model="form.locataireId" type="number" />
        </div>
      </div>

      <div class="grille-2">
        <div class="champ">
          <label>Date de début prévue</label>
          <input v-model="form.dateDebut" type="date" />
        </div>
        <div class="champ">
          <label>Jour d'échéance</label>
          <input v-model.number="form.jourEcheance" type="number" min="1" max="28" />
        </div>
      </div>

      <div class="grille-2">
        <div class="champ">
          <label>Loyer mensuel</label>
          <input v-model.number="form.montantLoyer" type="number" />
        </div>
        <div class="champ">
          <label>Caution</label>
          <input v-model.number="form.montantCaution" type="number" />
        </div>
      </div>

      <div class="champ">
        <label>Conditions particulières</label>
        <textarea v-model="form.conditions" rows="4"></textarea>
      </div>

      <div class="actions">
        <button class="btn-corriger" :disabled="enCours" @click="annuler">Annuler</button>
        <button class="btn-activer" :disabled="enCours" @click="creerPreContrat">Créer</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePreContratsStore } from '@/stores/preContrats.store'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const preContratsStore = usePreContratsStore()
const { succes, info } = useNotification()

const form = reactive({
  bienId: null,
  locataireId: null,
  dateDebut: '',
  jourEcheance: 1,
  montantLoyer: 0,
  montantCaution: 0,
  conditions: '',
})
const enCours = ref(false)

function annuler() {
  router.back()
}

async function creerPreContrat() {
  enCours.value = true
  try {
    await preContratsStore.creer({
      bienImmobilierId: Number(form.bienId),
      locataireId: Number(form.locataireId),
      dateDebutPrevu: form.dateDebut,
      jourEcheancePaiement: Number(form.jourEcheance),
      montantLoyer: Number(form.montantLoyer),
      montantCaution: Number(form.montantCaution),
      conditions: form.conditions,
    })
    succes('Pré-contrat créé avec succès')
    router.push('/gestionnaire/contrats')
  } catch (e) {
    info('Erreur lors de la création du pré-contrat')
  }
  enCours.value = false
}
</script>

<style scoped>
.precontrat-create {
  padding: 0;
}
.grille-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.champ {
  margin-bottom: 12px;
}
.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 12px;
}
.btn-activer {
  background: #00a86b;
  color: #fff;
  border: none;
  padding: 8px 12px;
}
.btn-corriger {
  background: #fff;
  border: 1px solid #d1d5db;
  padding: 8px 12px;
}
</style>
