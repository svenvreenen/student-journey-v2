<template>
  <div class="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
    <!-- Header section with ROC gradient -->
    <div class="bg-gradient-to-r from-roc-500 via-roc-600 to-roc-700 p-8 text-white relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-y-20 translate-x-20"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full translate-y-16 -translate-x-16"></div>
      
      <div class="relative z-10">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2 tracking-tight">{{ student.name }}</h1>
            <p class="text-roc-100 flex items-center gap-2">
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
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-roc-500">
          <CalendarDays class="w-5 h-5" /> 
          Aanwezigheid Overzicht
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            v-for="(data, op) in filteredPresence" 
            :key="op" 
            class="p-4 bg-white rounded-lg shadow-md border border-gray-100 hover:border-roc-200 transition-all duration-300"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium">{{ op }}</span>
              <span :class="data.attendance >= data.required ? 'text-roc-500' : 'text-roc-gold'">
                {{ data.attendance }}%
              </span>
            </div>
            <StatusBar :value="data.attendance" :max="100" type="presence" />
          </div>
        </div>
      </div>

      <!-- Mentor Message - shows based on currentTab -->
      <div class="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-roc-500">
          <MessageCircle class="w-5 h-5" />
          Bericht van je mentor bij {{ currentTab.toUpperCase() }}
        </h2>
        <p class="text-gray-600 bg-gray-50 p-4 rounded-lg">
          {{ currentTab === 'vsa' 
            ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
            : 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
          }}
        </p>
      </div>

      <!-- Tabs Navigation -->
      <div class="bg-white rounded-xl shadow-md p-1">
        <nav class="flex space-x-2" aria-label="Voortgang Tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.key"
            @click="currentTab = tab.key"
            :class="[
              'flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
              currentTab === tab.key 
                ? 'bg-roc-500 text-white shadow-md' 
                : 'text-gray-500 hover:text-roc-500 hover:bg-roc-50'
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
          progress-key="VSA" 
          :progress="vsaProgress" 
          :subjects="getVSASubjects()" 
          class="hover:translate-y-[-2px] transition-transform duration-300"
        />
        
        <!-- VSA Grades Grid -->
        <div v-for="op in [1, 2]" :key="op" class="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-roc-500">
            <CalendarDays class="w-5 h-5" /> 
            OP{{ op }} Cijfers
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="grade in getGradesForOP(op)" 
              :key="grade.subjectId" 
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-roc-50 transition-colors duration-200"
            >
              <div class="text-gray-600 flex items-center gap-2">
                {{ grade.name }}
                <Star v-if="grade.type === 'VSA'" class="w-4 h-4 text-roc-gold" title="Onderdeel van VSA" />
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
          progress-key="BSA" 
          :progress="bsaProgress" 
          :subjects="getBSASubjects()" 
          class="hover:translate-y-[-2px] transition-transform duration-300"
        />
        
        <!-- BSA Grades Grid -->
        <div v-for="op in [1, 2, 3]" :key="op" class="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-roc-500">
            <CalendarDays class="w-5 h-5" /> 
            OP{{ op }} Cijfers
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="grade in getGradesForOP(op)" 
              :key="grade.subjectId" 
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-roc-50 transition-colors duration-200"
            >
              <div class="text-gray-600 flex items-center gap-2">
                {{ grade.name }}
                <Star v-if="grade.type === 'VSA' || grade.type === 'BSA'" class="w-4 h-4 text-roc-gold" title="Onderdeel van VSA/BSA" />
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
import { ref, computed, provide } from 'vue';
import { ClipboardList, LineChart, Star, GraduationCap, CalendarDays, MessageCircle } from 'lucide-vue-next';
import StatusBar from './StatusBar.vue';
import SubjectCard from './SubjectCard.vue'; 
import ProgressSection from './ProgressSection.vue'; 

const LEVEL_GRADES = {
  O: { value: 'Onvoldoende', score: 4.0, color: 'text-red-500' },
  V: { value: 'Voldoende', score: 6.5, color: 'text-green-500' },
  G: { value: 'Goed', score: 8.0, color: 'text-green-500' }
};

const GRADE_TYPES = {
  NUMERIC: 'numeric',
  LEVEL: 'level'
};

// Define VSA credits mapping
const vsaCredits = {
  'Unit 13M: Market Research': { OP1: 10, OP2: 10 },
  'Bedrijfseconomie': { OP1: 10, OP2: 10 },
  'Online Marketingplan': { OP2: 10 },
  'Beroepshouding': { OP1: 10, OP2: 10 },
  'Marketing: Customer Journey': { OP1: 10, OP2: 30 }
};

