import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/gestionnaire/dashboard' },

    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { public: true }
    },

    {
      path: '/gestionnaire',
      component: () => import('@/components/layout/GestionnaireLayout.vue'),
      meta: { requiresAuth: true, role: 'GESTIONNAIRE' },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/gestionnaire/DashboardView.vue')
        },
        {
          path: 'biens',
          name: 'biens',
          component: () => import('@/views/gestionnaire/BiensView.vue')
        },
        {
          path: 'visites',
          name: 'visites',
          component: () => import('@/views/gestionnaire/VisitesView.vue')
        },
        {
          // ✅ AJOUTÉ : route manquante pour les demandes de location
          path: 'demandes-location',
          name: 'demandes-location',
          component: () => import('@/views/gestionnaire/DemandesLocationView.vue')
        },
        {
          path: 'contrats',
          name: 'contrats',
          component: () => import('@/views/gestionnaire/ContratsView.vue')
        },
        {
          path: 'paiements',
          name: 'paiements',
          component: () => import('@/views/gestionnaire/PaiementsView.vue')
        }
      ]
    },

    { path: '/:pathMatch(.*)*', redirect: '/gestionnaire/dashboard' }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) return next('/login')
  if (to.meta.role && authStore.user?.role !== to.meta.role) return next('/login')
  if (to.meta.public && authStore.isAuthenticated) return next('/gestionnaire/dashboard')
  next()
})

export default router
