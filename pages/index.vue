<template>
  <div class="max-w-4xl mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Students</h1>
      <button 
        @click="refresh" 
        class="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Refresh
      </button>
    </div>
    
    <div v-if="pending" class="p-4 text-gray-500 bg-gray-50 rounded-lg">
      <div class="flex items-center justify-center">
        <div class="animate-spin mr-2">⚡</div>
        Loading students...
      </div>
    </div>
    
    <div v-else-if="error" class="p-4 text-red-500 bg-red-50 rounded-lg">
      <div class="flex items-center">
        ⚠️ {{ error.message }}
      </div>
    </div>
    
    <div v-else-if="!data?.length" class="p-4 text-gray-500 bg-gray-50 rounded-lg">
      No students found
    </div>
    
    <div v-else class="grid gap-4 md:grid-cols-2">
      <div 
        v-for="student in data" 
        :key="student.id" 
        class="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
        @click="navigateToStudent(student)"
      >
        <h3 class="font-semibold text-lg">{{ student.name }}</h3>
        <p class="text-gray-600">Student number: {{ student.studentNumber }}</p>
        <p class="text-gray-600">Class: {{ student.klas }}</p>
      </div>
    </div>

    <!-- Debug info -->
    <div class="mt-4 p-4 bg-gray-100 rounded">
      <p>Token exists: {{ hasToken }}</p>
      <p>Loading: {{ pending }}</p>
      <p>Error: {{ error?.message || 'None' }}</p>
      <p>Data length: {{ data?.length || 0 }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: ['auth']
})

const { token } = useAuth()
const hasToken = computed(() => !!token?.value)

const { data, error, pending, refresh } = await useAsyncData(
  'students',
  async () => {
    console.log('Fetching students, token exists:', hasToken.value)
    if (!hasToken.value) {
      console.log('No token available')
      return []
    }
    
    try {
      // Simplified fields query with wildcards
      const fields = [
        '*',
        'cijfers.*',
        'cijfers.student_subject_period_id.*',
        'cijfers.student_subject_period_id.subject_period.*',
        'cijfers.student_subject_period_id.subject_period.vak.*'
      ].join(',')

      const response = await fetch(
        `https://student-journey-back-bxovn.ondigitalocean.app/items/students?fields=${fields}`, {
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch students (${response.status})`)
      }
      
      const result = await response.json()
      console.log('Full student data:', result)
      return result.data
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

// Log token changes
watch(token, (newToken) => {
  console.log('Token changed:', !!newToken)
  if (newToken) refresh()
})

// Log initial token value
onMounted(() => {
  console.log('Component mounted, token exists:', hasToken.value)
})
</script> 
