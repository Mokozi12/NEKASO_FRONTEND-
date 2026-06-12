<template>
  <div class="bien-detail">
    <HeaderLocataire v-if="authStore.isAuthenticated && authStore.user?.role === 'LOCATAIRE'" />
    <HeaderPublic v-else />

    <div class="detail-content">
      <div class="container">
        <router-link to="/catalogue" class="btn-back">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Retour aux biens
        </router-link>

        <div class="detail-layout" v-if="bien">
          <!-- LEFT COLUMN: IMAGES & DETAILS -->
          <div class="left-column">
            <!-- GALLERY -->
            <div class="gallery">
              <div class="main-image">
                <img
                  :src="
                    selectedImage ||
                    bien.photos?.[0] ||
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop'
                  "
                  :alt="bien.titre"
                />
              </div>
              <div class="thumbnails" v-if="bien.photos && bien.photos.length > 1">
                <img
                  v-for="(photo, index) in bien.photos.slice(0, 4)"
                  :key="index"
                  :src="photo"
                  :alt="`${bien.titre} ${index + 1}`"
                  @click="selectedImage = photo"
                  :class="{ active: selectedImage === photo }"
                />
              </div>
            </div>

            <!-- HEADER / TITLE -->
            <div class="bien-header">
              <div class="title-row">
                <h1 class="bien-titre">{{ bien.titre }}</h1>
                <BadgeStatut :statut="bien.statut || 'disponible'" />
              </div>
              <div class="bien-localisation">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {{ bien.adresse?.quartier || 'Les Almadies' }}, {{ bien.adresse?.ville || 'Dakar' }}
              </div>
            </div>

            <!-- SPECS GRID -->
            <div class="specs-list">
              <div class="spec-item" v-if="bien.caracteristiques?.nombreChambres">
                <div class="spec-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"
                    ></path>
                  </svg>
                </div>
                <div class="spec-info">
                  <span class="spec-value">{{ bien.caracteristiques.nombreChambres }}</span>
                  <span class="spec-label">Chambres</span>
                </div>
              </div>

              <div class="spec-item" v-if="bien.caracteristiques?.nombreSallesDeBain">
                <div class="spec-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"
                    ></path>
                    <line x1="2" x2="22" y1="12" y2="12"></line>
                  </svg>
                </div>
                <div class="spec-info">
                  <span class="spec-value">{{ bien.caracteristiques.nombreSallesDeBain }}</span>
                  <span class="spec-label">Salles de bain</span>
                </div>
              </div>

              <div class="spec-item" v-if="bien.caracteristiques?.surface">
                <div class="spec-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                    ></path>
                  </svg>
                </div>
                <div class="spec-info">
                  <span class="spec-value">{{ bien.caracteristiques.surface }}</span>
                  <span class="spec-label">m²</span>
                </div>
              </div>
            </div>

            <!-- DESCRIPTION -->
            <div class="section-block">
              <h2 class="section-title">Description</h2>
              <p class="description-text">
                {{
                  bien.description ||
                  "Magnifique appartement de 3 chambres avec vue panoramique sur l'océan. Situé dans un quartier résidentiel calme et sécurisé des Almadies, proche des commerces et restaurants."
                }}
              </p>
            </div>

            <!-- EQUIPEMENTS -->
            <div class="section-block">
              <h2 class="section-title">Équipements</h2>
              <div class="equipements-grid">
                <div class="equipement-item" v-for="equip in equipements" :key="equip">
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
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {{ equip }}
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: SIDEBAR -->
          <div class="sidebar">
            <div class="action-card sticky">
              <div class="price-box">
                <div class="price">{{ formatMontant(bien.loyer || 450000) }}</div>
                <div class="price-details">
                  Caution {{ bien.cautionMois || 2 }} mois — 1er mois dû à la signature
                </div>
              </div>

              <div class="actions">
                <button class="btn-primary" @click="demanderVisite">
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
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Demander une visite
                </button>

                <button class="btn-location" @click="demanderLocation">
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
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Demander une location
                </button>

                <button class="btn-whatsapp" @click="contacterWhatsApp">
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
                    <path
                      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                    ></path>
                  </svg>
                  Contacter via WhatsApp
                </button>

                <button class="btn-call" @click="appeler">
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
                    <path
                      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                    ></path>
                  </svg>
                  Appeler
                </button>
              </div>

              <!-- GESTIONNAIRE INFO -->
              <div class="gestionnaire-section">
                <div class="gestionnaire-label">GESTIONNAIRE</div>
                <div class="gestionnaire-info">
                  <div class="gestionnaire-avatar">
                    {{
                      bien.gestionnaire?.nom
                        ? bien.gestionnaire.nom.substring(0, 2).toUpperCase()
                        : 'MD'
                    }}
                  </div>
                  <div>
                    <div class="gestionnaire-nom">{{ bien.gestionnaire?.nom || 'Mme Diop' }}</div>
                    <div class="gestionnaire-tel">
                      Téléphone : {{ bien.gestionnaire?.telephone || '+221 77 123 45 67' }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- NO ACCOUNT BANNER -->
              <div v-if="!authStore.isAuthenticated" class="alert-info">
                <div class="alert-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="9" y1="18" x2="15" y2="18"></line>
                    <line x1="10" y1="22" x2="14" y2="22"></line>
                    <path
                      d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"
                    ></path>
                  </svg>
                </div>
                <div>
                  Pas de compte ? La demande de visite prendra 1 minute et vous reviendrez ici.
                </div>
              </div>
            </div>
          </div>
        </div>

        <ChargementSpinner v-else />
      </div>
    </div>

    <!-- MODAL VISITE -->
    <div class="modal-overlay" v-if="showModalVisite" @click.self="showModalVisite = false">
      <div class="modal" style="max-width: 480px; text-align: center; padding: 40px 32px">
        <h3
          class="modal-titre"
          style="
            color: #0f172a;
            margin-bottom: 12px;
            font-size: 22px;
            font-weight: 700;
            text-align: center;
          "
        >
          Confirmer la demande
        </h3>
        <p style="color: #64748b; font-size: 15px; line-height: 1.6; text-align: center">
          Voulez-vous vraiment envoyer une demande de visite pour ce bien ? Votre profil sera
          automatiquement transmis.
        </p>
        <div
          class="modal-actions"
          style="
            border-top: none;
            padding-top: 0;
            display: flex;
            gap: 16px;
            margin-top: 32px;
            justify-content: center;
          "
        >
          <button
            class="btn-secondaire"
            @click="showModalVisite = false"
            style="flex: 1; padding: 14px; border-radius: 8px; font-weight: 600; font-size: 15px"
          >
            Annuler
          </button>
          <button
            class="btn-primary"
            @click="confirmerVisite"
            style="
              flex: 1;
              padding: 14px;
              border-radius: 8px;
              justify-content: center;
              width: auto;
              font-size: 15px;
            "
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL LOCATION -->
    <div class="modal-overlay" v-if="showModalLocation" @click.self="showModalLocation = false">
      <div class="modal" style="max-width: 480px; text-align: center; padding: 40px 32px">
        <h3
          class="modal-titre"
          style="
            color: #0f172a;
            margin-bottom: 12px;
            font-size: 22px;
            font-weight: 700;
            text-align: center;
          "
        >
          Confirmer la demande
        </h3>
        <p style="color: #64748b; font-size: 15px; line-height: 1.6; text-align: center">
          Voulez-vous vraiment envoyer une demande de location pour ce bien ? Votre profil sera
          automatiquement transmis.
        </p>
        <div
          class="modal-actions"
          style="
            border-top: none;
            padding-top: 0;
            display: flex;
            gap: 16px;
            margin-top: 32px;
            justify-content: center;
          "
        >
          <button
            class="btn-secondaire"
            @click="showModalLocation = false"
            style="flex: 1; padding: 14px; border-radius: 8px; font-weight: 600; font-size: 15px"
          >
            Annuler
          </button>
          <button
            class="btn-location"
            @click="confirmerLocation"
            style="
              flex: 1;
              padding: 14px;
              border-radius: 8px;
              justify-content: center;
              width: auto;
              font-size: 15px;
              display: flex;
              align-items: center;
            "
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBiensPublicsStore } from '@/stores/biensPublics.store'
import { useAuthStore } from '@/stores/auth.store'
import HeaderPublic from '@/components/layout/HeaderPublic.vue'
import HeaderLocataire from '@/components/layout/HeaderLocataire.vue'
import BadgeStatut from '@/components/biens/common/BadgeStatut.vue'
import ChargementSpinner from '@/components/biens/common/ChargementSpinner.vue'
import { visitesLocataireService } from '@/services/visites-locataire.service'
import { demandesLocationService } from '@/services/demandes-location.service'

