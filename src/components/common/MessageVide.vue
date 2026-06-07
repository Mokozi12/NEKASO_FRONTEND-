<template>
  <div class="message-vide">
    <div class="message-vide__icone" v-if="icone">{{ icone }}</div>
    <p class="message-vide__texte">{{ texte }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  icone: { type: String, default: '📭' },
  texte: { type: String, default: 'Aucun élément à afficher' },
})
</script>

<style scoped>
.message-vide {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px;
  border-radius: 10px;
  border: 1px dashed var(--bordure);
  background: var(--fond-secondaire, transparent);
}
.message-vide__icone {
  font-size: 28px;
}
.message-vide__texte {
  margin: 0;
  color: var(--texte-secondaire);
  font-size: 14px;
}
</style>
