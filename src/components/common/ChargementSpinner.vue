<template>
  <div class="chargement-spinner" role="status" aria-live="polite">
    <div class="spinner" aria-hidden="true"></div>
    <div class="message" v-if="message">{{ message }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: { type: String, default: 'Chargement...' },
})
</script>

<style scoped>
.chargement-spinner {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  padding: 12px;
}
.spinner {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid rgba(0, 0, 0, 0.08);
  border-top-color: var(--couleur-primaire);
  animation: spin 1s linear infinite;
}
.message {
  font-size: 14px;
  color: var(--texte-secondaire);
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
