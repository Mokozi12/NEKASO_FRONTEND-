<template>
  <!--
    RouterView est comme un écran vide.
    Quand l'URL est /login, Vue Router affiche LoginView ici.
    Quand l'URL est /gestionnaire/dashboard, il affiche DashboardView.
    C'est la magie du routing en SPA.
  -->
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>
