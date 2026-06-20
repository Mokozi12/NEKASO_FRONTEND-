<template>
  <header class="header-public">
    <div class="header-container">
      
      <router-link to="/" class="logo" @click="handleLogoClick">
        <img src="/logo-nekaso.png?v=2" alt="NEKASO" class="logo-icon" />
      </router-link>

      
      <nav class="nav-centre">
        <router-link to="/" class="nav-pill">Accueil</router-link>
      </nav>

      
      <div class="header-actions">
        <router-link to="/login" class="btn-login">Se connecter</router-link>
      </div>

      
      <button class="mobile-toggle" @click="mobileOpen = !mobileOpen" aria-label="Menu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line v-if="!mobileOpen" x1="3" y1="6" x2="21" y2="6" />
          <line v-if="!mobileOpen" x1="3" y1="12" x2="21" y2="12" />
          <line v-if="!mobileOpen" x1="3" y1="18" x2="21" y2="18" />
          <path v-if="mobileOpen" d="M18 6 6 18" />
          <path v-if="mobileOpen" d="m6 6 12 12" />
        </svg>
      </button>
    </div>

    
    <Transition name="slide">
      <div v-if="mobileOpen" class="mobile-menu">
        <router-link to="/" class="mobile-link" @click="mobileOpen = false"
          >Accueil</router-link
        >
        <router-link to="/login" class="mobile-link" @click="mobileOpen = false"
          >Se connecter</router-link
        >
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const mobileOpen = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const handleLogoClick = () => {
  if (authStore.isAuthenticated && authStore.user?.role === 'LOCATAIRE') {
    router.push('/locataire/accueil')
    return
  }
  router.push('/')
}
</script>

<style scoped>
.header-public {
  background-color: #1e293b;
  color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 900;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}


.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #ffffff;
  flex-shrink: 0;
  min-width: 96px;
}

.logo-icon {
  width: 78px;
  height: 78px;
  object-fit: contain;
  display: block;
}


.nav-centre {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.nav-pill {
  display: inline-block;
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 22px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  transition: all 0.2s;
}

.nav-pill:hover {
  background-color: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.5);
}


.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-partner {
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  transition: all 0.2s;
}

.btn-partner:hover {
  color: #ffffff;
}

.btn-login {
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 18px;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-login:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.btn-signup {
  background-color: #22c55e;
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 9px 22px;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-signup:hover {
  background-color: #16a34a;
}


.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 4px;
}

.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 12px 24px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.mobile-link {
  color: #ffffff;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.mobile-link.mobile-signup {
  color: #22c55e;
  border-bottom: none;
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

@media (max-width: 768px) {
  .nav-centre,
  .header-actions {
    display: none;
  }

  .mobile-toggle {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }
}
</style>
