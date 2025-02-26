<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto p-6">
      <!-- Header Section with more login-like styling -->
      <div class="mb-10 text-center bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 class="text-4xl font-bold mb-4 font-heading text-indigo-900">IBS - Student Progress</h1>
        <div class="w-24 h-1 bg-indigo-600 mx-auto mb-6 rounded-full"></div>
        <p class="text-gray-600 font-body max-w-2xl mx-auto">Een start project om meer inzicht te krijgen voor de student.</p>
      </div>
      
      <!-- Action Bar -->
      <div class="bg-white rounded-xl shadow-md p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Class filter -->
        <div class="flex-1 w-full">
          <div class="relative">
            <select 
              id="classFilter" 
              v-model="selectedClass" 
              class="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-body py-3 pl-4 pr-10 appearance-none bg-gray-50"
            >
              <option value="">Alle klassen</option>
              <option v-for="klas in availableClasses" :key="klas" :value="klas">{{ klas }}</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Sign Out button -->
        <button 
          @click="handleSignOut" 
          class="px-6 py-3 font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-body flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Uitloggen
        </button>
      </div>
      
      <!-- Loading State -->
      <div v-if="pending || isRefreshing" class="p-10 text-gray-500 bg-gray-50 rounded-xl shadow-sm">
        <div class="flex flex-col items-center justify-center">
          <div class="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
          <p class="font-body text-lg">Loading students...</p>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="p-6 text-red-600 bg-red-50 rounded-xl shadow-sm border border-red-100">
        <div class="flex items-center">
          <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="font-body text-lg">{{ error.message }}</p>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="!filteredStudents.length" class="p-10 text-gray-600 bg-gray-50 rounded-xl shadow-sm text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
        <p class="font-body text-xl">Geen studenten gevonden</p>
      </div>
      
      <!-- Student Cards -->
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="student in filteredStudents" 
          :key="student.id" 
          class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer transform hover:-translate-y-1 duration-300"
          @click="navigateToStudent(student)"
        >
          <div class="h-24 bg-gradient-to-r from-indigo-500 to-indigo-700 relative">
            <!-- Student Image -->
            <div class="absolute -bottom-10 left-6">
              <div v-if="student.image" class="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                <img 
                  :src="`${runtimeConfig.public.directusUrl}/assets/${student.image}`" 
                  :alt="`Photo of ${student.name}`"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div v-else class="w-20 h-20 rounded-full border-4 border-white shadow-md bg-indigo-100 flex items-center justify-center text-indigo-500 font-heading text-2xl font-bold">
                {{ student.name ? student.name.charAt(0) : '?' }}
              </div>
            </div>
          </div>
          
          <div class="p-6 pt-12">
            <h3 class="font-bold text-xl mb-3 font-heading text-indigo-900">{{ student.name }}</h3>
            <div class="flex items-center text-gray-600 mb-2">
              <svg class="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
              </svg>
              <span class="font-body">{{ student.studentNumber }}</span>
            </div>
            <div class="flex items-center text-gray-600">
              <svg class="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <span class="font-body">{{ student.klas.klas_naam }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Debug info (can be removed in production) -->
      <div v-if="false" class="mt-8 p-4 bg-gray-100 rounded-lg">
        <p>Token exists: {{ hasToken }}</p>
        <p>Loading: {{ pending }}</p>
        <p>Error: {{ error?.message || 'None' }}</p>
        <p>Data length: {{ data?.length || 0 }}</p>
        <p>Filtered students: {{ filteredStudents.length }}</p>
        <p>Selected class: {{ selectedClass || 'All' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useDirectus } from '~/composables/useDirectus'

definePageMeta({
  middleware: ['auth']
})

const runtimeConfig = useRuntimeConfig()
const { token, isAuthenticated, logout } = useAuth()
const hasToken = computed(() => !!token?.value)

// Filtering state
const selectedClass = ref('')

// Use Directus SDK instead of fetch
const { directus, getStudents } = useDirectus()

// Track loading state manually to handle refresh button
const isRefreshing = ref(false)

// Handle sign out function
async function handleSignOut() {
  try {
    await logout()
    router.push('/login')
  } catch (err) {
    console.error('Logout failed:', err)
  }
}

// Custom refresh function
async function handleRefresh() {
  try {
    isRefreshing.value = true
    await refresh()
    console.log('Data refreshed successfully')
  } catch (err) {
    console.error('Refresh failed:', err)
  } finally {
    isRefreshing.value = false
  }
}

const { data, error, pending, refresh } = await useAsyncData(
  'students',
  async () => {
    if (!hasToken.value) {
      console.log('No token available')
      throw new Error('Authentication required')
    }
    
    try {
      // Use the Directus SDK helper method
      const result = await getStudents()
      console.log('Students data:', result); // Log the response structure
      
      // Our updated direct fetch implementation returns a different structure
      // Handle both the Directus SDK and direct fetch formats
      if (result.data) {
        return result.data;
      } else if (result && Array.isArray(result)) {
        return result;
      } else {
        return [];
      }
    } catch (err) {
      console.error('Fetch error:', err)
      throw err
    }
  },
  {
    watch: [token],
    default: () => []
  }
)

const router = useRouter()

function navigateToStudent(student) {
  router.push(`/student/${student.id}`)
}

// Get unique classes from student data
const availableClasses = computed(() => {
  if (!data.value) return []
  
  const classes = new Set(data.value.map(student => student.klas.klas_naam))
  return [...classes].sort()
})

// Apply filters to students
const filteredStudents = computed(() => {
  if (!data.value) return []
  
  // Filter by selected class if any
  return selectedClass.value 
    ? data.value.filter(student => student.klas.klas_naam === selectedClass.value)
    : [...data.value]
})

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

// Make sure we're using the directusUrl from the runtime config
const apiBaseUrl = computed(() => {
  return runtimeConfig.public.directusUrl || 'https://student-journey-back-bxovn.ondigitalocean.app'
})
</script> 
