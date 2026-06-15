<template>
  <div class="landing">
    <HeaderLocataire v-if="authStore.isAuthenticated && authStore.user?.role === 'LOCATAIRE'" />
    <HeaderPublic v-else />

    <!-- ══════ HERO ══════ -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">🇸🇳 Plateforme sénégalaise</div>
          <h1 class="hero-title">Trouvez votre logement à Dakar</h1>
          <p class="hero-subtitle">
            NEKASO simplifie la location immobilière au Sénégal. Chambres, studios, appartements et
            villas — dans les meilleurs quartiers de Dakar.
          </p>

          <!-- SEARCH BAR -->
          <div class="search-bar">
            <div class="search-input-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Rechercher par quartier (Plateau, Almadies...)"
                v-model="searchQuery"
                @keyup.enter="handleSearch"
              />
            </div>
            <button class="btn-search" @click="handleSearch">Rechercher</button>
          </div>

          <!-- QUARTIERS -->
          <div class="popular-locations">
            <button
              v-for="quartier in quartiers"
              :key="quartier"
              class="location-tag"
              @click="searchByQuartier(quartier)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {{ quartier }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════ FEATURES ══════ -->
    <section class="features">
      <div class="container">
        <div class="features-grid">
          <!-- Biens vérifiés -->
          <div class="feature-card">
            <div class="feature-icon feature-icon--blue">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <h3 class="feature-title">Biens vérifiés</h3>
            <p class="feature-desc">Chaque annonce est validée par nos gestionnaires locaux.</p>
          </div>

          <!-- Paiements validés -->
          <div class="feature-card">
            <div class="feature-icon feature-icon--green">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <h3 class="feature-title">Paiements validés</h3>
            <p class="feature-desc">Orange Money, Wave ou espèces — historique toujours à jour.</p>
          </div>

          <!-- Support WhatsApp -->
          <div class="feature-card">
            <div class="feature-icon feature-icon--amber">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                ></path>
              </svg>
            </div>
            <h3 class="feature-title">Support WhatsApp</h3>
            <p class="feature-desc">Inscription et contact rapide via WhatsApp en +221.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════ BIENS EN VEDETTE ══════ -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Biens en vedette</h2>
            <p class="section-subtitle">Sélection de logements disponibles à Dakar</p>
          </div>
          <router-link to="/catalogue" class="link-voir-tout"> Voir tout → </router-link>
        </div>

        <div v-if="biensStore.chargement" class="empty-state">
          <ChargementSpinner message="Chargement des biens..." />
        </div>
        <div v-else-if="biensStore.biensEnVedette.length > 0" class="properties-grid">
          <CarteBienPublic v-for="bien in biensStore.biensEnVedette" :key="bien.id" :bien="bien" />
        </div>
        <div v-else class="empty-state">
          <p style="color:#9ca3af;font-size:14px">Aucun bien disponible pour le moment.</p>
        </div>
      </div>
    </section>

    <!-- ══════ FOOTER ══════ -->
    <footer class="footer">
      <div class="container footer-inner">
        <p class="footer-left">© 2026 NEKASO — Dakar, Sénégal</p>
        <p class="footer-right">Location immobilière simplifiée</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBiensPublicsStore } from '@/stores/biensPublics.store'
import { useAuthStore } from '@/stores/auth.store'
import HeaderPublic from '@/components/layout/HeaderPublic.vue'
import HeaderLocataire from '@/components/layout/HeaderLocataire.vue'
import CarteBienPublic from '@/components/locataire/CarteBienPublic.vue'
import ChargementSpinner from '@/components/biens/common/ChargementSpinner.vue'

const router = useRouter()
const biensStore = useBiensPublicsStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const quartiers = ['Plateau', 'Almadies', 'Mermoz', 'Ngor', 'Yoff', 'Sacré-Cœur']
onMounted(async () => {
  await biensStore.chargerBiens({ page: 0, size: 20 })
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/catalogue', query: { q: searchQuery.value.trim() } })
  } else {
    router.push('/catalogue')
  }
}

const searchByQuartier = (quartier) => {
  router.push({ path: '/catalogue', query: { quartier } })
}
</script>

<style scoped>
.landing {
  min-height: 100vh;
  background-color: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ══════ HERO ══════ */
.hero {
  background: linear-gradient(160deg, #1a2e4a 0%, #1e3a5f 40%, #234a6e 100%);
  color: #ffffff;
  padding: 72px 0 88px;
}

.hero-content {
  max-width: 580px;
}

.hero-badge {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  padding: 7px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 28px;
  backdrop-filter: blur(4px);
}

.hero-title {
  font-size: 44px;
  font-weight: 700;
  margin-bottom: 18px;
  line-height: 1.12;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: 16px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 36px;
}

/* ── Search Bar ── */
.search-bar {
  display: flex;
  gap: 0;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
}

.search-input-wrapper svg {
  stroke: #9ca3af;
  flex-shrink: 0;
}

.search-input-wrapper input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #111827;
  font-family: inherit;
  background: transparent;
}

.search-input-wrapper input::placeholder {
  color: #9ca3af;
}

.btn-search {
  background-color: #22c55e;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 14px 28px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  font-family: inherit;
}

.btn-search:hover {
  background-color: #16a34a;
}

/* ── Quartiers ── */
.popular-locations {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.location-tag {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 24px;
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: inherit;
}

.location-tag:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

/* ══════ FEATURES ══════ */
.features {
  padding: 72px 0;
  background-color: #f9fafb;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 28px 24px;
  border: 1px solid #f3f4f6;
  transition: box-shadow 0.25s;
}

.feature-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}

.feature-icon--blue {
  background-color: #dbeafe;
}

.feature-icon--blue svg {
  stroke: #3b82f6;
}

.feature-icon--green {
  background-color: #d1fae5;
}

.feature-icon--green svg {
  stroke: #22c55e;
}

.feature-icon--amber {
  background-color: #fef3c7;
}

.feature-icon--amber svg {
  stroke: #f59e0b;
}

.feature-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.feature-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.55;
}

/* ══════ BIENS EN VEDETTE ══════ */
.featured-section {
  padding: 72px 0 80px;
  background-color: #ffffff;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 36px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.section-subtitle {
  font-size: 14px;
  color: #6b7280;
}

.link-voir-tout {
  color: #111827;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  white-space: nowrap;
  margin-top: 4px;
  transition: color 0.2s;
}

.link-voir-tout:hover {
  color: #22c55e;
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

/* ══════ FOOTER ══════ */
.footer {
  background-color: #1f2937;
  color: #ffffff;
  padding: 32px 0;
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-left {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.footer-right {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.55);
}

/* ══════ RESPONSIVE ══════ */
@media (max-width: 1024px) {
  .properties-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 56px 0 64px;
  }

  .hero-title {
    font-size: 32px;
  }

  .search-bar {
    flex-direction: column;
    gap: 8px;
  }

  .btn-search {
    width: 100%;
    text-align: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .properties-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 12px;
  }

  .footer-inner {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>
