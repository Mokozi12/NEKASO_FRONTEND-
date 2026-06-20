<template>
  <div class="carte carte-visite">
    
    <div class="visite-entete">
      <div>
        <p class="visite-nom">{{ visite.locataire.nom }} {{ visite.locataire.prenom }}</p>
        <p class="visite-tel">{{ visite.locataire.telephone }}</p>
      </div>
      <BadgeStatut :statut="visite.statut" />
    </div>

    
    <div class="visite-corps">
      <p class="visite-bien">{{ visite.bien.adresse }}</p>
      <p class="visite-type">{{ typeLibelle(visite.bien.typeBien) }}</p>
      <p class="visite-loyer">{{ formatMontant(visite.bien.loyer) }} FCFA/mois</p>
      <p class="visite-date">Demandée le {{ formatDate(visite.dateCreation) }}</p>
    </div>

    
    <div v-if="visite.statut === 'EN_ATTENTE'" class="visite-actions">
      <button class="btn-secondaire" @click="$emit('refuser', visite.id)">Refuser</button>
      <button class="btn-primaire" @click="$emit('approuver', visite.id)">Approuver</button>
    </div>

    
    <div v-else class="visite-statut-final">
      <span v-if="visite.statut === 'CONFIRMEE'" style="color: var(--couleur-succes)">
        Confirmées
      </span>
      <span v-else style="color: var(--couleur-danger); font-weight: 600">Refusée</span>
    </div>
  </div>
</template>

<script setup>
import BadgeStatut from '@/components/biens/common/BadgeStatut.vue'
import { useFormat } from '@/composables/useFormat'

const { formatMontant, formatDate } = useFormat()

defineProps({
  visite: { type: Object, required: true },
})

defineEmits(['approuver', 'refuser'])

function typeLibelle(type) {
  const types = {
    APPARTEMENT: 'Appartement',
    STUDIO: 'Studio',
    CHAMBRE: 'Chambre',
    LOCAL: 'Local commercial',
  }
  return types[type] || type
}
</script>

<style scoped>
.carte-visite {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--bordure);
}

.visite-entete {
  display: flex;
  justify-content: space-between;
  align-items: start;
}

.visite-nom {
  font-size: 14px;
  font-weight: 600;
}

.visite-tel {
  font-size: 12px;
  color: var(--texte-secondaire);
  margin-top: 2px;
}

.visite-corps {
  margin-bottom: 12px;
}

.visite-bien {
  font-size: 13px;
  font-weight: 600;
  color: var(--couleur-primaire);
}

.visite-type {
  font-size: 12px;
  color: var(--texte-secondaire);
  margin-top: 4px;
}

.visite-loyer {
  font-size: 13px;
  font-weight: 600;
  color: var(--couleur-primaire);
  margin-top: 4px;
}

.visite-date {
  font-size: 12px;
  color: var(--texte-secondaire);
  margin-top: 4px;
}

.visite-actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--texte-secondaire);
}

.visite-actions button {
  flex: 1;
}

.visite-statut-final {
  text-align: center;
  padding: 8px;
}
</style>
