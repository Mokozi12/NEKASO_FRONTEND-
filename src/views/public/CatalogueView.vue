<template>
  <div class="catalogue">
    <template v-if="!$route.meta.sansEntete">
      <HeaderLocataire v-if="authStore.isAuthenticated && authStore.user?.role === 'LOCATAIRE'" />
      <HeaderPublic v-else />
    </template>

    <div class="catalogue-content">
      <div class="container">
        
        <template v-if="authStore.isAuthenticated && authStore.user?.role === 'LOCATAIRE'">
          <div class="bienvenue">
            <h2 class="bienvenue-titre">Bonjour, trouvez votre prochain logement à Dakar</h2>
            <p class="bienvenue-sous">
              Parcourez nos biens disponibles et faites une demande en quelques clics.
            </p>
          </div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon-wrapper orange">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d97706"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-label">Visites en attente</div>
                <div class="stat-value">2</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon-wrapper blue">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563eb"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-label">Demandes de location</div>
                <div class="stat-value">1</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon-wrapper green">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16a34a"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-label">Location active</div>
                <div class="stat-value">1</div>
              </div>
            </div>
          </div>
        </template>

        
        <div class="catalogue-header">
          <h1 class="page-title">Biens à louer à Dakar</h1>
          <p class="page-subtitle">{{ filteredBiens.length }} logement(s) trouvé(s)</p>
        </div>

        
        <FiltreCatalogue
          v-model:recherche="searchQuery"
          v-model:type-actif="selectedType"
          v-model:loyer-min="loyerMin"
          v-model:loyer-max="loyerMax"
          v-model:pieces-min="piecesMin"
        />

        
        <div class="biens-grid" v-if="!biensStore.chargement && biensPagines.length > 0">
          <CarteBienPublic v-for="bien in biensPagines" :key="bien.id" :bien="bien" />
        </div>

        
        <div v-else-if="biensStore.chargement" class="empty-state">
          <ChargementSpinner message="Chargement des biens..." />
        </div>

        
        <div v-else class="empty-state">
          <MessageVide
            icone="🏠"
            titre="Aucun bien trouvé"
            message="Essayez de modifier vos critères de recherche."
          />
        </div>

        
        <div v-if="totalPages > 1" class="pagination">
          <button class="page-btn" :disabled="pageActuelle === 1" @click="pageActuelle--">
            Précédent
          </button>

          <button
            v-for="p in totalPages"
            :key="p"
            class="page-btn"
            :class="{ 'page-btn--active': p === pageActuelle }"
            @click="pageActuelle = p"
          >
            {{ p }}
          </button>

          <button class="page-btn" :disabled="pageActuelle === totalPages" @click="pageActuelle++">
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBiensPublicsStore } from '@/stores/biensPublics.store'
import { useAuthStore } from '@/stores/auth.store'
import HeaderPublic from '@/components/layout/HeaderPublic.vue'
import HeaderLocataire from '@/components/layout/HeaderLocataire.vue'
import CarteBienPublic from '@/components/locataire/CarteBienPublic.vue'
import FiltreCatalogue from '@/components/locataire/FiltreCatalogue.vue'
import MessageVide from '@/components/biens/common/MessageVide.vue'
import ChargementSpinner from '@/components/biens/common/ChargementSpinner.vue'

const route = useRoute()
const biensStore = useBiensPublicsStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const selectedType = ref(null)
const loyerMin = ref(null)
const loyerMax = ref(null)
const piecesMin = ref(null)
const pageActuelle = ref(1)

const largeurEcran = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)
const parPage = computed(() => (largeurEcran.value <= 768 ? 5 : 9))
function onResize() {
  largeurEcran.value = window.innerWidth
}

onMounted(async () => {
  window.addEventListener('resize', onResize)
  await biensStore.chargerBiens({ page: 0, size: 10 })
  if (route.query.q) searchQuery.value = route.query.q
  if (route.query.quartier) searchQuery.value = route.query.quartier
})
onUnmounted(() => window.removeEventListener('resize', onResize))

const filteredBiens = computed(() => {
  let result = [...biensStore.biens]
  if (selectedType.value) {
    result = result.filter((b) => (b.typeBien || b.type)?.toLowerCase() === selectedType.value.toLowerCase())
  }
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (b) =>
        b.titre?.toLowerCase().includes(query) ||
        (typeof b.adresse === 'string' ? b.adresse.toLowerCase().includes(query) : (b.adresse?.quartier?.toLowerCase().includes(query) || b.adresse?.ville?.toLowerCase().includes(query))) ||
        b.libelle?.toLowerCase().includes(query) ||
        b.typeBien?.toLowerCase().includes(query) ||
        b.type?.toLowerCase().includes(query),
    )
  }
  if (loyerMin.value != null) {
    result = result.filter((b) => Number(b.loyer) >= loyerMin.value)
  }
  if (loyerMax.value != null) {
    result = result.filter((b) => Number(b.loyer) <= loyerMax.value)
  }
  if (piecesMin.value != null) {
    result = result.filter(
      (b) => Number(b.nombrePieces || b.caracteristiques?.nombreChambres || 0) >= piecesMin.value,
    )
  }
  return result
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredBiens.value.length / parPage.value)))

const biensPagines = computed(() => {
  const debut = (pageActuelle.value - 1) * parPage.value
  return filteredBiens.value.slice(debut, debut + parPage.value)
})

watch([searchQuery, selectedType, loyerMin, loyerMax, piecesMin, parPage], () => {
  pageActuelle.value = 1
})
</script>

<style scoped>
.catalogue {
  min-height: 100vh;
  background-color: #f9fafb;
}

.catalogue-content {
  padding: 40px 0 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}


.bienvenue {
  margin-bottom: 24px;
}

.bienvenue-titre {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px;
}

.bienvenue-sous {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}


.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 36px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrapper.orange {
  background-color: #fef3c7;
}
.stat-icon-wrapper.blue {
  background-color: #e0f2fe;
}
.stat-icon-wrapper.green {
  background-color: #dcfce7;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}


.catalogue-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 4px;
  letter-spacing: -0.3px;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
}


.biens-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 24px;
}

.empty-state {
  padding: 80px 20px;
  text-align: center;
}


.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.page-btn {
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 8px;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s;
  font-weight: 500;
}

.page-btn:hover:not(:disabled) {
  background: #f8fafc;
  color: #1e293b;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn--active {
  background: #1e293b;
  color: #fff;
  border-color: #1e293b;
  font-weight: 700;
}

@media (max-width: 1024px) {
  .biens-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .page-title {
    font-size: 20px;
  }
  .biens-grid {
    grid-template-columns: 1fr;
  }
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
