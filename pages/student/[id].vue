<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto p-6">
      <!-- Back Button -->
      <div class="mb-6">
        <button 
          @click="router.back()" 
          class="px-4 py-2 bg-white rounded-lg shadow-sm text-indigo-600 hover:text-indigo-800 hover:shadow flex items-center gap-2 font-body"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Terug naar studenten
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="p-10 text-gray-500 bg-white rounded-xl shadow-md">
        <div class="flex flex-col items-center justify-center">
          <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
          <p class="font-body text-lg">Student gegevens laden...</p>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="p-6 text-red-600 bg-red-50 rounded-xl shadow-md border border-red-100">
        <div class="flex items-center">
          <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="font-body text-lg">{{ error.message }}</p>
        </div>
      </div>
      
      <!-- Student Data -->
      <template v-else-if="studentData">
        <GradeCard
          :student="studentData"
          @update:student="(newValue) => studentData = newValue"
        />
      </template>

      <!-- No Data State -->
      <div v-else class="p-10 text-gray-600 bg-white rounded-xl shadow-md text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
        <p class="font-body text-xl">Geen student gegevens beschikbaar</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide, watch } from 'vue'
import gradesData from '@/data/resultaten.json'
import { useDirectus } from '~/composables/useDirectus'
import GradeCard from '~/components/GradeCard.vue'
import { ClipboardList, LineChart, Star, GraduationCap, CalendarDays, MessageCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { token } = useAuth()

// Define VSA credits mapping at the top level
const vsaCredits = {
  'Unit 13M: Market Research': { OP1: 10, OP2: 10 },
  'Bedrijfseconomie': { OP1: 10, OP2: 10 },
  'Online Marketingplan': { OP2: 10 },
  'Beroepshouding': { OP1: 10, OP2: 10 },
  'Marketing: Customer Journey': { OP1: 10, OP2: 30 }
};

// Create refs for data
const directusData = ref(null)
const error = ref(null)
const pending = ref(true)
const studentData = ref(null)

// Fetch data in an async function
const fetchData = async () => {
  if (!token.value) {
    console.log('No token available, skipping fetch')
    return
  }

  try {
    pending.value = true
    const response = await fetch(
      `${useRuntimeConfig().public.directusUrl}/items/students/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch student (${response.status})`)
    }

    const result = await response.json()
    directusData.value = result.data
    
    // Process student data after fetching
    processStudentData()
  } catch (err) {
    console.error('Error fetching student data:', err)
    error.value = err
  } finally {
    pending.value = false
  }
}

// Get grades from JSON using studentNumber from Directus data
const studentGrades = computed(() => {
  if (!directusData.value?.studentNumber) {
    console.log('No student number available from Directus')
    return null
  }
  console.log('Looking for student with number:', directusData.value.studentNumber)
  console.log('Available students:', gradesData.map(s => s.studentNumber))
  return gradesData.find(s => s.studentNumber === directusData.value.studentNumber)
})

// Add these transformation functions
function transformSubjects(grades) {
  if (!grades) return []
  
  const uniqueSubjects = new Map()
  
  grades.forEach(grade => {
    const subjectName = grade.subject.replace(/ P[1-4]$/, '')
    const period = grade.subject.slice(-1)
    const credits = vsaCredits[subjectName]?.[`OP${period}`] || 0
    
    const subjectKey = `${subjectName}-OP${period}`
    uniqueSubjects.set(subjectKey, {
      id: subjectKey,
      name: subjectName,
      credits: credits,
      period: `OP${period}`
    })
  })
  
  return Array.from(uniqueSubjects.values())
}

function transformGrades(grades) {
  if (!grades) return []
  
  return grades.map(grade => {
    const subjectName = grade.subject.replace(/ P[1-4]$/, '')
    const period = parseInt(grade.subject.slice(-1))
    const isVSA = vsaCredits[subjectName]?.[`OP${period}`] > 0
    
    return {
      name: subjectName,
      op: period,
      type: isVSA ? 'VSA' : 'BSA',
      gradeType: /[OVG]/.test(grade.grade) ? 'level' : 'numeric',
      grade: grade.grade ? (
        /[OVG]/.test(grade.grade) 
          ? grade.grade
          : parseFloat(grade.grade.replace(',', '.'))
      ) : null
    }
  })
}

// Create a function to process student data
function processStudentData() {
  if (!studentGrades.value || !directusData.value) {
    console.log('Missing data for transformation')
    return
  }

  // Calculate VSA and BSA totals
  const vsaTotal = Object.values(vsaCredits).reduce((sum, periods) => 
    sum + Object.values(periods).reduce((a, b) => a + b, 0), 0)
  
  const bsaTotal = vsaTotal * 1.5 // Assuming BSA is 150% of VSA requirements

  const transformed = {
    name: studentGrades.value.name,
    studentId: studentGrades.value.studentNumber,
    photoUrl: directusData.value.image 
      ? `${useRuntimeConfig().public.directusUrl}/assets/${directusData.value.image}`
      : null,
    presence: {
      OP1: { attendance: parseInt(directusData.value.attendance_op1) || 0, required: 80 },
      OP2: { attendance: parseInt(directusData.value.attendance_op2) || 0, required: 80 },
      OP3: { attendance: parseInt(directusData.value.attendance_op3) || 0, required: 80 },
      OP4: { attendance: 0, required: 80 }
    },
    mentorMessages: {
      vsa: directusData.value.mentor_message_vsa || 'Geen bericht beschikbaar',
      bsa: directusData.value.mentor_message_bsa || 'Geen bericht beschikbaar'
    },
    subjects: transformSubjects(studentGrades.value.grades),
    grades: transformGrades(studentGrades.value.grades),
    VSA: {
      max: vsaTotal,
      current: 0, // Will calculate below
      required: vsaTotal * 0.7 // 70% is typically required for passing
    },
    BSA: {
      max: bsaTotal,
      current: 0, // Will calculate below
      required: bsaTotal * 0.7 // 70% is typically required for passing
    }
  }

  // Calculate VSA and BSA earned credits
  const grades = transformed.grades
  let vsaEarned = 0
  let bsaEarned = 0
  
  grades.forEach(grade => {
    const subject = transformed.subjects.find(s => 
      s.name === grade.name && 
      s.period === `OP${grade.op}`
    )
    
    if (subject && grade.grade) {
      if (grade.gradeType === 'level') {
        if (['V', 'G'].includes(grade.grade)) {
          if (grade.type === 'VSA') vsaEarned += subject.credits
          bsaEarned += subject.credits
        }
      } else if (grade.grade >= 5.5) {
        if (grade.type === 'VSA') vsaEarned += subject.credits
        bsaEarned += subject.credits
      }
    }
  })
  
  transformed.VSA.current = vsaEarned
  transformed.BSA.current = bsaEarned
  
  console.log('Transformed student data:', transformed)
  studentData.value = transformed
}

// Fetch data when component mounts
onMounted(() => {
  fetchData()
})

// Watch for token changes
watch(token, () => {
  if (token.value) fetchData()
})

const vsaProgress = computed(() => calculateProgress('VSA'));
const bsaProgress = computed(() => calculateProgress('BSA'));

// Provide the student data to child components
provide('student', studentData);

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
