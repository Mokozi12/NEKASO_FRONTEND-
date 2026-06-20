<!--
  Pagination — contrôle de pagination réutilisable (Précédent / pages / Suivant).
  S'utilise avec v-model (page courante) + :total-pages. Masqué s'il n'y a qu'une page.
-->
<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="Pagination">
    <button class="pg-btn" :disabled="modelValue === 1" @click="aller(modelValue - 1)">
      Précédent
    </button>

    <button
      v-for="p in pagesVisibles"
      :key="p.cle"
      class="pg-btn"
      :class="{ actif: p.num === modelValue, ellipsis: p.num === null }"
      :disabled="p.num === null"
      @click="p.num && aller(p.num)"
    >
      {{ p.num === null ? '…' : p.num }}
    </button>

    <button class="pg-btn" :disabled="modelValue === totalPages" @click="aller(modelValue + 1)">
      Suivant
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
})
const emit = defineEmits(['update:modelValue'])

// Fenêtre de pages autour de la page courante, avec « … » si nécessaire.
const pagesVisibles = computed(() => {
  const total = props.totalPages
  const courant = props.modelValue
  const out = []
  const ajouter = (num, cle) => out.push({ num, cle: cle ?? `p${num}` })

  if (total <= 7) {
    for (let i = 1; i <= total; i++) ajouter(i)
    return out
  }

  ajouter(1)
  if (courant > 3) ajouter(null, 'g')
  const debut = Math.max(2, courant - 1)
  const fin = Math.min(total - 1, courant + 1)
  for (let i = debut; i <= fin; i++) ajouter(i)
  if (courant < total - 2) ajouter(null, 'd')
  ajouter(total)
  return out
})

function aller(p) {
  if (p >= 1 && p <= props.totalPages && p !== props.modelValue) emit('update:modelValue', p)
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  flex-wrap: wrap;
}
.pg-btn {
  min-width: 40px;
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.pg-btn:hover:not(:disabled):not(.actif) {
  background: #f8fafc;
  color: #1e293b;
  border-color: #cbd5e1;
}
.pg-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.pg-btn.actif {
  background: #1e293b;
  border-color: #1e293b;
  color: #fff;
  font-weight: 700;
}
.pg-btn.ellipsis {
  border: none;
  background: transparent;
  cursor: default;
  min-width: auto;
  padding: 8px 4px;
}
</style>
