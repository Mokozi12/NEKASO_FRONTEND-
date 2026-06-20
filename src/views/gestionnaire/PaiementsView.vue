<!--
  PaiementsView (gestionnaire) — §10.

  Les paiements sont gérés DEPUIS LA LISTE DES CONTRATS (pas une liste de
  paiements isolée). On présente ici les contrats actifs, filtrables par
  téléphone / nom client / numéro de contrat ; ouvrir un contrat permet
  d'enregistrer un paiement sur l'échéance présélectionnée.
-->
<template>
  <div class="paiements-page">
    <div class="page-header">
      <h1 class="page-title">Paiements</h1>
      <p class="page-subtitle">Suivi des loyers par contrat. Ouvrez un contrat pour enregistrer un paiement.</p>
    </div>

    <div class="barre-filtres carte">
      <div class="recherche">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input v-model="recherche" type="text" placeholder="Téléphone, nom client ou n° de contrat..." />
      </div>
    </div>

    <div class="carte liste-carte">
      <table v-if="lignes.length" class="tableau">
        <thead>
          <tr>
            <th>N° contrat</th>
            <th>Client</th>
            <th>Téléphone</th>
            <th>Bien</th>
            <th>Avancement</th>
            <th>Prochaine échéance</th>
            <th class="ta-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in lignesPage" :key="l.contrat.id">
            <td class="fort">{{ l.contrat.numero }}</td>
            <td>{{ nom(l.contrat.client) }}</td>
            <td class="gris">{{ l.contrat.client?.telephone }}</td>
            <td>{{ l.contrat.bien?.intitule }}</td>
            <td>
              <div class="avancement">
                <div class="barre"><div class="barre-fill" :style="{ width: l.progression + '%' }"></div></div>
                <span class="gris">{{ l.payes }}/{{ l.total }}</span>
              </div>
            </td>
            <td>
              <span v-if="l.prochaine" class="chip chip--warn">
                {{ l.prochaine.libelle }} · {{ formatMontant(l.prochaine.montant) }}
              </span>
              <span v-else class="chip chip--green">À jour</span>
            </td>
            <td class="ta-right">
              <button class="btn-gerer" @click="$router.push(`/gestionnaire/contrats/${l.contrat.id}`)">
                Gérer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="vide">Aucun contrat actif.</p>
    </div>

    <Pagination v-model="page" :total-pages="totalPages" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useContratsStore } from '@/stores/contrats.store'
import { usePaiementsStore } from '@/stores/paiements.store'
import { useFormat } from '@/composables/useFormat'
import { usePagination } from '@/composables/usePagination'
import { nomComplet, STATUT_CONTRAT } from '@/mocks/db'
import Pagination from '@/components/common/Pagination.vue'

const contratsStore = useContratsStore()
const paiementsStore = usePaiementsStore()
const { formatMontant } = useFormat()

const recherche = ref('')

const lignes = computed(() =>
  contratsStore
    .filtrer(recherche.value)
    .filter((c) => c.statut === STATUT_CONTRAT.ACTIF)
    .map((contrat) => {
      const total = contrat.echeances.length
      const payes = contrat.echeances.filter((e) => e.statut === 'PAYE').length
      return {
        contrat,
        total,
        payes,
        progression: total ? Math.round((payes / total) * 100) : 0,
        prochaine: paiementsStore.echeanceCourante(contrat),
      }
    }),
)

const { page, totalPages, itemsPage: lignesPage } = usePagination(lignes, 8)

const nom = (p) => nomComplet(p)
</script>

<style scoped>
.paiements-page {
  padding: 0;
}
.barre-filtres {
  margin-bottom: 20px;
  padding: 14px 20px;
}
.recherche {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px 12px;
}
.recherche input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  width: 100%;
  font-family: inherit;
}
.liste-carte {
  padding: 0;
  overflow: hidden;
}
.tableau {
  width: 100%;
  border-collapse: collapse;
}
.tableau th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f9;
}
.tableau td {
  padding: 15px 20px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f8fafc;
}
.tableau tr:last-child td {
  border-bottom: none;
}
.fort {
  font-weight: 600;
  color: #111827;
}
.gris {
  color: #94a3b8;
}
.ta-right {
  text-align: right;
}
.avancement {
  display: flex;
  align-items: center;
  gap: 8px;
}
.barre {
  width: 90px;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}
.barre-fill {
  height: 100%;
  background: #00d15a;
}
.btn-gerer {
  background: #212d4d;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.chip {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.chip--warn {
  background: #fef3c7;
  color: #b45309;
}
.chip--green {
  background: #dcfce7;
  color: #16a34a;
}
.vide {
  text-align: center;
  color: #94a3b8;
  padding: 40px;
}
</style>
