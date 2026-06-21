<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Mes Pré-contrats</h1>
        <p class="page-subtitle">Consultez, validez ou refusez les pré-contrats proposés suite à vos visites.</p>
      </div>

      <template v-if="preContrats.length">
        <router-link
          v-for="c in itemsPage"
          :key="c.id"
          :to="`/locataire/contrat/${c.id}`"
          class="carte"
        >
          <img :src="photo(c.bien)" :alt="c.bien?.intitule" class="vignette" />
          <div class="infos">
            <div class="en-tete">
              <span class="numero">{{ c.numero || 'Nouveau pré-contrat' }}</span>
              <BadgeStatut label="À valider" variant="amber" />
            </div>
            <h3 class="titre">{{ c.bien?.intitule }}</h3>
            <p class="adresse">{{ c.bien?.adresse }}</p>
            <div class="details">
              <span>Loyer: <strong>{{ formatMontant(c.montantLoyer) }} FCFA</strong></span>
              <span class="sep">•</span>
              <span>Caution: <strong>{{ formatMontant(c.montantCaution) }} FCFA</strong></span>
            </div>
          </div>
          <div class="droite">
            <span class="lien">Consulter pour valider →</span>
          </div>
        </router-link>
        <Pagination v-model="page" :total-pages="totalPages" />
      </template>

      <div v-else class="etat-vide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icone-vide"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
        <p>Aucun pré-contrat en attente de validation.</p>
        <router-link to="/locataire/biens" class="btn-primaire">Parcourir les biens</router-link>
      </div>
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
const { formatMontant } = useFormat()

onMounted(() => {
  contratsStore.chargerLocataire()
})

const preContrats = computed(() => contratsStore.mesPreContratsAValider)
const { page, totalPages, itemsPage } = usePagination(preContrats, 10)

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
  margin-top: 4px;
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
.en-tete {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}
.numero {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.titre {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2px;
}
.adresse {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
}
.details {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #475569;
}
.details strong {
  color: #1e293b;
}
.sep {
  color: #cbd5e1;
}
.droite {
  text-align: right;
  flex-shrink: 0;
}
.lien {
  display: inline-block;
  font-size: 14.5px;
  font-weight: 700;
  color: #1e293b;
  background: #f1f5f9;
  padding: 10px 16px;
  border-radius: 9px;
  transition: background 0.15s;
}
.carte:hover .lien {
  background: #e2e8f0;
}
.etat-vide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px 0;
  color: #94a3b8;
  background: #fff;
  border-radius: 16px;
  border: 1px dashed #cbd5e1;
}
.icone-vide {
  width: 48px;
  height: 48px;
  color: #cbd5e1;
}
.btn-primaire {
  background: #1e293b;
  color: #fff;
  text-decoration: none;
  padding: 11px 22px;
  border-radius: 9px;
  font-weight: 600;
  margin-top: 8px;
}
@media (max-width: 720px) {
  .carte {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .vignette {
    width: 100%;
    height: 180px;
  }
  .droite {
    width: 100%;
    text-align: left;
  }
  .lien {
    display: block;
    text-align: center;
  }
}
</style>
