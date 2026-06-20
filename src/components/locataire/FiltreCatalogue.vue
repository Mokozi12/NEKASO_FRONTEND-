<template>
  <div class="filtre-catalogue">
    
    <div class="filtre-search-row">
      <div class="search-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          :value="recherche"
          @input="$emit('update:recherche', $event.target.value)"
          placeholder="Rechercher un bien ou un quartier..."
        />
      </div>

      <button
        class="btn-filtres-avances"
        :class="{ actif: ouvert || nbFiltresActifs > 0 }"
        @click="ouvert = !ouvert"
        title="Filtres avancés"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" x2="4" y1="21" y2="14"/>
          <line x1="4" x2="4" y1="10" y2="3"/>
          <line x1="12" x2="12" y1="21" y2="12"/>
          <line x1="12" x2="12" y1="8" y2="3"/>
          <line x1="20" x2="20" y1="21" y2="16"/>
          <line x1="20" x2="20" y1="12" y2="3"/>
          <line x1="1" x2="7" y1="14" y2="14"/>
          <line x1="9" x2="15" y1="8" y2="8"/>
          <line x1="17" x2="23" y1="16" y2="16"/>
        </svg>
        <span class="btn-filtres-label">Filtres</span>
        <span v-if="nbFiltresActifs > 0" class="filtres-count">{{ nbFiltresActifs }}</span>
      </button>
    </div>

<Transition name="slide-down">
      <div v-if="ouvert" class="panneau-filtres">
        <div class="filtre-champ">
          <label>Loyer min. (FCFA)</label>
          <input
            type="number"
            min="0"
            step="10000"
            placeholder="0"
            :value="loyerMin ?? ''"
            @input="emitNombre('update:loyerMin', $event.target.value)"
          />
        </div>
        <div class="filtre-champ">
          <label>Loyer max. (FCFA)</label>
          <input
            type="number"
            min="0"
            step="10000"
            placeholder="Sans limite"
            :value="loyerMax ?? ''"
            @input="emitNombre('update:loyerMax', $event.target.value)"
          />
        </div>
        <div class="filtre-champ">
          <label>Nombre de pièces</label>
          <div class="select-wrap">
            <select :value="piecesMin ?? ''" @change="emitNombre('update:piecesMin', $event.target.value)">
              <option value="">Indifférent</option>
              <option value="1">1 pièce et +</option>
              <option value="2">2 pièces et +</option>
              <option value="3">3 pièces et +</option>
              <option value="4">4 pièces et +</option>
            </select>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        <button class="btn-reset" @click="reinitialiser">Réinitialiser</button>
      </div>
    </Transition>

<div class="category-pills">
      <button
        v-for="cat in categories"
        :key="cat.value"
        class="pill"
        :class="{ active: typeActif === cat.value }"
        @click="$emit('update:typeActif', cat.value)"
      >
        {{ cat.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  recherche: { type: String, default: '' },
  typeActif: { type: [String, null], default: null },
  loyerMin: { type: [Number, null], default: null },
  loyerMax: { type: [Number, null], default: null },
  piecesMin: { type: [Number, null], default: null },
})

const emit = defineEmits([
  'update:recherche',
  'update:typeActif',
  'update:loyerMin',
  'update:loyerMax',
  'update:piecesMin',
])

const ouvert = ref(false)

const nbFiltresActifs = computed(
  () =>
    (props.loyerMin ? 1 : 0) + (props.loyerMax ? 1 : 0) + (props.piecesMin ? 1 : 0),
)

function emitNombre(evenement, valeur) {
  emit(evenement, valeur === '' || valeur === null ? null : Number(valeur))
}

function reinitialiser() {
  emit('update:loyerMin', null)
  emit('update:loyerMax', null)
  emit('update:piecesMin', null)
}

const categories = [
  { value: null, label: 'Tout' },
  { value: 'chambre', label: 'Chambre' },
  { value: 'studio', label: 'Studio' },
  { value: 'appartement', label: 'Appartement' },
  { value: 'villa', label: 'Villa' },
]
</script>

<style scoped>
.filtre-catalogue {
  margin-bottom: 32px;
}

.filtre-search-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 13px 16px;
  transition: border-color 0.2s;
}

.search-wrapper:focus-within {
  border-color: #9ca3af;
}

.search-wrapper svg {
  stroke: #9ca3af;
  flex-shrink: 0;
}

.search-wrapper input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #111827;
  background: transparent;
  font-family: inherit;
}

.search-wrapper input::placeholder {
  color: #9ca3af;
}

.btn-filtres-avances {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 13px 18px;
  cursor: pointer;
  transition: all 0.2s;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  white-space: nowrap;
}

.btn-filtres-avances:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.btn-filtres-avances svg {
  stroke: #6b7280;
}

.btn-filtres-avances.actif {
  background-color: #1e293b;
  border-color: #1e293b;
  color: #ffffff;
}

.btn-filtres-avances.actif svg {
  stroke: #ffffff;
}

.filtres-count {
  background: #22c55e;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

.panneau-filtres {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 16px;
  align-items: end;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 20px;
}

.filtre-champ {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filtre-champ label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
}

.filtre-champ input,
.select-wrap select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  outline: none;
  font-family: inherit;
  background: #f9fafb;
}

.filtre-champ input:focus,
.select-wrap select:focus {
  border-color: #22c55e;
  background: #fff;
}

.select-wrap {
  position: relative;
}

.select-wrap select {
  appearance: none;
  cursor: pointer;
  padding-right: 34px;
}

.select-wrap svg {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  stroke: #9ca3af;
  pointer-events: none;
}

.btn-reset {
  background: #fff;
  border: 1px solid #e5e7eb;
  color: #475569;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  height: 40px;
}

.btn-reset:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.category-pills {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.pill {
  background-color: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  padding: 9px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.pill:hover {
  border-color: #d1d5db;
  background-color: #f9fafb;
}

.pill.active {
  background-color: #1f2937;
  border-color: #1f2937;
  color: #ffffff;
}

@media (max-width: 768px) {
  .filtre-search-row {
    flex-direction: row;
  }

  .btn-filtres-label {
    display: none;
  }

  .btn-filtres-avances {
    padding: 13px 15px;
  }

  .panneau-filtres {
    grid-template-columns: 1fr 1fr;
  }

  .btn-reset {
    grid-column: 1 / -1;
  }

  .category-pills {
    gap: 8px;
  }

  .pill {
    padding: 8px 16px;
    font-size: 13px;
  }
}

@media (max-width: 460px) {
  .panneau-filtres {
    grid-template-columns: 1fr;
  }
}
</style>
