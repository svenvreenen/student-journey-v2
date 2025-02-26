import { defineStore } from 'pinia'

export interface AuthState {
  token: string | null
  user: any | null
  error: string | null
}

interface AuthResponse {
  data?: {
    access_token: string
    refresh_token?: string
  }
  errors?: any
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('auth_token') || null,
    user: null,
    error: null,
  }),
  
  getters: {
    isAuthenticated(): boolean {
      return !!this.token
    },
  },
  
  actions: {
    async login(email: string, password: string) {
      try {
        this.error = null
        const response = await fetch('https://student-journey-back-bxovn.ondigitalocean.app/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })

        const result = await response.json() as AuthResponse

        if (!response.ok) {
          throw new Error(result.errors?.[0]?.message || 'Authentication failed')
        }

        if (result.data?.access_token) {
          this.token = result.data.access_token
          localStorage.setItem('auth_token', this.token)
          return true
        }

        throw new Error('No access token received')
      } catch (err) {
        console.error('Login failed:', err)
        this.error = err instanceof Error ? err.message : 'Authentication failed'
        return false
      }
    },
    
    logout() {
      this.token = null
      localStorage.removeItem('auth_token')
      this.user = null
    },
    
    // Optionally add a method to fetch user profile
    async fetchUserProfile() {
      if (!this.token) return null
      
      try {
        // Implement user profile fetching
        // const response = await fetch('your-api/me', {
        //   headers: { Authorization: `Bearer ${this.token}` }
        // })
        // this.user = await response.json()
      } catch (error) {
        console.error('Failed to fetch user profile', error)
      }
    }
  }
}) 
