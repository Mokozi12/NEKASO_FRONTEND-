<template>
  <ModalBase :show="show" max-width="560px" :show-close="true" @close="$emit('cancel')">
    <div class="confirmation-content">
      <h2 class="confirmation-title">{{ title }}</h2>
      <p class="confirmation-message">{{ message }}</p>

      <div class="confirmation-actions">
        <button class="btn-cancel" @click="$emit('cancel')">Annuler</button>
        <button class="btn-confirm" @click="$emit('confirm')">{{ confirmText }}</button>
      </div>
    </div>
  </ModalBase>
</template>

<script setup>
import ModalBase from './ModalBase.vue'

defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Archiver ce bien ?'
  },
  message: {
    type: String,
    default: "Le bien sera archivé et n'apparaîtra plus dans la liste active. Cette action peut être annulée."
  },
  confirmText: {
    type: String,
    default: 'Archiver'
  }
})

defineEmits(['cancel', 'confirm'])
</script>

<style scoped>
.confirmation-content {
  padding: 32px;
}

.confirmation-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;
}

.confirmation-message {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.confirmation-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel, .btn-confirm {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.btn-cancel:hover {
  background-color: #f9fafb;
}

.btn-confirm {
  background-color: #1e293b; 
  border: none;
  color: white;
}

.btn-confirm:hover {
  background-color: #0f172a;
}
</style>
