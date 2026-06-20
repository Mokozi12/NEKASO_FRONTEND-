<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Mes locations</h1>
        <p class="page-subtitle">Vos biens en location active</p>
      </div>

      <h2 class="section-titre">Mes locations actives</h2>

      <template v-if="contrats.length">
        <router-link
          v-for="c in itemsPage"
          :key="c.id"
          :to="`/locataire/contrat/${c.id}`"
          class="carte"
        >
          <img :src="photo(c.bien)" :alt="c.bien?.intitule" class="vignette" />
          <div class="infos">
            <h3 class="titre">{{ c.bien?.intitule }}</h3>
            <p class="adresse">{{ c.bien?.adresse }}</p>
            <div class="statut-ligne">
              <BadgeStatut label="Actif" variant="green" />
              <span class="echeance">Jusqu'au {{ formatDate(c.dateFin) }}</span>
            </div>
          </div>
          <div class="droite">
            <div class="prix">{{ formatMontant(c.montantLoyer) }} FCFA<span>/mois</span></div>
            <span class="lien">Voir contrat →</span>
          </div>
        </router-link>
      </template>

      <div v-else class="etat-vide">
        <p>Aucune location active pour le moment.</p>
        <router-link to="/locataire/biens" class="btn-primaire">Parcourir les biens disponibles</router-link>
      </div>

      <Pagination v-model="page" :total-pages="totalPages" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useContratsStore } from '@/stores/contrats.store'
import { useFormat } from '@/composables/useFormat'
import BadgeStatut from '@/components/locataire/BadgeStatut.vue'
import Pagination from '@/components/common/Pagination.vue'
import { usePagination } from '@/composables/usePagination'

const contratsStore = useContratsStore()
const { formatMontant, formatDate } = useFormat()

onMounted(() => {
  contratsStore.chargerLocataire()
})

const contrats = computed(() => contratsStore.mesContratsActifs)
const { page, totalPages, itemsPage } = usePagination(contrats, 5)
function photo(b) {
  return b?.photos?.[0]?.urlPhoto || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300'
}
</script>

<style scoped>
.page {
  padding: 40px 0 80px;
  background: #f4f6fa;
  min-height: calc(100vh - 70px);
}
.container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px;
}
.page-header {
  margin-bottom: 28px;
}
.page-title {
  font-size: 30px;
  font-weight: 700;
  color: #1e293b;
}
.page-subtitle {
  font-size: 15px;
  color: #64748b;
  margin-top: 2px;
}
.section-titre {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 18px;
}
.carte {
  display: flex;
  align-items: center;
  gap: 22px;
  background: #fff;
  border-radius: 16px;
  padding: 22px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
  margin-bottom: 16px;
  text-decoration: none;
  transition: box-shadow 0.18s, transform 0.18s;
}
.carte:hover {
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.09);
  transform: translateY(-2px);
}
.vignette {
  width: 130px;
  height: 92px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}
.infos {
  flex: 1;
  min-width: 0;
}
.titre {
  font-size: 19px;
  font-weight: 600;
  color: #1e293b;
}
.adresse {
  font-size: 14px;
  color: #64748b;
  margin: 4px 0 10px;
}
.statut-ligne {
  display: flex;
  align-items: center;
  gap: 12px;
}
.echeance {
  font-size: 13px;
  color: #64748b;
}
.droite {
  text-align: right;
  flex-shrink: 0;
}
.prix {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}
.prix span {
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;
}
.lien {
  display: inline-block;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}
.etat-vide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 70px 0;
  color: #94a3b8;
}
.btn-primaire {
  background: #1e293b;
  color: #fff;
  text-decoration: none;
  padding: 11px 22px;
  border-radius: 9px;
  font-weight: 600;
}
@media (max-width: 720px) {
  .carte {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .vignette {
    width: 100%;
    height: 170px;
  }
  .droite {
    text-align: left;
    width: 100%;
    border-top: 1px solid #f1f5f9;
    padding-top: 14px;
  }
}
</style>
