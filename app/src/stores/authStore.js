import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
  }),

  actions: {
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
