<template>
  <div class="mes-demandes">
    <div class="container">
      <div class="page-header">
        <div class="header-row">
          <div>
            <h1 class="page-title">Mes demandes de location</h1>
            <p class="page-subtitle">Suivez l'avancement de vos dossiers de location</p>
          </div>
          <router-link to="/catalogue" class="btn-nouvelle">+ Nouvelle demande</router-link>
        </div>
      </div>

      <div v-if="demandes.length === 0" class="etat-vide">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <p>Aucune demande de location pour le moment</p>
        <router-link to="/catalogue" class="btn-catalogue">Parcourir les biens</router-link>
      </div>

      <div v-else class="demandes-list">
        <div v-for="demande in demandes" :key="demande.id" class="list-card request-card">
          <div class="card-top">
            <img :src="demande.photo" :alt="demande.titre" class="item-img" />
            <div class="item-details">
              <h3 class="item-titre">{{ demande.titre }}</h3>
              <p class="item-loc">{{ demande.lieu }} · Entrée {{ demande.dateEntree }} · {{ demande.duree }}</p>
              <p class="item-sub-loc">Envoyée le {{ demande.dateEnvoi }}</p>
            </div>
            <span :class="['badge-statut', `badge-statut--${demande.couleur}`]">{{ demande.statut }}</span>
          </div>

          <div class="card-actions" v-if="demande.statut !== 'Acceptée'">
            <button class="btn-annuler" @click="annuler(demande.id)">Annuler la demande</button>
          </div>

          <div class="progress-bar-container">
            <div class="progress-labels">
              <span
                v-for="(label, i) in etapesLabels"
                :key="i"
                :class="['etape-label', { active: i <= demande.etapeActuelle }]"
              >{{ label }}</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: (demande.etapeActuelle / (etapesLabels.length - 1)) * 100 + '%' }"></div>
              <div
                v-for="(label, i) in etapesLabels"
                :key="i"
                class="dot"
                :class="{ active: i <= demande.etapeActuelle }"
                :style="{ left: (i / (etapesLabels.length - 1)) * 100 + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useDemandesLocataireStore } from '@/stores/demandesLocataire.store'
import { demandesLocationService } from '@/services/demandes-location.service'

const store = useDemandesLocataireStore()
const etapesLabels = ['En attente', 'Étude dossier', 'Acceptée']

// TODO: remplacer 1 par l'id du locataire connecté quand l'auth sera prête
onMounted(() => store.chargerDemandes(1))

const demandes = computed(() =>
  store.demandes.map((d) => ({
    id: d.id,
    titre: `Bien #${d.bienId}`,
    photo: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop',
    lieu: '-',
    dateEntree: '-',
    duree: '-',
    dateEnvoi: d.dateDemande?.split(' ')[0] || '-',
    statut: formatStatut(d.statut),
    couleur: getCouleur(d.statut),
    etapeActuelle: getEtape(d.statut),
  }))
)

function formatStatut(statut) {
  const map = { EN_ATTENTE: 'En attente', VALIDEE: 'Acceptée', REFUSEE: 'Refusée' }
  return map[statut] || statut
}

function getCouleur(statut) {
  const map = { EN_ATTENTE: 'attente', VALIDEE: 'acceptee', REFUSEE: 'refusee' }
  return map[statut] || 'attente'
}

function getEtape(statut) {
  const map = { EN_ATTENTE: 0, VALIDEE: 2, REFUSEE: 1 }
  return map[statut] ?? 0
}

async function annuler(id) {
  try {
    await demandesLocationService.annuler(id)
  } catch (e) {
    console.warn('Erreur annulation:', e)
  }
  store.demandes = store.demandes.filter((d) => d.id !== id)
}
</script>

<style scoped>
.mes-demandes {
  padding: 40px 0 80px;
  background-color: #f8fafc;
  min-height: calc(100vh - 82px);
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header { margin-bottom: 32px; }

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px;
}

.page-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

.btn-nouvelle {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  transition: background 0.15s;
  white-space: nowrap;
}
.btn-nouvelle:hover { background: #f8fafc; }

.demandes-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.list-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.card-top {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.item-img {
  width: 100px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-titre {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px;
}

.item-loc {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 4px;
}

.item-sub-loc {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

.badge-statut {
  flex-shrink: 0;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-statut--attente { background: #fef3c7; color: #b45309; }
.badge-statut--acceptee { background: #dcfce7; color: #16a34a; }
.badge-statut--refusee { background: #fee2e2; color: #dc2626; }

.progress-bar-container { margin-top: 24px; }

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.etape-label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  transition: color 0.2s;
}

.etape-label.active { color: #22c55e; font-weight: 600; }

.card-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.btn-annuler {
  font-size: 13px;
  font-weight: 500;
  color: #dc2626;
  background: none;
  border: 1px solid #fecaca;
  border-radius: 7px;
  padding: 6px 14px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-annuler:hover { background: #fef2f2; }

.progress-track {
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  position: relative;
  display: flex;
  align-items: center;
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #22c55e;
  border-radius: 2px;
  transition: width 0.4s ease;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e2e8f0;
  position: absolute;
  transform: translateX(-50%);
  border: 2px solid #fff;
}

.dot.active { background: #22c55e; }

.etat-vide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px 0;
  color: #94a3b8;
  font-size: 15px;
}

.btn-catalogue {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  text-decoration: none;
  padding: 10px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
}

@media (max-width: 768px) {
  .header-row { flex-direction: column; gap: 16px; }
  .card-top { flex-wrap: wrap; }
}
</style>
