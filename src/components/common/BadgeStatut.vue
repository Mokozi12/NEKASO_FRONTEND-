<template>
  <span :class="['badge', classBadge]">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  statut: { type: String, required: true }
})

const MAP_STATUTS = {
  DISPONIBLE: 'Disponible',
  RESERVE:    'Réservé',
  LOUE:       'Loué',
  ARCHIVE:    'Archivé',
  EN_ATTENTE: 'En attente',
  CONFIRMEE:  'Confirmée',
  REFUSEE:    'Refusée',
  EN_COURS:   'Actif',
  EXPIRE:     'Expiré',
  PAYE:       'Payé',
  EN_RETARD:  'En retard'
}

const label = computed(() => MAP_STATUTS[props.statut] ?? props.statut)

const classBadge = computed(() => `badge-${props.statut.toLowerCase()}`)
</script>
