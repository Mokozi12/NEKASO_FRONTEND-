import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },

    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { public: true },
    },

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

    { path: '/:pathMatch(.*)*', redirect: '/gestionnaire/dashboard' },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Forcer la déconnexion si l'utilisateur va sur la racine /
  if (to.path === '/login' && from.path === '/') {
     authStore.logout()
  }

  // Protection réactivée
  if (to.meta.requiresAuth && !authStore.isAuthenticated) return next('/login')
  if (to.meta.role && authStore.user?.role !== to.meta.role) return next('/login')
  if (to.meta.public && authStore.isAuthenticated) return next('/gestionnaire/dashboard')
  
  next()
})

export default router