const props = defineProps({
  student: {
    type: Object,
    required: true,
    default: () => ({
      name: "",
      studentId: "",
      photoUrl: null,
      presence: {
        OP1: { attendance: 0, required: 80 },
        OP2: { attendance: 0, required: 80 },
        OP3: { attendance: 0, required: 80 },
        OP4: { attendance: 0, required: 80 }
      },
      subjects: [],
      grades: [],
      VSA: { required: 77, max: 110 },
      BSA: { required: 147, max: 210 }
    })
  }
});

const emit = defineEmits(['update:student']);

// Create a reactive reference to the student data
const student = computed({
  get: () => props.student,
  set: (value) => emit('update:student', value)
});

// Provide the student data to child components
provide('student', student);

// Helper functions
const getSubjectName = (subjectId) => {
  return student.value.subjects.find(s => s.id === subjectId)?.name ?? "Unknown Subject";
};

const getSubject = (subjectId) => {
  return student.value.subjects.find(s => s.id === subjectId);
};

const getGradesForOP = (op) => {
  const grades = student.value.grades.filter(grade => grade.op === op);
  return grades.map(grade => {
    // Find matching subject to get credits
    const subject = student.value.subjects.find(s => 
      s.name === grade.name && 
      s.period === `OP${op}`
    );
    
    return {
      ...grade,
      credits: subject?.credits || 0
    };
  });
};

const getVSASubjects = () => {
  // Only return VSA subjects for the VSA section
  return student.value.subjects.filter(subject => {
    const hasOP1Credits = vsaCredits[subject.name]?.OP1 > 0;
    const hasOP2Credits = vsaCredits[subject.name]?.OP2 > 0;
    return hasOP1Credits || hasOP2Credits;
  });
};

const getBSASubjects = () => {
  // Return all subjects for BSA section
  return student.value.subjects;
};

const getGradeValue = (grade) => {
  if (!grade) return 0;
  if (grade.gradeType === GRADE_TYPES.NUMERIC) {
    return grade.grade;
  }
  return LEVEL_GRADES[grade.grade].score;
};

const calculateProgress = (subjects) => {
  let total = 0;
  
  subjects.forEach(subject => {
    // Find the grade for this subject and period
    const period = parseInt(subject.period.replace('OP', ''));
    const grade = student.value.grades.find(g => 
      g.name === subject.name && 
      g.op === period
    );
    
    if (grade && subject.credits) {
      if (grade.gradeType === GRADE_TYPES.NUMERIC) {
        if (grade.grade >= 5.5) {
          total += subject.credits;
        }
      } else if (grade.gradeType === GRADE_TYPES.LEVEL) {
        if (grade.grade === 'V' || grade.grade === 'G') {
          total += subject.credits;
        }
      }
    }
  });
  
  return total;
};

// Computed properties
const vsaProgress = computed(() => calculateProgress(getVSASubjects()));
const bsaProgress = computed(() => calculateProgress(getBSASubjects()));

const getGradeStatusClass = (grade) => {
  if (!grade || !grade.grade) return 'text-gray-600 font-medium';
  
  const baseClasses = 'font-medium';
  
  if (grade.gradeType === GRADE_TYPES.LEVEL) {
    // Check if the grade level exists in LEVEL_GRADES
    return `${baseClasses} ${LEVEL_GRADES[grade.grade]?.color || 'text-gray-600'}`;
  }
  
  if (grade.grade === null || grade.grade === undefined) {
    return `${baseClasses} text-gray-600`;
  }
  
  return grade.grade >= 5.5 ? 
    `${baseClasses} text-green-500` : 
    `${baseClasses} text-red-500`;
};

const formatGrade = (grade) => {
  if (!grade || grade.grade === null || grade.grade === undefined) return 'N/A';
  
  if (grade.gradeType === GRADE_TYPES.LEVEL) {
    return LEVEL_GRADES[grade.grade]?.value || 'N/A';
  }
  
  if (grade.gradeType === GRADE_TYPES.NUMERIC) {
    return grade.grade.toFixed(1);
  }
  
  return 'N/A';
};

// Add tabs state
const currentTab = ref('vsa');
const tabs = [
  { key: 'vsa', label: 'VSA Voortgang', icon: Star },
  { key: 'bsa', label: 'BSA Voortgang', icon: GraduationCap },
];

// Filter presence data based on current tab
const filteredPresence = computed(() => {
  const presence = student.value.presence;
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
</script>
