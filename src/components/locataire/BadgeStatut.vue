<template>
  <span class="badge-statut" :class="`is-${variant}`">
    <svg v-if="icon === 'check'" class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
    <svg v-else-if="icon === 'clock'" class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
    <svg v-else-if="icon === 'alert'" class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <line x1="12" y1="16.5" x2="12" y2="16.5" />
    </svg>
    {{ label }}
  </span>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  variant: { type: String, default: 'neutral' },
  icon: { type: String, default: '' },
})
</script>

<style scoped>
.badge-statut {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1;
}
.ic {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}
.is-green {
  background: #dcfce7;
  color: #15803d;
}
.is-amber {
  background: #fef3c7;
  color: #b45309;
}
.is-red {
  background: #fee2e2;
  color: #dc2626;
}
.is-neutral {
  background: #f1f5f9;
  color: #64748b;
}
.is-info {
  background: #dbeafe;
  color: #2563eb;
}
.is-navy {
  background: #e7ecf5;
  color: #212d4d;
}
</style>
