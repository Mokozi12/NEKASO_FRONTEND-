<!--
  AlertesView (gestionnaire) — Suivi des biens défectueux (§12).

  Le locataire signale un problème → le gestionnaire peut mettre le bien en
  réparation / le désactiver, suivre l'avancement et clore l'alerte.
-->
<template>
  <div class="alertes-page">
    <div class="page-header">
      <h1 class="page-title">Alertes & réparations</h1>
      <p class="page-subtitle">Signalements des locataires et suivi des réparations sur vos biens.</p>
    </div>

    <div v-if="alertesStore.alertes.length" class="liste">
      <div v-for="a in alertesPage" :key="a.id" class="carte alerte">
        <div class="alerte-head">
          <div>
            <h3 class="alerte-titre">{{ a.titre }}</h3>
            <p class="alerte-meta">
              {{ a.bien?.intitule }} · signalé par {{ nom(a.client) }} · {{ formatDateHeure(a.date) }}
            </p>
          </div>
          <span class="chip" :class="chipClass(a.statut)">{{ libelleStatut(a.statut) }}</span>
        </div>

        <p class="alerte-msg">{{ a.message }}</p>

        <!-- Suivi -->
        <div v-if="a.suivi.length" class="suivi">
          <div v-for="s in a.suivi" :key="s.id" class="suivi-item">
            <span class="dot"></span>
            <div>
              <p class="suivi-msg">{{ s.message }}</p>
              <span class="gris">{{ formatDateHeure(s.date) }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions">
          <template v-if="a.statut === 'NOUVELLE'">
            <button class="btn-rep" @click="mettreEnReparation(a)">Mettre en réparation</button>
            <button class="btn-desac" @click="desactiver(a)">Désactiver le bien</button>
          </template>
          <template v-else-if="a.statut === 'EN_REPARATION'">
            <form class="suivi-form" @submit.prevent="ajouterSuivi(a)">
              <input v-model="notes[a.id]" type="text" placeholder="Ajouter une étape de suivi..." />
              <button type="submit" class="btn-mini">Ajouter</button>
            </form>
            <button class="btn-resoudre" @click="resoudre(a)">Marquer résolue</button>
          </template>
          <span v-else class="gris">Alerte résolue.</span>
        </div>
      </div>
    </div>
    <div v-else class="carte vide">Aucune alerte signalée.</div>

    <Pagination v-model="page" :total-pages="totalPages" />
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useAlertesStore } from '@/stores/alertes.store'
import { useNotification } from '@/composables/useNotification'
import { useFormat } from '@/composables/useFormat'
import { usePagination } from '@/composables/usePagination'
import { nomComplet } from '@/mocks/db'
import Pagination from '@/components/common/Pagination.vue'

const alertesStore = useAlertesStore()
const { succes, info } = useNotification()
const { formatDateHeure } = useFormat()

const { page, totalPages, itemsPage: alertesPage } = usePagination(
  computed(() => alertesStore.alertes),
  6,
)

const notes = reactive({})
const nom = (p) => nomComplet(p)

async function mettreEnReparation(a) {
  await alertesStore.mettreEnReparation(a.id, 'Prise en charge du signalement')
  succes('Bien mis en réparation. Le locataire a été notifié.')
}
function desactiver(a) {
  alertesStore.desactiverBien(a.bienId)
  info('Bien désactivé (indisponible).')
}
function ajouterSuivi(a) {
  const msg = notes[a.id]?.trim()
  if (!msg) return
  alertesStore.ajouterSuivi(a.id, msg)
  notes[a.id] = ''
}
async function resoudre(a) {
  await alertesStore.marquerResolue(a.id)
  succes('Alerte résolue. Le bien a été remis en état.')
}

function libelleStatut(s) {
  return { NOUVELLE: 'Nouvelle', EN_REPARATION: 'En réparation', RESOLUE: 'Résolue' }[s] || s
}
function chipClass(s) {
  return { NOUVELLE: 'chip--danger', EN_REPARATION: 'chip--warn', RESOLUE: 'chip--green' }[s] || ''
}
</script>

<style scoped>
.alertes-page {
  padding: 0;
}
.liste {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.alerte {
  padding: 20px;
}
.alerte-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.alerte-titre {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}
.alerte-meta {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 2px;
}
.alerte-msg {
  font-size: 14px;
  color: #374151;
  margin: 14px 0;
}
.suivi {
  border-left: 2px solid #e2e8f0;
  padding-left: 16px;
  margin: 14px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.suivi-item {
  display: flex;
  gap: 10px;
  position: relative;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #00d15a;
  margin-top: 4px;
  margin-left: -21px;
  border: 2px solid #fff;
}
.suivi-msg {
  font-size: 14px;
  color: #1e293b;
}
.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
  margin-top: 4px;
}
.suivi-form {
  display: flex;
  gap: 8px;
  flex: 1;
  min-width: 240px;
}
.suivi-form input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
}
.btn-rep {
  background: #212d4d;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}
.btn-desac {
  background: #fff;
  border: 1px solid #fed7aa;
  color: #c2410c;
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}
.btn-resoudre {
  background: #00d15a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}
.btn-mini {
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
}
.gris {
  color: #94a3b8;
  font-size: 13px;
}
.chip {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.chip--danger {
  background: #fee2e2;
  color: #dc2626;
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
