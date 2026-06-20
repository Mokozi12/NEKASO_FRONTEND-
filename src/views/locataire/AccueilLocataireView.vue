<template>
  <div class="accueil">
    
    <section class="hero">
      <div class="container">
        <p class="hello">Bonjour,</p>
        <h1 class="prenom">{{ prenom }}</h1>
        <p class="hero-sub">Suivez vos demandes et explorez de nouveaux biens disponibles à Dakar.</p>
      </div>
    </section>

    <div class="container">
      
      <div class="stats">
        <router-link to="/locataire/mes-locations" class="stat">
          <span class="stat-ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          </span>
          <span class="stat-body">
            <span class="stat-lbl">Mes locations</span>
            <span class="stat-val">{{ nbLocations }} {{ nbLocations > 1 ? 'actives' : 'active' }}</span>
          </span>
          <span class="stat-arrow">→</span>
        </router-link>

        <router-link to="/locataire/mes-demandes-visites" class="stat">
          <span class="stat-ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          </span>
          <span class="stat-body">
            <span class="stat-lbl">Demandes de visite</span>
            <span class="stat-val">{{ nbVisites }}</span>
          </span>
          <span class="stat-arrow">→</span>
        </router-link>

        <router-link to="/locataire/mes-demandes-locations" class="stat">
          <span class="stat-ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6a2 2 0 0 1 2 2H7a2 2 0 0 1 2-2z" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /></svg>
          </span>
          <span class="stat-body">
            <span class="stat-lbl">Demandes de location</span>
            <span class="stat-val">{{ nbDemandes }}</span>
          </span>
          <span class="stat-arrow">→</span>
        </router-link>
      </div>

<router-link
        v-if="preContratAValider"
        :to="`/locataire/contrat/${preContratAValider.id}`"
        class="banniere-precontrat"
      >
        <span class="bp-ic">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
        </span>
        <span class="bp-text">
          <strong>Un pré-contrat vous attend</strong>
          <span>{{ preContratAValider.bien?.intitule }} — à relire et valider.</span>
        </span>
        <span class="bp-cta">Valider →</span>
      </router-link>

<section class="decouvrir">
        <div class="sec-head">
          <div>
            <h2 class="sec-titre">Découvrir de nouveaux biens</h2>
            <p class="sec-sub">Sélection disponible cette semaine</p>
          </div>
          <router-link to="/locataire/biens" class="voir-tout">Voir tout →</router-link>
        </div>

        <div v-if="biensDispo.length" class="grille">
          <CarteBienPublic v-for="b in biensDispo" :key="b.id" :bien="b" />
        </div>
        <p v-else class="vide">Aucun bien disponible pour le moment.</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useContratsStore } from '@/stores/contrats.store'
import { useVisitesStore } from '@/stores/visites.store'
import { useDemandesLocationStore } from '@/stores/demandesLocation.store'
import { useBiensPublicsStore } from '@/stores/biensPublics.store'
import { useAuthStore } from '@/stores/auth.store'
import CarteBienPublic from '@/components/locataire/CarteBienPublic.vue'

const contratsStore = useContratsStore()
const visitesStore = useVisitesStore()
const demandesStore = useDemandesLocationStore()
const biensStore = useBiensPublicsStore()
const authStore = useAuthStore()

const prenom = computed(() => {
  if (authStore.user?.prenom) return authStore.user.prenom
  if (authStore.user?.nom) return authStore.user.nom
  if (authStore.nomComplet) return authStore.nomComplet
  if (authStore.user?.telephone) return authStore.user.telephone
  return 'Locataire'
})

const nbLocations = computed(() => contratsStore.mesContratsActifs.length)
const nbVisites = computed(() => visitesStore.mesVisites.length)
const nbDemandes = computed(() => demandesStore.mesDemandes.length)

const preContratAValider = computed(() => contratsStore.mesPreContratsAValider[0] || null)

onMounted(() => {
  if (!biensStore.biens.length) biensStore.chargerBiens({ page: 0, size: 20 })
})
const biensDispo = computed(() => biensStore.biensDisponibles.slice(0, 3))
</script>

<style scoped>
.accueil {
  background: #f4f6fa;
  min-height: calc(100vh - 70px);
  padding-bottom: 72px;
}
.container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero {
  background: #1e293b;
  color: #fff;
  padding: 46px 0 78px;
}
.hello {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.75);
  font-style: italic;
}
.prenom {
  font-size: 46px;
  font-weight: 700;
  line-height: 1.1;
  margin: 2px 0 14px;
}
.hero-sub {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.78);
  max-width: 520px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: -46px;
}
.stat {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  transition: transform 0.18s, box-shadow 0.18s;
}
.stat:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
}
.stat-ic {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eef2f9;
  color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-ic svg {
  width: 21px;
  height: 21px;
}
.stat-body {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.stat-lbl {
  font-size: 13px;
  color: #64748b;
}
.stat-val {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}
.stat-arrow {
  color: #cbd5e1;
  font-size: 18px;
}

.banniere-precontrat {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding: 18px 22px;
  border-radius: 14px;
  background: linear-gradient(100deg, #ecfdf3 0%, #f0fdf4 100%);
  border: 1px solid #bbf7d0;
  text-decoration: none;
  transition: box-shadow 0.18s;
}
.banniere-precontrat:hover {
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.15);
}
.bp-ic {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: #22c55e;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.bp-ic svg {
  width: 20px;
  height: 20px;
}
.bp-text {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.bp-text strong {
  font-size: 15px;
  color: #14532d;
}
.bp-text span {
  font-size: 13.5px;
  color: #16a34a;
}
.bp-cta {
  font-size: 14px;
  font-weight: 700;
  color: #15803d;
  white-space: nowrap;
}

.decouvrir {
  margin-top: 44px;
}
.sec-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 22px;
}
.sec-titre {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}
.sec-sub {
  font-size: 14px;
  color: #64748b;
  margin-top: 2px;
}
.voir-tout {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  text-decoration: none;
  white-space: nowrap;
}
.voir-tout:hover {
  color: #22c55e;
}
.grille {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}
.vide {
  color: #94a3b8;
  font-size: 14px;
  padding: 40px 0;
  text-align: center;
}

@media (max-width: 900px) {
  .stats {
    grid-template-columns: 1fr;
    margin-top: -36px;
  }
  .grille {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .prenom {
    font-size: 36px;
  }
  .grille {
    grid-template-columns: 1fr;
  }
  .sec-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