const route = useRoute()
const router = useRouter()
const biensStore = useBiensPublicsStore()
const authStore = useAuthStore()

const bien = ref(null)
const selectedImage = ref(null)
const showModalVisite = ref(false)
const showModalLocation = ref(false)

const equipements = computed(() => {
  return ['Climatisation', 'Wifi', 'Parking', 'Cuisine équipée', 'Gardien 24/7', 'Balcon']
})

onMounted(async () => {
  await biensStore.chargerBiens({ page: 1, size: 20 })
  bien.value = biensStore.biens.find((b) => b.id === route.params.id)

  if (!bien.value) {
    // Si bien non trouvé dans le mock public (cas où on navigue direct), créer un faux bien pour l'aperçu
    bien.value = {
      id: route.params.id,
      titre: 'Appartement moderne - Vue sur mer',
      statut: 'disponible',
      loyer: 450000,
      cautionMois: 2,
      adresse: { quartier: 'Les Almadies', ville: 'Dakar' },
      caracteristiques: { nombreChambres: 3, nombreSallesDeBain: 2, surface: 110 },
      photos: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=500&fit=crop',
      ],
    }
  }

  if (bien.value && bien.value.photos?.length) {
    selectedImage.value = bien.value.photos[0]
  }

  // Vérifier s'il y a une action en attente (après authentification)
  if (
    authStore.isAuthenticated &&
    authStore.pendingAction &&
    authStore.pendingAction.bienId == route.params.id
  ) {
    if (authStore.pendingAction.type === 'visite') {
      showModalVisite.value = true
    } else if (authStore.pendingAction.type === 'location') {
      showModalLocation.value = true
    }
    authStore.clearPendingAction()
  }
})

