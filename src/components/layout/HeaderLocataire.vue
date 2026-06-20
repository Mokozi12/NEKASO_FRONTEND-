<template>
  <header class="header-locataire">
    <div class="container">
      <router-link to="/locataire/accueil" class="logo" aria-label="NEKASO — Accueil">
        <img src="/logo-nekaso.png?v=2" alt="NEKASO" class="logo-icon" />
      </router-link>

      <nav class="nav">
        <router-link to="/locataire/accueil" class="nav-link">Accueil</router-link>
        <router-link to="/locataire/mes-locations" class="nav-link">Mes locations</router-link>
        <router-link to="/locataire/mes-demandes-visites" class="nav-link">Mes demandes de visite</router-link>
        <router-link to="/locataire/mes-demandes-locations" class="nav-link">Mes demandes de location</router-link>
      </nav>

      <div class="actions">
        <router-link to="/locataire/profil" class="action-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
          </svg>
          {{ authStore.nomComplet || 'Profil' }}
        </router-link>
        <button @click="logout" class="btn-logout" title="Se déconnecter" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Déconnexion
        </button>

<button class="mobile-toggle" @click="mobileOpen = !mobileOpen" aria-label="Menu" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line v-if="!mobileOpen" x1="3" y1="6" x2="21" y2="6" />
            <line v-if="!mobileOpen" x1="3" y1="12" x2="21" y2="12" />
            <line v-if="!mobileOpen" x1="3" y1="18" x2="21" y2="18" />
            <path v-if="mobileOpen" d="M18 6 6 18" />
            <path v-if="mobileOpen" d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>

    <Transition name="slide">
      <div v-if="mobileOpen" class="mobile-menu">
        <router-link to="/locataire/accueil" class="mobile-link" @click="mobileOpen = false">Accueil</router-link>
        <router-link to="/locataire/mes-locations" class="mobile-link" @click="mobileOpen = false">Mes locations</router-link>
        <router-link to="/locataire/mes-demandes-visites" class="mobile-link" @click="mobileOpen = false">Mes demandes de visite</router-link>
        <router-link to="/locataire/mes-demandes-locations" class="mobile-link" @click="mobileOpen = false">Mes demandes de location</router-link>
        <router-link to="/locataire/profil" class="mobile-link" @click="mobileOpen = false">{{ authStore.nomComplet || 'Profil' }}</router-link>
        <button class="mobile-link mobile-logout" @click="mobileOpen = false; logout()">Se déconnecter</button>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const logout = () => {
  authStore.logout()
  toast.success('Déconnexion réussie')
  router.push('/login')
}

const mobileOpen = ref(false)
router.afterEach(() => { mobileOpen.value = false })
</script>

<style scoped>
.header-locataire {
  background-color: #1e293b;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}
.container {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 82px;
}
.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}
.logo-icon {
  width: 74px;
  height: 74px;
  object-fit: contain;
  display: block;
}
.nav {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 18px;
}
.nav-link {
  color: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 14px;
  border-radius: 8px;
  transition: all 0.18s;
  white-space: nowrap;
}
.nav-link:hover {
  color: #fff;
}
.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.12);
  color: #fff;
}
.actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-left: auto;
}
.action-link {
  display: flex;
  align-items: center;
  gap: 7px;
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 7px 12px;
  border-radius: 8px;
  transition: all 0.18s;
}
.action-link:hover {
  color: #fff;
}
.action-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.12);
  color: #fff;
}
.btn-logout {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: color 0.18s;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
  font-weight: 500;
}
.btn-logout:hover {
  color: #fff;
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 4px;
}
.mobile-menu {
  display: none;
}
.mobile-link {
  display: block;
  color: #fff;
  text-decoration: none;
  padding: 12px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-weight: 500;
}
.mobile-link.mobile-logout {
  background: transparent;
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  text-align: left;
  width: 100%;
  cursor: pointer;
  color: #fca5a5;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 980px) {
  .nav {
    display: none;
  }
  .action-link span,
  .action-link {
    display: none;
  }
  .btn-logout {
    display: none;
  }
  .mobile-toggle {
    display: flex;
  }
  .container {
    height: 64px;
  }
  .logo-icon {
    width: 50px;
    height: 50px;
  }
  .mobile-menu {
    display: flex;
    flex-direction: column;
    background: #1e293b;
  }
}
</style>
