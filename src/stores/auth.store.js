import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {

  const token = ref(localStorage.getItem('nekaso_token') || null)
  const user  = ref(JSON.parse(localStorage.getItem('nekaso_user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)
  const nomComplet = computed(() =>
    user.value ? `${user.value.prenom} ${user.value.nom}` : ''
  )
  const isGestionnaire = computed(() => user.value?.role === 'GESTIONNAIRE')

  // ✅ CORRIGÉ : telephone (pas email) — selon le contrat API NEKASO
  async function login(telephone, motDePasse) {
    const res = await authService.login({ telephone, motDePasse })
    token.value = res.data.token
    user.value  = res.data.user
    localStorage.setItem('nekaso_token', token.value)
    localStorage.setItem('nekaso_user', JSON.stringify(user.value))
  }

  function logout() {
    token.value = null
    user.value  = null
    localStorage.removeItem('nekaso_token')
    localStorage.removeItem('nekaso_user')
  }

  return { token, user, isAuthenticated, nomComplet, isGestionnaire, login, logout }
})
