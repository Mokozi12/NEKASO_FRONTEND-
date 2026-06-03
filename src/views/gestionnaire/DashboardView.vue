<template>
  <section class="dashboard">
    <div v-if="alertePrincipale" class="dashboard__alerte" role="alert">
      <AppIcon name="alert" :size="18" />
      <span>{{ alertePrincipale }}</span>
    </div>

    <div class="dashboard__toolbar">
      <p class="dashboard__intro">Vue d'ensemble de votre activité locative</p>
      <div class="dashboard__actions">
        <button type="button" class="btn-outline btn-outline--badge" @click="$router.push({ name: 'demandes-location' })">
          <AppIcon name="inbox" :size="16" />
          Demandes de location
          <span class="btn-badge">1</span>
        </button>
        <button type="button" class="btn-outline">
          <AppIcon name="plus" :size="16" />
          Bien
        </button>
        <button type="button" class="btn-outline">
          <AppIcon name="plus" :size="16" />
          Visite
        </button>
        <button type="button" class="btn-primary-dash">
          <AppIcon name="plus" :size="16" />
          Nouveau contrat
        </button>
      </div>
    </div>

    <div v-if="chargement" class="dashboard__loading">Chargement…</div>

    <template v-else>
      <div class="dashboard__kpis">
        <StatCard
          variant="primary"
          icon="wallet"
          label="Revenus ce mois"
          :value="`${statsFormatees?.revenusMois ?? '0'} FCFA`"
          subtitle="vs mois dernier"
          :badge="variationRevenus ? formatVariation(variationRevenus) : ''"
          :trend="trendRevenus"
        />
        <StatCard
          icon="building"
          label="Taux d'occupation"
          :value="`${tauxOccupation}%`"
          :subtitle="`${dashboardStore.biensLoues}/${dashboardStore.totalBiens} biens loués`"
          :badge="variationOccupation ? formatVariation(variationOccupation) : ''"
          :trend="trendOccupation"
        />
        <StatCard
          icon="alert"
          label="Loyers en retard"
          :value="`${statsFormatees?.montantLoyersEnRetard ?? '0'} FCFA`"
          :subtitle="`${dashboardStore.loyersEnRetard} locataire(s)`"
          :badge="variationLoyersRetard ? formatVariation(variationLoyersRetard) : ''"
          :trend="trendRetard"
        />
      </div>

      <div class="dashboard__charts">
        <article class="chart-panel chart-panel--large">
          <header class="chart-panel__head">
            <div>
              <h2>Chiffre d'affaires locatif</h2>
              <p>Évolution sur les 6 derniers mois</p>
            </div>
            <select class="chart-panel__select" aria-label="Période">
              <option>Cette année</option>
            </select>
          </header>
          <div class="chart-panel__legend">
            <span><i class="dot dot--navy"></i> Encaissé</span>
            <span><i class="dot dot--green"></i> Année précédent</span>
          </div>
          <div class="chart-panel__canvas">
            <Bar
              v-if="donneesGraphiqueBarres"
              :data="donneesGraphiqueBarres"
              :options="barOptions"
            />
          </div>
        </article>

        <article class="chart-panel">
          <header class="chart-panel__head">
            <div>
              <h2>Portefeuille</h2>
              <p>Répartition par type</p>
            </div>
            <select class="chart-panel__select" aria-label="Filtre portefeuille">
              <option>Aujourd'hui</option>
            </select>
          </header>
          <div class="chart-panel__donut-wrap">
            <div class="chart-panel__donut">
              <Doughnut
                v-if="donneesGraphiqueDonut"
                :data="donneesGraphiqueDonut"
                :options="donutOptions"
                :plugins="[centerTextPlugin]"
              />
            </div>
            <ul class="portefeuille-legend">
              <li v-for="item in dashboardStore.portefeuille" :key="item.type">
                <span class="portefeuille-legend__dot" :style="{ background: item.color }"></span>
                <span class="portefeuille-legend__type">{{ item.type }}</span>
                <span class="portefeuille-legend__count">{{ item.count }}</span>
                <span class="portefeuille-legend__pct">{{ item.percent }}%</span>
              </li>
            </ul>
          </div>
        </article>
      </div>

      <div class="dashboard__lists">
        <article class="list-panel">
          <header class="list-panel__head">
            <AppIcon name="users" :size="18" />
            <h3>Loyers en retard</h3>
          </header>
          <ul v-if="dashboardStore.loyersEnRetardListe.length" class="list-panel__items">
            <li
              v-for="loyer in dashboardStore.loyersEnRetardListe"
              :key="loyer.id"
              class="list-panel__item"
            >
              <div class="list-panel__item-icon list-panel__item-icon--danger">
                <AppIcon name="dollar" :size="16" />
              </div>
              <div class="list-panel__item-body">
                <strong>{{ loyer.locataire }}</strong>
                <span>Échéance: {{ loyer.echeance }} — {{ formatMontant(loyer.montant) }} FCFA</span>
              </div>
              <button type="button" class="btn-relancer">Relancer</button>
            </li>
          </ul>
          <p v-else class="list-panel__vide">Aucun loyer en retard</p>
        </article>

        <article class="list-panel">
          <header class="list-panel__head">
            <AppIcon name="calendar" :size="18" />
            <h3>Visites en attente</h3>
          </header>
          <ul v-if="dashboardStore.visitesEnAttenteListe.length" class="list-panel__items">
            <li
              v-for="visite in dashboardStore.visitesEnAttenteListe"
              :key="visite.id"
              class="list-panel__item"
            >
              <div class="list-panel__item-body list-panel__item-body--full">
                <strong>{{ visite.nom }}</strong>
                <span>{{ visite.bien }} — {{ visite.dateHeure }}</span>
              </div>
              <span class="badge-attente">En attente</span>
            </li>
          </ul>
          <p v-else class="list-panel__vide">Aucune visite en attente</p>
        </article>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from 'chart.js'