const formatMontant = (montant) => {
  if (!montant) return '—'
  return (
    new Intl.NumberFormat('fr-FR', { style: 'decimal', minimumFractionDigits: 0 }).format(montant) +
    ' FCFA /mois'
  )
}

const demanderVisite = () => {
  if (!authStore.isAuthenticated) {
    authStore.setPendingAction({ type: 'visite', bienId: bien.value.id })
    router.push('/login')
  } else {
    showModalVisite.value = true
  }
}

const confirmerVisite = async () => {
  showModalVisite.value = false

  try {
    const idLocataire = authStore.user?.id ?? authStore.utilisateurCourant?.id
    await visitesLocataireService.demander({ idBien: Number(bien.value.id), idLocataire })
  } catch (err) {
    console.warn('API visite indisponible, navigation locale', err)
  }
  router.push(`/locataire/succes-visite/${bien.value.id}`)
}

const demanderLocation = () => {
  if (!authStore.isAuthenticated) {
    authStore.setPendingAction({ type: 'location', bienId: bien.value.id })
    router.push('/login')
  } else {
    showModalLocation.value = true
  }
}

const confirmerLocation = async () => {
  showModalLocation.value = false

  try {
    const idLocataire = authStore.user?.id ?? authStore.utilisateurCourant?.id
    await demandesLocationService.creer({ idBien: Number(bien.value.id), idLocataire })
  } catch (err) {
    console.warn('API location indisponible, navigation locale', err)
  }
  router.push(`/locataire/succes-location/${bien.value.id}`)
}

