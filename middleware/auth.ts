import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { token } = useAuth()
  const hasToken = computed(() => !!token?.value)
  
  console.log('Auth middleware: checking route', to.path, 'token exists:', hasToken.value)
  
  // Allow access to login page
  if (to.path === '/login') {
    // Redirect to home if already authenticated
    if (hasToken.value) {
      console.log('Already authenticated, redirecting to home')
      return navigateTo('/')
    }
    return
  }
  
  // Redirect to login if not authenticated
  if (!hasToken.value) {
    console.log('No token found, redirecting to login')
    return navigateTo('/login', { 
      replace: true,
      query: { redirect: to.fullPath }
    })
  }
}) 