import { useDashboard } from '@/composables/useDashboard'
import { useFormat } from '@/composables/useFormat'
import { centerTextPlugin } from '@/utils/chartCenterText'
import StatCard from '@/components/dashboard/StatCard.vue'
import AppIcon from '@/components/icons/AppIcon.vue'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
)

const {
  dashboardStore,
  chargement,
  statsFormatees,
  alertePrincipale,
  donneesGraphiqueBarres,
  donneesGraphiqueDonut,
  totalPortefeuille,
  formatVariation,
  tauxOccupation,
  variationRevenus,
  variationOccupation,
  variationLoyersRetard,
  trendRevenus,
  trendOccupation,
  trendRetard,
} = useDashboard()

const { formatMontant } = useFormat()

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) =>
          `${ctx.dataset.label}: ${Number(ctx.raw).toLocaleString('fr-FR')} FCFA`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#6b7280', font: { size: 12 } },
    },
    y: {
      grid: { color: '#f3f4f6' },
      ticks: {
        color: '#6b7280',
        callback: (val) => `${Math.round(val / 1000)}k`,
        maxTicksLimit: 6,
      },
      suggestedMax: 2400000,
    },
  },
}

const donutOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: { display: false },
    centerText: {
      text: String(totalPortefeuille.value),
    },
  },
}))
</script>

<style scoped>
.dashboard {
  max-width: 1280px;
}

.dashboard__alerte {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  margin-bottom: 20px;
  background: var(--couleur-alerte-fond);
  color: var(--couleur-alerte-texte);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
}

.dashboard__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}

.dashboard__intro {
  font-size: 14px;
  color: var(--texte-secondaire);
  margin: 0;
}

.dashboard__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-outline,
.btn-primary-dash {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s;
}

.btn-outline {
  background: #fff;
  border: 1px solid var(--bordure);
  color: var(--texte-principal);
}

.btn-outline:hover {
  background: var(--fond-general);
}

.btn-outline--badge {
  position: relative;
}