const contacterWhatsApp = () => {
  const tel = bien.value.gestionnaire?.telephone || '+221771234567'
  const win = window.open(`https://wa.me/${tel.replace(/\s/g, '')}`, '_blank')
  if (win) win.opener = null
}

const appeler = () => {
  const tel = bien.value.gestionnaire?.telephone || '+221771234567'
  window.location.href = `tel:${tel}`
}
</script>

<style scoped>
.bien-detail {
  min-height: 100vh;
  background-color: #f8fafc;
}

.detail-content {
  padding: 32px 0 80px;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 24px;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
  transition: color 0.2s;
}

.btn-back:hover {
  color: #0f172a;
}

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 40px;
  align-items: start;
}

/* LEFT COLUMN */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.gallery {
  border-radius: 16px;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: 480px;
  background-color: #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnails {
  display: flex;
  gap: 12px;
}

.thumbnails img {
  width: 100px;
  height: 76px;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
  opacity: 0.7;
}

.thumbnails img:hover,
.thumbnails img.active {
  border-color: #22c55e;
  opacity: 1;
}

/* INFO CARD */
.info-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 32px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

/* HEADER INFO */
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.bien-titre {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.bien-localisation {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  color: #64748b;
}

/* SPECS LIST */
.specs-list {
  display: flex;
  gap: 32px;
  padding: 24px 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.spec-icon {
  width: 40px;
  height: 40px;
  background-color: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.spec-info {
  display: flex;
  flex-direction: column;
}

.spec-value {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.spec-label {
  font-size: 13px;
  color: #64748b;
}

/* SECTIONS */
.section-block {
  margin-top: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 16px;
}

.description-text {
  font-size: 15px;
  color: #475569;
  line-height: 1.6;
}

.equipements-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.equipement-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: #334155;
}

.equipement-item svg {
  stroke: #22c55e;
  flex-shrink: 0;
}

/* RIGHT COLUMN: SIDEBAR */
.sidebar {
  position: relative;
}

.sticky {
  position: sticky;
  top: 100px; /* Below header */
}

.action-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 32px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.price-box {
  margin-bottom: 24px;
}

.price {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.price-details {
  font-size: 14px;
  color: #64748b;
}

/* ACTIONS */
.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.btn-primary,
.btn-location,
.btn-whatsapp,
.btn-call {
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-primary {
  background-color: #22c55e;
  color: white;
}

.btn-primary:hover {
  background-color: #16a34a;
}

.btn-location {
  background-color: #1e293b;
  color: white;
}

.btn-location:hover {
  background-color: #0f172a;
}

.btn-whatsapp {
  background-color: #22c55e;
  color: white;
}

.btn-whatsapp:hover {
  background-color: #16a34a;
}

.btn-call {
  background-color: white;
  border: 1px solid #e2e8f0;
  color: #0f172a;
}

.btn-call:hover {
  background-color: #f8fafc;
}

/* GESTIONNAIRE */
.gestionnaire-section {
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
  margin-bottom: 24px;
}

.gestionnaire-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 12px;
}

.gestionnaire-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gestionnaire-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #e0e7ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
}

.gestionnaire-nom {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 2px;
}

.gestionnaire-tel {
  font-size: 13px;
  color: #64748b;
}

/* ALERT INFO */
.alert-info {
  background-color: #fffbeb;
  border: 1px solid #fef3c7;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  gap: 12px;
  color: #b45309;
  font-size: 13px;
  line-height: 1.5;
}

.alert-icon {
  width: 24px;
  height: 24px;
  background-color: #fef3c7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-icon svg {
  stroke: #d97706;
}

@media (max-width: 968px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .sticky {
    position: static;
  }
}
</style>
