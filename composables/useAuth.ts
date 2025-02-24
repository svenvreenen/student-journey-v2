import { ref, computed } from 'vue'

interface AuthResponse {
  data?: {
    access_token: string
    refresh_token?: string
  }
  errors?: any
}

export const useAuth = () => {
  const token = useState<string | null>('auth_token', () => null)
  const isAuthenticated = computed(() => !!token.value)
  const error = ref<string | null>(null)

  const login = async (email: string, password: string) => {
    try {
      error.value = null
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
        token.value = result.data.access_token
        return true
      }

      throw new Error('No access token received')
    } catch (err) {
      console.error('Login failed:', err)
      error.value = err instanceof Error ? err.message : 'Authentication failed'
      return false
    }
  }

  const logout = () => {
    token.value = null
  }

  return { token, isAuthenticated, login, logout, error }
} 
