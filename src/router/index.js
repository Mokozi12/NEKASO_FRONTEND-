import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/components/layout/PublicLayout.vue'),
      children: [
        {
          path: '',
          name: 'landing',
          component: () => import('@/views/public/LandingView.vue'),
          meta: { public: true },
        },
        {
          path: 'catalogue',
          name: 'catalogue',
          component: () => import('@/views/public/CatalogueView.vue'),
          meta: { public: true },
        },
        {
          path: 'biens/:id',
          name: 'bien-public',
          component: () => import('@/views/public/BienDetailView.vue'),
          meta: { public: true },
        },
      ],
    },

    // === AUTH ROUTES (pas de layout parent, pas de meta.public) ===
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/login-gestionnaire',
      redirect: '/login',
    },
    {
      path: '/inscription',
      redirect: '/login'
    },

    // === GESTIONNAIRE ===
    {
      path: '/gestionnaire',
      component: () => import('@/components/layout/GestionnaireLayout.vue'),
      meta: { title: 'NEKASO', requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/gestionnaire/DashboardView.vue'),
          meta: { title: 'Tableau de bord NEKASO' },
        },
        {
          path: 'biens',
          name: 'biens',
          component: () => import('@/views/gestionnaire/BiensView.vue'),
          meta: { title: 'Biens immobiliers' },
        },
        {
          path: 'biens/:id',
          name: 'bien-detail',
          component: () => import('@/views/gestionnaire/BienDetailView.vue'),
          meta: { title: 'Détails du bien' },
        },
        {
          path: 'visites',
          name: 'visites',
          component: () => import('@/views/gestionnaire/VisitesView.vue'),
          meta: { title: 'Visites', hidePageTitle: true },
        },
        {
          path: 'demandes-location',
          name: 'demandes-location',
          component: () => import('@/views/gestionnaire/DemandesLocationView.vue'),
          meta: { title: 'Demandes de location' },
        },
        {
          path: 'contrats',
          name: 'contrats',
          component: () => import('@/views/gestionnaire/ContratsView.vue'),
          meta: { title: 'Contrats' },
        },
        {
          path: 'paiements',
          name: 'paiements',
          component: () => import('@/views/gestionnaire/PaiementsView.vue'),
          meta: { title: 'Paiements' },
        },
        {
          path: 'parametres',
          name: 'parametres',
          component: () => import('@/views/gestionnaire/ParametresView.vue'),
          meta: { title: 'Paramètres' },
        },
      ],
    },

    // === LOCATAIRE ===
    {
      path: '/locataire',
      component: () => import('@/components/layout/LocataireLayout.vue'),
      meta: { title: 'NEKASO', requiresAuth: true },
      children: [
        {
          path: 'mes-locations',
          name: 'mes-locations',
          component: () => import('@/views/locataire/MesLocationsView.vue'),
          meta: { title: 'Mes locations' },
        },
        {
          path: 'contrat/:id?',
          name: 'contrat-locataire',
          component: () => import('@/views/locataire/ContratPaiementsView.vue'),
          meta: { title: 'Contrat & Paiements' },
        },
        {
          path: 'contrat-paiements',
          redirect: { name: 'contrat-locataire' }
        },
        {
          path: 'profil',
          name: 'profil-locataire',
          component: () => import('@/views/locataire/ProfilView.vue'),
          meta: { title: 'Mon profil' },
        },
        {
          path: 'mes-demandes-visites',
          name: 'mes-demandes-visites',
          component: () => import('@/views/locataire/MesDemandesVisitesView.vue'),
          meta: { title: 'Mes demandes de visite' },
        },
        {
          path: 'mes-demandes-locations',
          name: 'mes-demandes-locations',
          component: () => import('@/views/locataire/MesDemandesLocationsView.vue'),
          meta: { title: 'Mes demandes de location' },
        },
        {
          path: 'succes-visite/:bienId',
          name: 'succes-visite',
          component: () => import('@/views/locataire/SuccesVisiteView.vue'),
          meta: { title: 'Demande envoyée' },
        },
        {
          path: 'succes-location/:bienId',
          name: 'succes-location',
          component: () => import('@/views/locataire/SuccesLocationView.vue'),
          meta: { title: 'Demande envoyée' },
        },
      ],
    },

    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(() => {
  // TODO: remettre l'auth quand l'API de connexion sera prête
})

export default router