.btn-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: var(--couleur-danger);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  margin-left: 2px;
}

.btn-primary-dash {
  background: var(--couleur-primaire);
  border: none;
  color: #fff;
}

.btn-primary-dash:hover {
  opacity: 0.92;
}

.dashboard__loading {
  padding: 48px;
  text-align: center;
  color: var(--texte-secondaire);
}

.dashboard__kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 22px;
}

.dashboard__charts {
  display: grid;
  grid-template-columns: 1.65fr 1fr;
  gap: 18px;
  margin-bottom: 22px;
}

.chart-panel {
  background: var(--fond-carte);
  border-radius: 14px;
  padding: 20px 22px;
  box-shadow: var(--ombre-carte);
}

.chart-panel__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.chart-panel__head h2 {
  font-size: 15px;
  font-weight: 700;
  color: var(--couleur-primaire);
  margin: 0 0 2px;
}

.chart-panel__head p {
  font-size: 12px;
  color: var(--texte-secondaire);
  margin: 0;
}

.chart-panel__select {
  font-size: 12px;
  padding: 6px 10px;
  border: 1px solid var(--bordure);
  border-radius: 8px;
  color: var(--texte-principal);
  background: #fff;
}

.chart-panel__legend {
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: var(--texte-secondaire);
  margin-bottom: 8px;
}

.chart-panel__legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  display: inline-block;
}

.dot--navy {
  background: var(--couleur-primaire);
}

.dot--green {
  background: var(--couleur-succes-clair);
}

.chart-panel__canvas {
  height: 280px;
}

.chart-panel__donut-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.chart-panel__donut {
  width: 200px;
  height: 200px;
}

.portefeuille-legend {
  list-style: none;
  width: 100%;
  padding: 0;
  margin: 0;
}

.portefeuille-legend li {
  display: grid;
  grid-template-columns: 12px 1fr auto auto;
  gap: 8px 12px;
  align-items: center;
  padding: 6px 0;
  font-size: 13px;
  border-bottom: 1px solid #f3f4f6;
}

.portefeuille-legend li:last-child {
  border-bottom: none;
}

.portefeuille-legend__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.portefeuille-legend__type {
  color: var(--texte-principal);
}

.portefeuille-legend__count {
  font-weight: 600;
  color: var(--couleur-primaire);
}

.portefeuille-legend__pct {
  color: var(--texte-secondaire);
  font-size: 12px;
}

.dashboard__lists {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.list-panel {
  background: var(--fond-carte);
  border-radius: 14px;
  padding: 20px 22px;
  box-shadow: var(--ombre-carte);
}

.list-panel__head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  color: var(--couleur-primaire);
}

.list-panel__head h3 {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}

.list-panel__items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-panel__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-top: 1px solid #f3f4f6;
}

.list-panel__item:first-child {
  border-top: none;
  padding-top: 0;
}

.list-panel__item-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.list-panel__item-icon--danger {
  background: #fee2e2;
  color: var(--couleur-danger);
  border-radius: 50%;
}

.list-panel__item-icon--danger :deep(.app-icon--img) {
  filter: none;
  opacity: 1;
}

.list-panel__vide {
  font-size: 13px;
  color: var(--texte-secondaire);
  margin: 0;
  padding: 8px 0;
}

.list-panel__item-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.list-panel__item-body--full {
  flex: 1;
}

.list-panel__item-body strong {
  font-size: 14px;
  color: var(--texte-principal);
}

.list-panel__item-body span {
  font-size: 12px;
  color: var(--texte-secondaire);
}

.btn-relancer {
  padding: 8px 14px;
  background: var(--couleur-primaire);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
}

.badge-attente {
  font-size: 11px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 20px;
  background: #f3f4f6;
  color: var(--texte-secondaire);
  white-space: nowrap;
}

@media (max-width: 1100px) {
  .dashboard__kpis,
  .dashboard__charts,
  .dashboard__lists {
    grid-template-columns: 1fr;
  }
}
</style>
