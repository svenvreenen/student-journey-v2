<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 class="mt-2 text-center text-3xl font-bold font-heading text-indigo-900">
          Sign in to your account
        </h2>
        <div class="w-24 h-1 bg-indigo-600 mx-auto my-6 rounded-full"></div>
        
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">Email address</label>
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                required
                class="appearance-none font-body rounded-t-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                required
                class="appearance-none font-body rounded-b-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div v-if="error" class="text-red-500 text-sm text-center font-body bg-red-50 p-3 rounded-lg">
            {{ error }}
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-body transition-colors duration-200"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </span>
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>

        <div v-if="isDev" class="mt-6 text-sm text-gray-500 font-body p-3 bg-gray-50 rounded-lg">
          <p>Current route: {{ route.fullPath }}</p>
          <p>Has token: {{ hasToken }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const router = useRouter()
const route = useRoute()
const { login, token } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const hasToken = computed(() => !!token?.value)
const isDev = computed(() => process.env.NODE_ENV === 'development')

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    
    console.log('Attempting login...')
    const success = await login(email.value, password.value)
    
    if (success) {
      console.log('Login successful, redirecting...')
      const redirect = route.query.redirect?.toString() || '/'
      await router.push(redirect)
    } else {
      error.value = 'Invalid credentials'
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = 'An error occurred during login'
  } finally {
    loading.value = false
  }
}

// Add Google Fonts to the page
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap'
    }
  ],
  style: [
    {
      children: `
        .font-heading { font-family: 'Montserrat', sans-serif; }
        .font-body { font-family: 'Poppins', sans-serif; }
      `
    }
  ]
})
</script> 
