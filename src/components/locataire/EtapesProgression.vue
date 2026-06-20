<template>
  <div class="stepper" :class="`ton-${ton}`">
    <div v-for="(etape, i) in etapes" :key="i" class="etape" :class="{ atteinte: i <= courante }">
      <span v-if="i > 0" class="liaison" :class="{ pleine: i <= courante }"></span>
      <span class="pastille">
        <svg v-if="i < courante" class="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span v-if="libelles" class="lbl">{{ etape }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  etapes: { type: Array, required: true },
  courante: { type: Number, default: 0 },
  ton: { type: String, default: 'green' },
  libelles: { type: Boolean, default: false },
})
</script>

<style scoped>
.stepper {
  display: flex;
  align-items: flex-start;
  flex: 1;
}
.etape {
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
}
.etape:last-child {
  flex: 0 0 auto;
}
.liaison {
  flex: 1;
  height: 3px;
  background: #e2e8f0;
  border-radius: 2px;
}
.pastille {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #e2e8f0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.check {
  width: 9px;
  height: 9px;
}
.lbl {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: #94a3b8;
  white-space: nowrap;
}

.ton-green .etape.atteinte .pastille {
  background: #22c55e;
}
.ton-green .liaison.pleine {
  background: #22c55e;
}
.ton-green .etape.atteinte .lbl {
  color: #15803d;
}
.ton-red .etape.atteinte .pastille {
  background: #dc2626;
}
.ton-red .liaison.pleine {
  background: #dc2626;
}
.ton-red .etape.atteinte .lbl {
  color: #dc2626;
}
</style>
