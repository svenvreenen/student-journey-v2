<template>
  <div class="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl">
    <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-600 font-heading">
      <component :is="icon" class="w-5 h-5" />
      {{ title }}
    </h2>
    
    <!-- Progress Bar -->
    <div class="mb-4">
      <div class="flex justify-between text-sm mb-1">
        <span class="font-medium text-gray-600">{{ progress }} / {{ maxValue }} punten behaald</span>
        <span class="font-medium" :class="progressPercentage >= requiredPercentage ? 'text-green-600' : 'text-amber-600'">
          {{ progressPercentage.toFixed(1) }}%
        </span>
      </div>
      
      <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div 
          class="h-2.5 rounded-full transition-all duration-300" 
          :class="progressPercentage >= requiredPercentage ? 'bg-green-500' : 'bg-amber-500'"
          :style="{ width: `${Math.min(progressPercentage, 100)}%` }"
        ></div>
      </div>
      
      <div class="text-xs text-gray-500 mt-1">
        <span v-if="progressPercentage < requiredPercentage">
          Je hebt nog {{ (maxValue * (requiredPercentage/100)) - progress }} punten nodig ({{ requiredPercentage }}%)
        </span>
        <span v-else>
          Gefeliciteerd! Je hebt voldoende punten behaald.
        </span>
      </div>
    </div>
    
    <!-- Subjects List - Revised layout with points below the subject name -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4" v-if="subjects && subjects.length > 0">
      <h3 class="font-medium text-gray-700 mb-2 col-span-2">Vakken en studiepunten:</h3>
      <div 
        v-for="subject in subjects" 
        :key="subject.id" 
        class="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-indigo-50 transition-colors duration-200"
      >
        <div class="flex justify-between items-start">
          <div>
            <div class="font-medium text-gray-700">{{ subject.name }}</div>
            <div class="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <span>{{ subject.period }}</span>
              <span class="text-gray-500">{{ subject.credits }} punten</span>
            </div>
          </div>
          <div v-if="isSubjectPassed(subject)" class="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">
            Behaald
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import SubjectCard from './SubjectCard.vue';
import StatusBar from './StatusBar.vue';
import { Star, TrendingUp } from 'lucide-vue-next';

const props = defineProps({
  title: String,
  icon: String,
  progress: Number,
  progressKey: String,
  subjects: Array
})

// Get the student data from parent
const student = inject('student')

const maxValue = computed(() => {
  if (!student.value) return 0
  return props.progressKey === 'VSA' 
    ? student.value.VSA.max 
    : student.value.BSA.max
})

const requiredPercentage = computed(() => {
  if (!student.value) return 70
  return props.progressKey === 'VSA'
    ? (student.value.VSA.required / student.value.VSA.max) * 100
    : (student.value.BSA.required / student.value.BSA.max) * 100
})

const progressPercentage = computed(() => {
  if (maxValue.value === 0) return 0
  return (props.progress / maxValue.value) * 100
})

// Add function to check if a subject is passed
const isSubjectPassed = (subject) => {
  if (!student.value || !student.value.grades) return false
  
  const grade = student.value.grades.find(g => 
    g.name === subject.name && 
    `OP${g.op}` === subject.period
  )
  
  if (!grade || !grade.grade) return false
  
  if (grade.gradeType === 'level') {
    return ['V', 'G'].includes(grade.grade)
  } else {
    return grade.grade >= 5.5
  }
}
</script>
