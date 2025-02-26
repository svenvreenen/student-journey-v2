import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

interface AuthResponse {
  data?: {
    access_token: string
    refresh_token?: string
  }
  errors?: any
}

export const useAuth = () => {
  const authStore = useAuthStore()
  
  // For backward compatibility, expose the same API
  return {
    token: computed(() => authStore.token),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    error: computed(() => authStore.error),
    login: authStore.login,
    logout: authStore.logout
  }
} 
