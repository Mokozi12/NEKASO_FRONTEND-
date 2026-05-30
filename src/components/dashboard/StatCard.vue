<template>
  <article class="stat-card" :class="{ 'stat-card--primary': variant === 'primary' }">
    <div class="stat-card__icon">
      <AppIcon :name="icon" :size="22" />
    </div>
    <div class="stat-card__body">
      <span class="stat-card__label">{{ label }}</span>
      <div class="stat-card__row">
        <span class="stat-card__value">{{ value }}</span>
        <span v-if="badge" class="stat-card__badge" :class="badgeClass">{{ badge }}</span>
      </div>
      <span class="stat-card__sub">{{ subtitle }}</span>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import AppIcon from '@/components/icons/AppIcon.vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  subtitle: { type: String, default: '' },
  badge: { type: String, default: '' },
  icon: { type: String, required: true },
  variant: { type: String, default: 'default' },
  trend: { type: String, default: 'neutral' },
})

const badgeClass = computed(() => ({
  'stat-card__badge--up': props.trend === 'up',
  'stat-card__badge--down': props.trend === 'down',
}))
</script>

<style scoped>
.stat-card {
  display: flex;
  gap: 16px;
  padding: 20px 22px;
  border-radius: 14px;
  background: var(--fond-carte);
  box-shadow: var(--ombre-carte);
  min-height: 120px;
}

.stat-card--primary {
  background: var(--couleur-primaire);
  color: var(--texte-blanc);
}

.stat-card--primary .stat-card__label,
.stat-card--primary .stat-card__sub {
  color: rgba(255, 255, 255, 0.75);
}

.stat-card--primary .stat-card__icon {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.stat-card--primary .stat-card__icon :deep(.app-icon--img) {
  filter: brightness(0) invert(1);
}

.stat-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--fond-general);
  color: var(--couleur-primaire);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card__body {
  flex: 1;
  min-width: 0;
}

.stat-card__label {
  display: block;
  font-size: 13px;
  color: var(--texte-secondaire);
  margin-bottom: 6px;
}

.stat-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.stat-card__value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
}

.stat-card__sub {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--texte-secondaire);
}

.stat-card__badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
}

.stat-card__badge--up {
  background: #dcfce7;
  color: #15803d;
}

.stat-card__badge--down {
  background: #fee2e2;
  color: #b91c1c;
}

.stat-card--primary .stat-card__badge--up {
  background: rgba(34, 197, 94, 0.25);
  color: #bbf7d0;
}

.stat-card--primary .stat-card__badge--down {
  background: rgba(239, 68, 68, 0.25);
  color: #fecaca;
}
</style>
