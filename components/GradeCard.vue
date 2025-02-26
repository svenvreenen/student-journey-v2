<template>
  <div v-if="!student" class="p-4 text-gray-500 bg-gray-50 rounded-lg">
    No student data available
  </div>
  <div v-else class="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
    <!-- Header section with new gradient -->
    <div class="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 p-8 text-white relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-y-20 translate-x-20"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full translate-y-16 -translate-x-16"></div>
      
      <!-- Static decorative elements instead of animated emojis -->
      <div class="absolute top-4 right-4 opacity-20">
        <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18v-3.957l1.818.78a3 3 0 002.364 0l2.818-1.208V18a1 1 0 01-1 1H7a1 1 0 01-1-1z"></path>
        </svg>
      </div>
      
      <div class="relative z-10">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2 tracking-tight font-heading">{{ student.name }}</h1>
            <p class="text-indigo-100 flex items-center gap-2 font-body">
              <GraduationCap class="w-4 h-4" />
              Studentnummer: {{ student.studentId }}
            </p>
          </div>
          <img 
            :src="student.photoUrl || '/placeholder-avatar.jpg'" 
            :alt="student.name" 
            class="w-24 h-24 rounded-full border-4 border-white/50 shadow-lg object-cover hover:scale-105 transition-transform duration-300"
          >
        </div>
      </div>
    </div>

    <!-- Content section -->
    <div class="p-8 space-y-8 bg-gray-50">
      <!-- Attendance section -->
      <div class="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-600 font-heading">
          <CalendarDays class="w-5 h-5" /> 
          Aanwezigheid Overzicht
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="(data, op) in filteredPresence" 
            :key="op" 
            class="p-4 bg-white rounded-lg shadow-md border border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:translate-y-[-2px]"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium font-body">{{ op }}</span>
              <span :class="data.attendance >= data.required ? 'text-indigo-600' : 'text-amber-500'" class="font-body">
                {{ data.attendance }}%
              </span>
            </div>
            <StatusBar :value="data.attendance" :max="100" type="presence" />
          </div>
        </div>
      </div>

      <!-- Mentor Message - shows based on currentTab -->
      <div class="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-600 font-heading">
          <MessageCircle class="w-5 h-5" />
          Bericht van je mentor bij {{ currentTab.toUpperCase() }}
        </h2>
        <p class="text-gray-600 bg-gray-50 p-4 rounded-lg font-body">
          {{ student.mentorMessages[currentTab] }}
        </p>
      </div>

      <!-- Tabs Navigation with fancy active state -->
      <div class="bg-white rounded-xl shadow-md p-1 overflow-hidden">
        <nav class="flex space-x-2" aria-label="Voortgang Tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.key"
            @click="currentTab = tab.key"
            :class="[
              'flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 font-body',
              currentTab === tab.key 
                ? 'bg-indigo-600 text-white shadow-md transform scale-105' 
                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <component :is="tab.icon" class="w-4 h-4" />
              {{ tab.label }}
            </div>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div v-if="currentTab === 'vsa'" class="space-y-6">
        <!-- VSA Progress Section -->
        <ProgressSection 
          title="Weg naar VSA (OP1-OP2)" 
          icon="Star" 
          :progress="vsaProgress.earned" 
          progress-key="VSA" 
          :subjects="getVSASubjects()" 
          class="hover:translate-y-[-2px] transition-transform duration-300"
        />
        
        <!-- VSA Grades Grid -->
        <div v-for="op in [1, 2]" :key="op" class="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-600 font-heading">
            <CalendarDays class="w-5 h-5" /> 
            OP{{ op }} Cijfers
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="grade in getGradesForOP(op)" 
              :key="grade.subjectId" 
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
            >
              <div class="flex items-center gap-2">
                <div class="font-medium text-gray-700">{{ grade.name }}</div>
                <Star v-if="grade.type === 'VSA'" class="w-4 h-4 text-amber-500" title="Onderdeel van VSA" />
              </div>
              <span :class="getGradeStatusClass(grade)">
                {{ formatGrade(grade) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentTab === 'bsa'" class="space-y-6">
        <!-- BSA Progress Section -->
        <ProgressSection 
          title="Weg naar BSA (OP1-OP3)" 
          icon="GraduationCap" 
          :progress="bsaProgress.earned" 
          progress-key="BSA" 
          :subjects="getBSASubjects()" 
          class="hover:translate-y-[-2px] transition-transform duration-300"
        />
        
        <!-- BSA Grades Grid -->
        <div v-for="op in [1, 2, 3]" :key="op" class="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-600 font-heading">
            <CalendarDays class="w-5 h-5" /> 
            OP{{ op }} Cijfers
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="grade in getGradesForOP(op)" 
              :key="grade.subjectId" 
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
            >
              <div class="flex items-center gap-2">
                <div class="font-medium text-gray-700">{{ grade.name }}</div>
                <Star v-if="grade.type === 'VSA' || grade.type === 'BSA'" class="w-4 h-4 text-amber-500" title="Onderdeel van VSA/BSA" />
              </div>
              <span :class="getGradeStatusClass(grade)">
                {{ formatGrade(grade) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, provide, onMounted } from 'vue';
import { ClipboardList, LineChart, Star, GraduationCap, CalendarDays, MessageCircle } from 'lucide-vue-next';
import StatusBar from './StatusBar.vue';
import SubjectCard from './SubjectCard.vue'; 
import ProgressSection from './ProgressSection.vue'; 

const LEVEL_GRADES = {
  O: { value: 'Onvoldoende', score: 4.0, color: 'text-red-500' },
  V: { value: 'Voldoende', score: 6.5, color: 'text-green-500' },
  G: { value: 'Goed', score: 8.0, color: 'text-green-500' }
};

const props = defineProps({
  student: {
    type: Object,
    required: true
  }
});

// Create a reactive reference to the student data
const studentProp = computed(() => props.student);

// Provide the student data to child components
provide('student', studentProp);

// Add tabs state
const currentTab = ref('vsa');
const tabs = [
  { key: 'vsa', label: 'VSA Voortgang', icon: Star },
  { key: 'bsa', label: 'BSA Voortgang', icon: GraduationCap },
];

onMounted(() => {
  // Initialize any necessary state here
  console.log('GradeCard mounted with student:', studentProp.value)
})

// Get grades for a specific period
const getGradesForOP = (period) => {
  return studentProp.value.grades.filter(grade => grade.op === period);
};

const getGradeStatusClass = (grade) => {
  if (!grade || !grade.grade) return 'text-gray-600 font-medium';
  
  const baseClasses = 'font-medium';
  
  if (grade.gradeType === 'level') {
    return `${baseClasses} ${LEVEL_GRADES[grade.grade]?.color || 'text-gray-600'}`;
  }
  
  return grade.grade >= 5.5 ? 
    `${baseClasses} text-green-500` : 
    `${baseClasses} text-red-500`;
};

const formatGrade = (grade) => {
  if (!grade || grade.grade === null || grade.grade === undefined) return 'N/A';
  
  if (grade.gradeType === 'level') {
    return LEVEL_GRADES[grade.grade]?.value || 'N/A';
  }
  
  return grade.grade.toFixed(1);
};

// Calculate progress
const calculateProgress = (type) => {
  if (!studentProp.value) return { earned: 0, total: 0, percentage: 0 };
  
  const maxPoints = type === 'VSA' ? studentProp.value.VSA.max : studentProp.value.BSA.max;
  const earnedPoints = type === 'VSA' ? studentProp.value.VSA.current : studentProp.value.BSA.current;
  
  return {
    earned: earnedPoints,
    total: maxPoints,
    percentage: (earnedPoints / maxPoints) * 100
  };
};

const vsaProgress = computed(() => calculateProgress('VSA'));
const bsaProgress = computed(() => calculateProgress('BSA'));

// Filter presence data based on current tab
const filteredPresence = computed(() => {
  const presence = studentProp.value.presence;
  const allowedPeriods = currentTab.value === 'vsa' 
    ? ['OP1', 'OP2']
    : ['OP1', 'OP2', 'OP3'];

  return Object.entries(presence)
    .filter(([period]) => allowedPeriods.includes(period))
    .reduce((acc, [period, data]) => {
      acc[period] = data;
      return acc;
    }, {});
});

// Add these new methods
const getVSASubjects = () => {
  return studentProp.value.subjects.filter(subject => {
    const grade = studentProp.value.grades.find(g => 
      g.name === subject.name && 
      `OP${g.op}` === subject.period
    );
    return grade && grade.type === 'VSA';
  });
};

const getBSASubjects = () => {
  if (!studentProp.value) return [];
  
  return studentProp.value.subjects.filter(subject => {
    // Include OP3 subjects for BSA
    if (subject.period === 'OP3') {
      return true;
    }
    
    // Include VSA subjects (OP1-OP2)
    const period = parseInt(subject.period.replace('OP', ''));
    return period <= 2 && subject.credits > 0;
  });
};

// Check if a subject is passed for the getBSASubjects and getVSASubjects methods
const isSubjectPassed = (subject) => {
  const grade = studentProp.value.grades.find(g => 
    g.name === subject.name && 
    `OP${g.op}` === subject.period
  );
  
  if (!grade || !grade.grade) return false;
  
  if (grade.gradeType === 'level') {
    return ['V', 'G'].includes(grade.grade);
  } else {
    return grade.grade >= 5.5;
  }
};
</script>
