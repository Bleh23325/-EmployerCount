import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
  }),

  actions: {
    async login(credentials, rememberMe = false) {
      this.loading = true
      try {
        const response = await api.post('/auth-sessions/login', credentials)
        if (response.accessToken) {
          if (rememberMe) {
            api.setAuthToken(response.accessToken)
          } else {
            sessionStorage.setItem('accessToken', response.accessToken)
          }

          this.isAuthenticated = true
          this.user = response.user
        }
        return response
      } catch (error) {
        console.error('Login error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      try {
        const response = await api.post('/auth-sessions', userData)
        return response
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    checkAuth() {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
      if (token) {
        this.isAuthenticated = true
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('accessToken')
      sessionStorage.removeItem('accessToken')
    },
  },
})
