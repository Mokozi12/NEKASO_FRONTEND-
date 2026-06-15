<template>
  <div class="carte-bien-public" @click="voirDetail">
    <!-- IMAGE + BADGES -->
    <div class="bien-image">
      <img :src="bien.photos?.[0]?.urlPhoto || bien.photos?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'" :alt="bien.titre" loading="lazy" />
      <div class="badges">
        <span class="badge-statut" :class="statutClass">{{ statutLabel }}</span>
        <span class="badge-type">{{ bien.typeBien || bien.type }}</span>
      </div>
    </div>

    <!-- CONTENU -->
    <div class="bien-content">
      <h3 class="bien-titre">{{ bien.libelle || bien.titre || bien.typeBien }}</h3>

      <div class="bien-localisation">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        {{ typeof bien.adresse === 'string' ? bien.adresse : (bien.adresse?.quartier ? `${bien.adresse.quartier}, ${bien.adresse.ville || 'Dakar'}` : 'Dakar') }}
      </div>

      <!-- SPECS -->
      <div class="bien-specs">
        <div class="spec-item" v-if="bien.nombrePieces || bien.caracteristiques?.nombreChambres">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 4v16"/>
            <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
            <path d="M2 17h20"/>
            <path d="M6 8v9"/>
          </svg>
          {{ bien.nombrePieces || bien.caracteristiques?.nombreChambres }} pièces
        </div>
        <div class="spec-item" v-if="bien.surface || bien.caracteristiques?.surface">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="21 8 21 21 8 21"/>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          </svg>
          {{ bien.surface || bien.caracteristiques?.surface }} m²
        </div>
      </div>

      <!-- PRIX -->
      <div class="bien-footer">
        <span class="prix">{{ formatMontant(bien.loyer) }}</span>
        <span class="periode">/mois</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  bien: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const statutClass = computed(() => {
  const s = (props.bien.statutBien || props.bien.statut)?.toLowerCase()
  return {
    'statut-disponible': s === 'disponible',
    'statut-loue': s === 'loue',
    'statut-reserve': s === 'reserve'
  }
})

const statutLabel = computed(() => {
  const labels = { 'disponible': 'Disponible', 'loue': 'Loué', 'reserve': 'Réservé' }
  const s = (props.bien.statutBien || props.bien.statut)?.toLowerCase()
  return labels[s] || props.bien.statutBien || props.bien.statut
})

const formatMontant = (montant) => {
  if (!montant) return '—'
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(montant) + ' FCFA'
}

const voirDetail = () => {
  router.push(`/biens/${props.bien.id}`)
}
</script>

<style scoped>
.carte-bien-public {
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.carte-bien-public:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-3px);
}

/* ── IMAGE ── */
.bien-image {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background-color: #e5e7eb;
}

.bien-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.carte-bien-public:hover .bien-image img {
  transform: scale(1.04);
}

/* ── BADGES ── */
.badges {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  pointer-events: none;
}

.badge-statut {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.badge-statut.statut-disponible {
  background-color: #22c55e;
  color: #ffffff;
}

.badge-statut.statut-loue {
  background-color: #ef4444;
  color: #ffffff;
}

.badge-statut.statut-reserve {
  background-color: #f59e0b;
  color: #ffffff;
}

.badge-type {
  background-color: #1f2937;
  color: #ffffff;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

/* ── CONTENU ── */
.bien-content {
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.bien-titre {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.bien-localisation {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 14px;
}

.bien-localisation svg {
  stroke: #9ca3af;
  flex-shrink: 0;
}

/* ── SPECS ── */
.bien-specs {
  display: flex;
  gap: 14px;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f3f4f6;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.spec-item svg {
  stroke: #9ca3af;
  flex-shrink: 0;
}

/* ── FOOTER / PRIX ── */
.bien-footer {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: auto;
}

.prix {
  font-size: 17px;
  font-weight: 700;
  color: #111827;
}

.periode {
  font-size: 13px;
  color: #6b7280;
  font-weight: 400;
  font-style: italic;
}
</style>
