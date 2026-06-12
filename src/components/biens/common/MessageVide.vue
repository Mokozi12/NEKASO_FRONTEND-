<template>
  <div class="message-vide">
    <span class="message-vide-icone">{{ icone }}</span>
    <h3 v-if="titre" class="message-vide-titre">{{ titre }}</h3>
    <p class="message-vide-texte">{{ message || texte }}</p>
  </div>
</template>

<script setup>
defineProps({
  icone: { type: String, default: '📋' },
  titre: { type: String, default: '' },
  message: { type: String, default: '' },
  texte: { type: String, default: 'Aucun élément à afficher' }
})
</script>

<style scoped>
.message-vide {
  text-align: center;
  padding: 40px 20px;
}

.message-vide-icone {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.message-vide-titre {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.message-vide-texte {
  font-size: 14px;
  color: #6b7280;
}
</style>
