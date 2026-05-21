<template>
  <aside class="sidebar">
    <!-- Logo et nom de l'application -->
    <div class="sidebar-logo">
      <span class="sidebar-logo-icone">🏠</span>
      <span class="sidebar-logo-texte">NEKASO</span>
    </div>

    <!-- Liens de navigation -->
    <nav class="sidebar-nav">
      <!--
        RouterLink génère un <a> mais sans recharger la page.
        active-class s'applique automatiquement quand l'URL correspond.
        C'est ce qui colore le lien de la page active en orange.
      -->
      <RouterLink
        v-for="item in menuItems"
        :key="item.route"
        :to="item.route"
        class="sidebar-lien"
        active-class="sidebar-lien--actif"
      >
        <span class="sidebar-lien-icone">{{ item.icone }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- Informations de l'utilisateur et déconnexion -->
    <div class="sidebar-bas">
      <div class="sidebar-utilisateur">
        <div class="sidebar-avatar">
          <!-- Initiale du prénom de l'utilisateur -->
          {{ authStore.user?.prenom?.charAt(0) || 'G' }}
        </div>
        <div class="sidebar-utilisateur-info">
          <span class="sidebar-utilisateur-nom">
            {{ authStore.nomComplet }}
          </span>
          <span class="sidebar-utilisateur-role">Gestionnaire</span>
        </div>
      </div>

      <button @click="seDeconnecter" class="sidebar-btn-deconnexion">🚪 Se déconnecter</button>
    </div>
  </aside>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const router = useRouter()

/*
  La liste des éléments du menu.
  On utilise un tableau d'objets plutôt que de répéter le HTML
  5 fois. C'est plus maintenable : pour ajouter une page,
  tu n'ajoutes qu'un objet dans ce tableau.
*/
const menuItems = [
  {
    route: '/gestionnaire/dashboard',
    label: 'Tableau de bord',
    icone: '📊',
  },
  {
    route: '/gestionnaire/biens',
    label: 'Mes biens',
    icone: '🏠',
  },
  {
    route: '/gestionnaire/visites',
    label: 'Visites',
    icone: '📅',
  },
  {
    route: '/gestionnaire/contrats',
    label: 'Contrats',
    icone: '📄',
  },
  {
    route: '/gestionnaire/paiements',
    label: 'Paiements',
    icone: '💰',
  },
]

function seDeconnecter() {
  // Vider le store et localStorage
  authStore.logout()
  // Rediriger vers la page de login
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  position: fixed; /* Reste en place quand on scroll */
  top: 0;
  left: 0;
  width: var(--sidebar-largeur); /* 260px */
  height: 100vh;
  background-color: var(--fond-sidebar);
  color: white;
  display: flex;
  flex-direction: column;
  /* Ombre sur le côté droit pour séparer du contenu */
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 100; /* Au-dessus du contenu principal */
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logo-icone {
  font-size: 28px;
}

.sidebar-logo-texte {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--couleur-accent);
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto; /* Scroll si trop d'éléments */
}

.sidebar-lien {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.sidebar-lien:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: white;
}

/* Appliqué automatiquement par RouterLink quand l'URL correspond */
.sidebar-lien--actif {
  background-color: var(--couleur-accent);
  color: white;
  font-weight: 600;
}

.sidebar-lien-icone {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.sidebar-bas {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-utilisateur {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--couleur-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.sidebar-utilisateur-info {
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Cache le texte trop long */
}

.sidebar-utilisateur-nom {
  font-size: 13px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* Ajoute "..." si le nom est trop long */
}

.sidebar-utilisateur-role {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.sidebar-btn-deconnexion {
  width: 100%;
  padding: 10px;
  background-color: rgba(239, 68, 68, 0.15);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.sidebar-btn-deconnexion:hover {
  background-color: rgba(239, 68, 68, 0.3);
  color: white;
}
</style>
