<template>
  <section class="placeholder">
    <h2>{{ titre }}</h2>
    <p>Cette section sera disponible prochainement.</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const titre = computed(() => route.meta.title || 'Page')
</script>

<style scoped>
.placeholder {
  background: var(--fond-carte);
  border-radius: var(--bordure-radius);
  padding: 48px;
  text-align: center;
  box-shadow: var(--ombre-carte);
}
.placeholder h2 {
  color: var(--couleur-primaire);
  margin-bottom: 8px;
}
.placeholder p {
  color: var(--texte-secondaire);
}
</style>
