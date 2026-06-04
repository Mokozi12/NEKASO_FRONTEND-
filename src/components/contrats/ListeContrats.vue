<!--
  ListeContrats — Tableau des contrats existants.
  Affiche les colonnes : Bien, Locataire, Début, Durée, Loyer, Statut, Actions (PDF).
  Correspond à l'écran "Voir la liste" des captures.
-->
<template>
  <div class="carte">
    <table class="tableau">
      <thead>
        <tr>
          <th>Bien</th>
          <th>Locataire</th>
          <th>Début</th>
          <th>Durée</th>
          <th>Loyer</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contrat in contrats" :key="contrat.id">
          <td class="td-bien">
            {{ formatNomBien(contrat.bien) }}
          </td>
          <td>{{ formatLocataire(contrat.locataire) }}</td>
          <td>{{ contrat.dateDebut }}</td>
          <td>{{ calculerDuree(contrat) }} mois</td>
          <td>{{ formatMontant(contrat.montantLoyer) }} FCFA</td>
          <td>
            <BadgeStatut :statut="contrat.statut" />
          </td>
          <td>
            <button class="btn-pdf" @click="$emit('telecharger-pdf', contrat.id)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              PDF
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import BadgeStatut from '@/components/common/BadgeStatut.vue'

defineProps({
  contrats: { type: Array, required: true }
})

defineEmits(['telecharger-pdf'])

function formatNomBien(bien) {
  if (!bien) return '—'
  const type = bien.typeBien
    ? bien.typeBien.charAt(0) + bien.typeBien.slice(1).toLowerCase()
    : ''
  // Extraire le nom du quartier depuis l'adresse
  const quartier = bien.adresse ? bien.adresse.split(',')[0].trim() : ''
  return `${type} ${quartier}`
}

function formatLocataire(loc) {
  if (!loc) return '—'
  if (loc.prenom) return `${loc.prenom} ${loc.nom}`
  return loc.nom
}

function formatMontant(montant) {
  if (!montant) return '0'
  return montant.toLocaleString('fr-FR')
}

function calculerDuree(contrat) {
  if (!contrat.dateDebut || !contrat.dateFin) return '—'
  const d = new Date(contrat.dateDebut)
  const f = new Date(contrat.dateFin)
  return (f.getFullYear() - d.getFullYear()) * 12 + (f.getMonth() - d.getMonth())
}
</script>

<style scoped>
.td-bien {
  font-weight: 600;
  color: var(--couleur-primaire);
}

.btn-pdf {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--bordure);
  border-radius: var(--bordure-radius-petit);
  background: white;
  color: var(--texte-principal);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-pdf:hover {
  background: var(--fond-general);
  border-color: var(--couleur-primaire);
  color: var(--couleur-primaire);
}
</style>
