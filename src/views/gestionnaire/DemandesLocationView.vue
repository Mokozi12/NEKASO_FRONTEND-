<!--
  DemandesLocationView (gestionnaire) — §7, §8.

  Ce sont des DEMANDES de réservation (pas une réservation instantanée) :
  un même bien peut recevoir plusieurs demandes. On n'affiche donc PAS une liste
  plate mais la liste des BIENS ayant fait l'objet de demandes. Cliquer sur un
  bien ouvre le détail de toutes ses demandes (FIFO).
-->
<template>
  <div class="demandes-page">
    <div class="page-header">
      <h1 class="page-title">Demandes de location</h1>
      <p class="page-subtitle">
        Biens ayant reçu des demandes de réservation. Validez une demande par bien :
        les autres seront automatiquement annulées.
      </p>
    </div>

    <div v-if="groupes.length" class="biens-grid">
      <button
        v-for="g in groupesPage"
        :key="g.bien.id"
        class="carte bien-carte"
        @click="ouvrir(g.bien.id)"
      >
        <div class="bien-photo">
          <img :src="photo(g.bien)" :alt="g.bien.intitule" />
          <span v-if="g.validee" class="badge badge--ok">Attribué</span>
          <span v-else class="badge badge--attente">{{ g.nbEnAttente }} demande(s)</span>
        </div>
        <div class="bien-info">
          <h3 class="bien-titre">{{ g.bien.intitule }}</h3>
          <p class="bien-adresse">{{ g.bien.adresse }}</p>
          <p class="bien-loyer">{{ formatMontant(g.bien.loyer) }} FCFA / mois</p>
        </div>
        <div class="bien-foot">
          <span v-if="g.prioritaireId" class="prio">
            Prioritaire (FIFO) : {{ nomPrioritaire(g) }}
          </span>
          <span class="voir">Voir les demandes →</span>
        </div>
      </button>
    </div>
    <div v-else class="carte vide">Aucune demande de location pour le moment.</div>

    <Pagination v-model="page" :total-pages="totalPages" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDemandesLocationStore } from '@/stores/demandesLocation.store'
import { useFormat } from '@/composables/useFormat'
import { usePagination } from '@/composables/usePagination'
import { nomComplet } from '@/mocks/db'
import Pagination from '@/components/common/Pagination.vue'

const router = useRouter()
const store = useDemandesLocationStore()
const { formatMontant } = useFormat()

// On n'affiche que les biens ayant au moins une demande en attente ou attribuée.
const groupes = computed(() =>
  store.biensAvecDemandes.filter((g) => g.bien && (g.nbEnAttente > 0 || g.validee)),
)
const { page, totalPages, itemsPage: groupesPage } = usePagination(groupes, 9)

function photo(bien) {
  return bien.photos?.[0]?.urlPhoto || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'
}
function nomPrioritaire(g) {
  const d = g.demandesEnAttente[0]
  return d ? nomComplet(d.client) : '—'
}
function ouvrir(bienId) {
  router.push(`/gestionnaire/demandes-location/bien/${bienId}`)
}
</script>

<style scoped>
.demandes-page {
  padding: 0;
}
.biens-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.bien-carte {
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  border: none;
  font-family: inherit;
  transition: transform 0.15s, box-shadow 0.15s;
}
.bien-carte:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
}
.bien-photo {
  position: relative;
  height: 150px;
}
.bien-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}
.badge--attente {
  background: #212d4d;
  color: #fff;
}
.badge--ok {
  background: #00d15a;
  color: #fff;
}
.bien-info {
  padding: 16px 18px 8px;
}
.bien-titre {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}
.bien-adresse {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0;
}
.bien-loyer {
  font-size: 14px;
  font-weight: 600;
  color: #212d4d;
}
.bien-foot {
  padding: 10px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.prio {
  font-size: 12px;
  color: #b45309;
  background: #fef3c7;
  border-radius: 6px;
  padding: 4px 8px;
  font-weight: 600;
  width: fit-content;
}
.voir {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}
.vide {
  text-align: center;
  color: #94a3b8;
  padding: 40px;
}
</style>
