import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHashHistory(),
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

    {
      path: '/gestionnaire',
      component: () => import('@/components/layout/GestionnaireLayout.vue'),
      meta: { title: 'NEKASO', requiresAuth: true, role: 'GESTIONNAIRE' },
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
          path: 'agents',
          name: 'agents',
          component: () => import('@/views/gestionnaire/AgentsView.vue'),
          meta: { title: 'Agents de visite' },
        },
        {
          path: 'demandes-location',
          name: 'demandes-location',
          component: () => import('@/views/gestionnaire/DemandesLocationView.vue'),
          meta: { title: 'Demandes de location' },
        },
        {
          path: 'demandes-location/bien/:bienId',
          name: 'demandes-location-bien',
          component: () => import('@/views/gestionnaire/DemandesBienDetailView.vue'),
          meta: { title: 'Demandes du bien' },
        },
        {
          path: 'contrats',
          name: 'contrats',
          component: () => import('@/views/gestionnaire/ContratsView.vue'),
          meta: { title: 'Contrats' },
        },
        {
          path: 'contrats/:id',
          name: 'contrat-detail',
          component: () => import('@/views/gestionnaire/ContratDetailView.vue'),
          meta: { title: 'Contrat' },
        },
        {
          path: 'paiements',
          name: 'paiements',
          component: () => import('@/views/gestionnaire/PaiementsView.vue'),
          meta: { title: 'Paiements' },
        },
        {
          path: 'alertes',
          name: 'alertes',
          component: () => import('@/views/gestionnaire/AlertesView.vue'),
          meta: { title: 'Alertes & réparations' },
        },
        {
          path: 'parametres',
          name: 'parametres',
          component: () => import('@/views/gestionnaire/ParametresView.vue'),
          meta: { title: 'Paramètres' },
        },
        {
          path: 'profil',
          name: 'profil-gestionnaire',
          component: () => import('@/views/gestionnaire/ProfilView.vue'),
          meta: { title: 'Mon profil' },
        },
      ],
    },

    {
      path: '/locataire',
      component: () => import('@/components/layout/LocataireLayout.vue'),
      meta: { title: 'NEKASO', requiresAuth: true, role: 'LOCATAIRE' },
      children: [
        {
          path: '',
          redirect: { name: 'accueil-locataire' },
        },
        {
          path: 'accueil',
          name: 'accueil-locataire',
          component: () => import('@/views/locataire/AccueilLocataireView.vue'),
          meta: { title: 'Accueil' },
        },
        {
          path: 'biens',
          name: 'biens-locataire',
          component: () => import('@/views/public/CatalogueView.vue'),
          meta: { title: 'Biens à louer', sansEntete: true },
        },
        {
          path: 'biens/:id',
          name: 'bien-detail-locataire',
          component: () => import('@/views/public/BienDetailView.vue'),
          meta: { title: 'Détail du bien', sansEntete: true },
        },
        {
          path: 'mes-locations',
          name: 'mes-locations',
          component: () => import('@/views/locataire/MesLocationsView.vue'),
          meta: { title: 'Mes locations' },
        },
        {
          path: 'contrat/:id',
          name: 'contrat-locataire',
          component: () => import('@/views/locataire/MonContratView.vue'),
          meta: { title: 'Contrat & paiements' },
        },
        {
          path: 'mon-contrat',
          redirect: { name: 'mes-locations' },
        },
        {
          path: 'contrat-paiements',
          redirect: { name: 'mes-locations' },
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

router.beforeEach((to) => {
  const auth = useAuthStore()
  
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.role && auth.isAuthenticated && auth.user?.role !== to.meta.role) {
    return { name: auth.user?.role === 'GESTIONNAIRE' ? 'dashboard' : 'accueil-locataire' }
  }

  if (to.meta.guest && auth.isAuthenticated) {
    return { name: auth.user?.role === 'GESTIONNAIRE' ? 'dashboard' : 'accueil-locataire' }
  }

  if (
    (to.name === 'landing' || to.path === '/locataire' || to.path === '/locataire/') &&
    auth.isAuthenticated &&
    auth.user?.role === 'LOCATAIRE'
  ) {
    return { name: 'accueil-locataire' }
  }
})

export default router
