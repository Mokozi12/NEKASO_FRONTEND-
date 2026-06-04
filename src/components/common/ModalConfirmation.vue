<template>
  <div class="modal-overlay" @click.self="$emit('annuler')">
    <div class="modal">
      <h3 class="modal-titre">{{ titre }}</h3>
      <p class="modal-message">{{ message }}</p>

      <div class="modal-actions">
        <button class="btn-secondaire" @click="$emit('annuler')">Annuler</button>
        <button
          :class="danger ? 'btn-danger' : 'btn-primaire'"
          @click="$emit('confirmer')"
        >
          {{ texteBouton }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  titre:       { type: String, required: true },
  message:     { type: String, required: true },
  texteBouton: { type: String, default: 'Confirmer' },
  danger:      { type: Boolean, default: false }
})

defineEmits(['confirmer', 'annuler'])
</script>

<style scoped>
.modal-message {
  font-size: 14px;
  color: var(--texte-secondaire);
  line-height: 1.6;
}
</style>
