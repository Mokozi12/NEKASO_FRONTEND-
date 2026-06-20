<template>
  <div class="layout">
    
    <SidebarGestionnaire />

    
    <div class="layout-contenu">
      
      <HeaderGestionnaire />

      
      <main class="layout-main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import SidebarGestionnaire from './SidebarGestionnaire.vue'
import HeaderGestionnaire from './HeaderGestionnaire.vue'
</script>

<style scoped>

.layout {
  display: flex; 
  min-height: 100vh; 
}

.layout-contenu {
  flex: 1; 
  display: flex;
  flex-direction: column; 
  margin-left: var(--sidebar-largeur); 
  min-height: 100vh;
}

.layout-main {
  flex: 1;
  padding: 24px 28px 32px;
  background-color: var(--fond-general);
  overflow-y: auto;
}
</style>
