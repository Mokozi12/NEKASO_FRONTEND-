<template>
  <div class="page-demandes">

    <!-- ── Barre supérieure ─────────────────────────────── -->
    <div class="page-topbar">
      <div class="topbar-left">
        <!-- Bouton Retour -->
        <button class="btn-retour" @click="$router.back()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Retour
        </button>
        <!-- Séparateur vertical -->
        <span class="sep">|</span>
        <span class="topbar-subtitle">Toutes les demandes de location reçues</span>
      </div>

      <!-- Bouton Nouvelle demande (fond très sombre) -->
      <button class="btn-nouvelle" @click="modaleOuverte = true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nouvelle demande
      </button>
    </div>

    <!-- ── Carte tableau ────────────────────────────────── -->
    <div class="carte">

      <!-- Filtres -->
      <div class="filtres">
        <div class="select-wrap">
          <select v-model="filtreStatut" class="sel">
            <option value="TOUS">Tous statuts</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="VALIDEE">Confirmée</option>
            <option value="REFUSEE">Refusée</option>
          </select>
          <svg class="sel-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        <div class="select-wrap">
          <select v-model="filtreBien" class="sel">
            <option value="TOUS">Tous les biens</option>
            <option value="studio-plateau">Studio Plateau</option>
            <option value="chambre-ouakam">Chambre Ouakam</option>
            <option value="appartement-almadies">Appartement Almadies</option>
          </select>
          <svg class="sel-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      <!-- Tableau -->
      <div class="table-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th>Candidat</th>
              <th>Contact</th>
              <th>Bien</th>
              <th>Date</th>
              <th>Heure</th>
              <th>Statut</th>
              <th class="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="demande in demandesFiltrees" :key="demande.id" class="row">

              <!-- Candidat (bold) -->
              <td class="td-candidat">{{ demande.locataire.prenom }} {{ demande.locataire.nom }}</td>

              <!-- Contact (gris) -->
              <td class="td-contact">{{ demande.locataire.telephone }}</td>

              <!-- Bien -->
              <td>{{ demande.bien.adresse }}</td>

              <!-- Date -->
              <td>{{ demande.dateDemande }}</td>

              <!-- Heure -->
              <td>{{ demande.heure || '--:--' }}</td>

              <!-- Statut badge -->
              <td>
                <span :class="['badge', badgeClass(demande.statut)]">
                  {{ statutLabel(demande.statut) }}
                </span>
              </td>

              <!-- Actions spécifiques au statut -->
              <td class="td-actions">

                <!-- EN ATTENTE : Confirmer + Refuser -->
                <template v-if="demande.statut === 'EN_ATTENTE'">
                  <button class="btn-act btn-confirmer" @click="demandesStore.valider(demande.id)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Confirmer
                  </button>
                  <button class="btn-act btn-refuser" @click="demandesStore.refuser(demande.id)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Refuser
                  </button>
                </template>

                <!-- VALIDEE : Attribuer + Reprogrammer -->
                <template v-else-if="demande.statut === 'VALIDEE'">
                  <button class="btn-act btn-attribuer">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Attribuer
                  </button>
                  <button class="btn-act btn-texte">Reprogrammer</button>
                </template>

                <!-- REFUSEE : Reprogrammer seul -->
                <template v-else>
                  <button class="btn-act btn-texte">Reprogrammer</button>
                </template>

              </td>
            </tr>

            <!-- Ligne vide -->
            <tr v-if="demandesFiltrees.length === 0">
              <td colspan="7" class="vide">Aucune demande trouvée</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── Modale nouvelle demande ──────────────────────── -->
    <NouvelleDemandeModal v-if="modaleOuverte" @close="modaleOuverte = false" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDemandesLocationStore } from '@/stores/demandesLocation.store'
import NouvelleDemandeModal from '@/components/demandesLocation/NouvelleDemandeModal.vue'

const demandesStore = useDemandesLocationStore()
const modaleOuverte = ref(false)
const filtreStatut  = ref('TOUS')
const filtreBien    = ref('TOUS')

onMounted(() => demandesStore.charger())

const demandesFiltrees = computed(() => {
  let res = demandesStore.demandes
  if (filtreStatut.value !== 'TOUS') {
    res = res.filter(d => d.statut === filtreStatut.value)
  }
  return res
})

function badgeClass(statut) {
  const map = {
    EN_ATTENTE: 'badge-attente',
    VALIDEE:    'badge-confirmee',
    REFUSEE:    'badge-refusee',
  }
  return map[statut] ?? ''
}

