<template>
  <div class="carte carte-demande">
    <div class="demande-entete">
      <div>
        <p class="demande-nom">{{ demande.locataire.nom }} {{ demande.locataire.prenom }}</p>
        <p class="demande-tel">📞 {{ demande.locataire.telephone }}</p>
      </div>
      <BadgeStatut :statut="demande.statut" />
    </div>

    <div class="demande-corps">
      <p class="demande-bien">{{ demande.bien.adresse }}</p>
      <p class="demande-type">{{ typeLibelle(demande.bien.typeBien) }}</p>
      <p class="demande-loyer">{{ formatMontant(demande.bien.loyer) }} FCFA/mois</p>
      <p class="demande-date">Demandée le {{ formatDate(demande.dateDemande) }}</p>
    </div>

    <div v-if="demande.statut === 'EN_ATTENTE'" class="demande-actions">
      <button class="btn-secondaire" @click="$emit('refuser', demande.id)">Refuser</button>
      <button class="btn-primaire" @click="$emit('ouvrir-validation', demande)">Valider et créer contrat</button>
    </div>
    <div v-else class="demande-statut-final">
      <span v-if="demande.statut === 'VALIDEE'" style="color: var(--couleur-succes); font-weight: 600">Validée ✓</span>
      <span v-else style="color: var(--couleur-danger); font-weight: 600">Refusée</span>
    </div>
  </div>
</template>

<script setup>
import BadgeStatut from '@/components/common/BadgeStatut.vue'
import { useFormat } from '@/composables/useFormat'

const { formatMontant, formatDate } = useFormat()

defineProps({ demande: { type: Object, required: true } })
defineEmits(['refuser', 'ouvrir-validation'])

function typeLibelle(type) {
  const types = { APPARTEMENT: 'Appartement', STUDIO: 'Studio', CHAMBRE: 'Chambre', LOCAL: 'Local' }
  return types[type] || type
}
</script>

<style scoped>
.carte-demande { padding: 16px; border-radius: 12px; border: 1px solid var(--bordure); }
.demande-entete { display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px; }
.demande-nom { font-size: 14px; font-weight: 600; }
.demande-tel { font-size: 12px; color: var(--texte-secondaire); margin-top: 2px; }
.demande-corps { margin-bottom: 12px; }
.demande-bien { font-size: 13px; font-weight: 600; color: var(--couleur-primaire); }
.demande-type { font-size: 12px; color: var(--texte-secondaire); margin-top: 2px; }
.demande-loyer { font-size: 13px; font-weight: 600; color: var(--couleur-accent); margin-top: 4px; }
.demande-date { font-size: 12px; color: var(--texte-secondaire); margin-top: 4px; }
.demande-actions { display: flex; gap: 8px; padding-top: 12px; border-top: 1px solid var(--bordure); }
.demande-actions button { flex: 1; }
.demande-statut-final { text-align: center; padding: 8px; }
</style>
