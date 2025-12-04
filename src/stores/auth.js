import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Cookies from 'js-cookie'
import { authApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(Cookies.get('adminToken') || null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.role === 'superadmin')
  const isModerator = computed(() => user.value?.role === 'moderator' || isAdmin.value)
  const isSuperAdmin = computed(() => user.value?.role === 'superadmin')

  async function login(credentials) {
    try {
      const response = await authApi.login(credentials)
      token.value = response.token
      user.value = response.user
      console.log("store: ",user.value);
      
      // Save token to cookie
      Cookies.set('adminToken', response.token, {
        expires: 365,
        secure: false,
        sameSite: 'lax',
      })

      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(response.user))
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    try {
      await authApi.logout()
      token.value = null
      user.value = null
      Cookies.remove('adminToken')
      localStorage.removeItem('user')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      
    }
  }

  async function fetchCurrentUser() {
    try {
      const response = await authApi.getCurrentUser()
      user.value = response
      localStorage.setItem('user', JSON.stringify(response))
      return response
    } catch (error) {
      // If fetch fails, clear auth
      token.value = null
      user.value = null
      Cookies.remove('adminToken')
      localStorage.removeItem('user')
      throw error
    }
  }

  function loadUserFromStorage() {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        user.value = JSON.parse(stored)
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('user')
        user.value = null
      }
    }
  }

  // Initialize user from storage on store creation
  loadUserFromStorage()

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isModerator,
    isSuperAdmin,
    login,
    logout,
    fetchCurrentUser,
    loadUserFromStorage,
  }
})

