<!--
  GestionnaireLayout est le "cadre" de toutes les pages gestionnaire.
  Il contient la sidebar à gauche et le header en haut.
  Au milieu, RouterView affiche la page correspondant à l'URL.
  
  Quand tu navigues de Dashboard vers Biens, seul le contenu
  de RouterView change. La sidebar et le header restent en place.
  C'est ça la magie du layout partagé.
-->
<template>
  <div class="layout">
    <!-- La barre latérale de navigation -->
    <SidebarGestionnaire />

    <!-- La zone de contenu principal (header + page) -->
    <div class="layout-contenu">
      <!-- La barre du haut avec le titre et les infos utilisateur -->
      <HeaderGestionnaire />

      <!-- La page actuelle (change selon l'URL) -->
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
/*
  "scoped" signifie que ces styles ne s'appliquent qu'à ce composant.
  Ils ne "fuient" pas vers les composants enfants ou parents.
  C'est une fonctionnalité très pratique de Vue.js.
*/
.layout {
  display: flex; /* Sidebar et contenu côte à côte */
  min-height: 100vh; /* Toute la hauteur de l'écran */
}

.layout-contenu {
  flex: 1; /* Prend tout l'espace restant après la sidebar */
  display: flex;
  flex-direction: column; /* Header en haut, page en dessous */
  margin-left: var(--sidebar-largeur); /* 260px, laisse de la place pour la sidebar */
  min-height: 100vh;
}

.layout-main {
  flex: 1;
  padding: 24px 28px 32px;
  background-color: var(--fond-general);
  overflow-y: auto;
}
</style>
