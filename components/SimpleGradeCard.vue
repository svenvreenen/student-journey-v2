<template>
  <div class="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
    <!-- Header section with ROC gradient -->
    <div class="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-8 text-white relative overflow-hidden">
      <div class="relative z-10">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2 tracking-tight">{{ student.name }}</h1>
            <p class="text-blue-100 flex items-center gap-2">
              Studentnummer: {{ student.studentId }}
            </p>
          </div>
          <img 
            :src="student.photoUrl || '/placeholder-avatar.jpg'" 
            :alt="student.name" 
            class="w-24 h-24 rounded-full border-4 border-white/50 shadow-lg object-cover"
          >
        </div>
      </div>
    </div>

    <!-- Content section -->
    <div class="p-8 space-y-8 bg-gray-50">
      <!-- Debug information -->
      <div class="bg-white p-6 rounded-xl shadow-md">
        <h2 class="text-xl font-bold mb-4">Debug Information</h2>
        <div class="grid grid-cols-1 gap-2">
          <div class="p-2 bg-gray-100 rounded">
            <strong>Presence Data:</strong>
            <div v-for="(data, period) in student.presence" :key="period">
              {{ period }}: {{ data.attendance }}% (required: {{ data.required }}%)
            </div>
          </div>
          
          <div class="p-2 bg-gray-100 rounded">
            <strong>VSA Progress:</strong> Current {{ vsaProgress.earned }}/{{ vsaProgress.total }} ({{ vsaProgress.percentage.toFixed(1) }}%)
          </div>
          
          <div class="p-2 bg-gray-100 rounded">
            <strong>BSA Progress:</strong> Current {{ bsaProgress.earned }}/{{ bsaProgress.total }} ({{ bsaProgress.percentage.toFixed(1) }}%)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  student: {
    type: Object,
    required: true
  }
});

// Simplified calculation functions
const calculateProgress = (type) => {
  try {
    const grades = props.student.grades.filter(g => g.type === type);
    let earned = 0;
    let total = type === 'VSA' ? props.student.VSA.max : props.student.BSA.max;
    
    grades.forEach(grade => {
      const subject = props.student.subjects.find(s => 
        s.name === grade.name && 
        s.period === `OP${grade.op}`
      );
      
      if (subject && grade.grade) {
        if (grade.gradeType === 'level') {
          if (['V', 'G'].includes(grade.grade)) {
            earned += subject.credits;
          }
        } else if (grade.grade >= 5.5) {
          earned += subject.credits;
        }
      }
    });
    
    return {
      earned,
      total,
      percentage: (earned / total) * 100
    };
  } catch (error) {
    console.error('Error in calculateProgress:', error);
    return {
      earned: 0,
      total: 100,
      percentage: 0
    };
  }
};

const vsaProgress = computed(() => calculateProgress('VSA'));
const bsaProgress = computed(() => calculateProgress('BSA'));
</script>
