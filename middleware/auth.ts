import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.token
  
  console.log('Auth middleware: checking route', to.path, 'token exists:', isAuthenticated)
  
  // Allow access to login page
  if (to.path === '/login') {
    // Redirect to home if already authenticated
    if (isAuthenticated) {
      console.log('Already authenticated, redirecting to home')
      return navigateTo('/')
    }
    return
  }
  
  // If no token, redirect to login
  if (!isAuthenticated) {
    console.log('No token found, redirecting to login')
    return navigateTo('/login', { 
      replace: true
    })
  }
  
  try {
    // Verify token validity if needed (optional)
    // You could make a lightweight API call here to validate the token
    return
  } catch (error) {
    console.error('Token validation failed:', error)
    // Clear invalid token
    authStore.logout()
    // Redirect to login
    return navigateTo('/login', { replace: true })
  }
}) 
