<template>
  <div class="message-vide">
    <span class="message-vide-icone">{{ icone }}</span>
    <p class="message-vide-texte">{{ texte }}</p>
  </div>
</template>

<script setup>
defineProps({
  icone: { type: String, default: '📋' },
  texte: { type: String, default: 'Aucun élément à afficher' }
})
</script>