function statutLabel(statut) {
  const map = {
    EN_ATTENTE: 'En attente',
    VALIDEE:    'Confirmée',
    REFUSEE:    'Refusée',
  }
  return map[statut] ?? statut
}
</script>

<style scoped>
/* ── Page ─────────────────────────────────────────────── */
.page-demandes {
  padding: 0;
}

/* ── Topbar ───────────────────────────────────────────── */
.page-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Bouton Retour : fond blanc, bordure grise */
.btn-retour {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 7px;
  padding: 7px 14px;
  font-size: 13.5px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.btn-retour:hover { background: #f9fafb; }

/* Séparateur | entre bouton et texte */
.sep {
  color: #d1d5db;
  font-size: 16px;
  user-select: none;
}

.topbar-subtitle {
  font-size: 13.5px;
  color: #9ca3af;
}

/* Bouton "+ Nouvelle demande" : fond très sombre (presque noir) */
.btn-nouvelle {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #111827;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}

.btn-nouvelle:hover { background: #1f2937; }

/* ── Carte ────────────────────────────────────────────── */
.carte {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* ── Filtres ──────────────────────────────────────────── */
.filtres {
  display: flex;
  gap: 10px;
  padding: 14px 20px;
  border-bottom: 1px solid #f3f4f6;
}

/* Wrapper du select + flèche superposée */
.select-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.sel {
  appearance: none;
  -webkit-appearance: none;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  padding: 7px 36px 7px 12px;
  font-size: 13.5px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
  min-width: 130px;
}

.sel:focus { border-color: #9ca3af; background: #fff; }

/* Flèche positionnée à droite dans le select */
.sel-arrow {
  position: absolute;
  right: 10px;
  pointer-events: none;
  color: #6b7280;
}

/* ── Tableau ──────────────────────────────────────────── */
.table-wrap {
  width: 100%;
  overflow-x: auto;
}

.tbl {
  width: 100%;
  border-collapse: collapse;
}

.tbl thead tr {
  background: #ffffff;
}

.tbl th {
  padding: 11px 20px;
  text-align: left;
  font-size: 13px;
  font-weight: 500;
  color: #9ca3af;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
}

.th-actions { text-align: right; }

.tbl td {
  padding: 15px 20px;
  font-size: 13.5px;
  color: #374151;
  border-bottom: 1px solid #f8f8f8;
  vertical-align: middle;
  white-space: nowrap;
}

/* Dernière ligne : pas de bordure basse */
.tbl tbody tr:last-child td { border-bottom: none; }

/* Hover léger sur les lignes */
.row:hover td { background: #fafafa; }

/* Candidat en gras */
.td-candidat {
  font-weight: 600;
  color: #111827 !important;
}

/* Contact en gris plus léger */
.td-contact {
  color: #9ca3af !important;
}

/* ── Badges ───────────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  min-width: 95px; /* Garantit que tous les badges aient la même largeur (le même encombrement) */
}

/* En attente : gris clair / texte gris foncé */
.badge-attente {
  background: #f3f4f6;
  color: #4b5563;
}

/* Confirmée : vert très pâle / texte vert */
.badge-confirmee {
  background: #dcfce7;
  color: #16a34a;
}

/* Refusée : rose pâle / texte rouge */
.badge-refusee {
  background: #fee2e2;
  color: #dc2626;
}

/* ── Actions ──────────────────────────────────────────── */
.td-actions {
  text-align: right;
}

/* Base commune de tous les boutons d'action */
.btn-act {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

/* Vert plein : Confirmer */
.btn-confirmer {
  background: #16a34a;
  color: white;
  border: none;
  margin-right: 6px;
}
.btn-confirmer:hover { background: #15803d; }

/* Fond blanc, bordure, croix : Refuser */
.btn-refuser {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  margin-right: 6px;
}
.btn-refuser:hover { background: #f9fafb; }

/* Vert plein : Attribuer */
.btn-attribuer {
  background: #16a34a;
  color: white;
  border: none;
  margin-right: 6px;
}
.btn-attribuer:hover { background: #15803d; }

/* Texte seul, sans fond ni bordure : Reprogrammer */
.btn-texte {
  background: transparent;
  color: #374151;
  border: none;
  font-weight: 500;
}
.btn-texte:hover { color: #111827; text-decoration: underline; }

/* Ligne vide */
.vide {
  text-align: center;
  padding: 40px !important;
  color: #9ca3af;
  font-size: 14px;
}
</style>
