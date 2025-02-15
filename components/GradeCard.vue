<template>
  <div class="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
    <!-- Header section with gradient -->
    <div class="bg-gradient-to-r from-red-600 via-emerald-600 to-indigo-700 p-8 text-white relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-y-20 translate-x-20"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full translate-y-16 -translate-x-16"></div>
      
      <div class="relative z-10">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2 tracking-tight">{{ student.name }}</h1>
            <p class="text-indigo-200 flex items-center gap-2">
              <GraduationCap class="w-4 h-4" />
              Student ID: {{ student.studentId }}
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
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-600">
          <CalendarDays class="w-5 h-5" /> 
          Attendance Overview
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            v-for="(data, op) in filteredPresence" 
            :key="op" 
            class="p-4 bg-white rounded-lg shadow-md border border-gray-100 hover:border-indigo-200 transition-all duration-300"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium">{{ op }}</span>
              <span :class="data.attendance >= data.required ? 'text-green-600' : 'text-yellow-600'">
                {{ data.attendance }}%
              </span>
            </div>
            <StatusBar :value="data.attendance" :max="100" type="presence" />
            <div class="mt-2 text-sm text-gray-600">
              Present: {{ data.present }}/{{ data.classes }} classes
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="bg-white rounded-xl shadow-md p-1">
        <nav class="flex space-x-2" aria-label="Progress Tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.key"
            @click="currentTab = tab.key"
            :class="[
              'flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
              currentTab === tab.key 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
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
        <ProgressSection 
          title="Road to VSA (OP1-OP2)" 
          icon="Star" 
          progress-key="VSA" 
          :progress="vsaProgress" 
          :subjects="getVSASubjects()" 
          class="hover:translate-y-[-2px] transition-transform duration-300"
        />
        
        <!-- VSA Grades -->
        <div v-for="op in [1, 2]" :key="op" class="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-600">
            <CalendarDays class="w-5 h-5" /> 
            OP{{ op }} Grades
          </h2>
          <div class="space-y-2">
            <div 
              v-for="grade in getGradesForOP(op)" 
              :key="grade.subjectId" 
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div class="text-gray-600 flex items-center gap-2">
                {{ grade.name }}
                <Star v-if="grade.type === 'VSA'" class="w-4 h-4 text-indigo-600" title="Part of VSA" />
              </div>
              <span :class="getGradeStatusClass(grade)">
                {{ formatGrade(grade) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentTab === 'bsa'" class="space-y-6">
        <ProgressSection 
          title="Road to BSA (OP1-OP3)" 
          icon="GraduationCap" 
          progress-key="BSA" 
          :progress="bsaProgress" 
          :subjects="getBSASubjects()" 
          class="hover:translate-y-[-2px] transition-transform duration-300"
        />
        
        <!-- BSA Grades -->
        <div v-for="op in [1, 2, 3]" :key="op" class="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-600">
            <CalendarDays class="w-5 h-5" /> 
            OP{{ op }} Grades
          </h2>
          <div class="space-y-2">
            <div 
              v-for="grade in getGradesForOP(op)" 
              :key="grade.subjectId" 
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div class="text-gray-600 flex items-center gap-2">
                {{ grade.name }}
                <Star v-if="grade.type === 'VSA' || grade.type === 'BSA'" class="w-4 h-4 text-indigo-600" title="Part of VSA/BSA" />
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
import { ref, computed } from 'vue';
import { ClipboardList, LineChart, Star, GraduationCap, CalendarDays } from 'lucide-vue-next';
import StatusBar from './StatusBar.vue';
import SubjectCard from './SubjectCard.vue'; 
import ProgressSection from './ProgressSection.vue'; 
import { provide } from 'vue';

// Move constants outside of component
const GRADE_TYPES = {
  NUMERIC: 'numeric',
  LEVEL: 'level'
};

const LEVEL_GRADES = {
  DISTINCTION: { value: 'Distinction', score: 8.5, color: 'text-purple-600' },
  MERIT: { value: 'Merit', score: 7.0, color: 'text-green-600' },
  PASS: { value: 'Pass', score: 5.5, color: 'text-blue-600' },
  FAIL: { value: 'Fail', score: 4.0, color: 'text-red-600' }
};

// Mock data
const studentData = {
  name: "Student Name",
  studentId: "2024-001",
  photoUrl: "/placeholder-avatar.jpg",
  presence: {
    OP1: {
      attendance: 85,
      required: 80,
      classes: 15,
      present: 13
    },
    OP2: {
      attendance: 92,
      required: 80,
      classes: 12,
      present: 11
    },
    OP3: {
      attendance: 75,
      required: 80,
      classes: 16,
      present: 12
    },
    OP4: {
      attendance: 88,
      required: 80,
      classes: 10,
      present: 9
    }
  },
  subjects: [
    {
      id: 1,
      name: "Market Research",
      credits: 10,
      requirement: "P Niveau Behaald"
    },
    // ... other subjects
  ],
  grades: [
    {
      subjectId: 1,
      op: 1,
      type: "VSA",
      gradeType: GRADE_TYPES.LEVEL,
      grade: 'DISTINCTION'
    },
    // ... other grades
  ],
  VSA: {
    required: 77,
    max: 110
  },
  BSA: {
    required: 147,
    max: 210
  }
};

const student = ref(studentData);
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
  return grades.map(grade => ({
    ...grade,
    name: getSubjectName(grade.subjectId),
    credits: getSubject(grade.subjectId)?.credits
  }));
};

const getVSASubjects = () => {
  const vsaIds = student.value.grades
    .filter(grade => grade.type === 'VSA')
    .map(grade => grade.subjectId);
  return student.value.subjects.filter(subject => vsaIds.includes(subject.id));
};

const getBSASubjects = () => {
  const relevantIds = student.value.grades
    .filter(grade => grade.type === 'VSA' || grade.type === 'BSA')
    .map(grade => grade.subjectId);
  return student.value.subjects.filter(subject => relevantIds.includes(subject.id));
};

const getGradeValue = (grade) => {
  if (!grade) return 0;
  if (grade.gradeType === GRADE_TYPES.NUMERIC) {
    return grade.grade;
  }
  return LEVEL_GRADES[grade.grade].score;
};

const calculateProgress = (subjects) => {
  return subjects.reduce((total, subject) => {
    const grade = student.value.grades.find(g => g.subjectId === subject.id);
    if (grade && subject.credits) {
      return total + (getGradeValue(grade) * subject.credits);
    }
    return total;
  }, 0);
};

// Computed properties
const vsaProgress = computed(() => calculateProgress(getVSASubjects()));
const bsaProgress = computed(() => calculateProgress(getBSASubjects()));

const formatGrade = (grade) => {
  if (!grade) return '';
  if (grade.gradeType === GRADE_TYPES.NUMERIC) {
    return grade.grade.toFixed(1);
  }
  return LEVEL_GRADES[grade.grade].value;
};

const getGradeStatusClass = (grade) => {
  if (!grade) return '';
  if (grade.gradeType === GRADE_TYPES.LEVEL) {
    return `font-medium ${LEVEL_GRADES[grade.grade].color}`;
  }
  
  const baseClasses = 'font-medium';
  if (grade.type === 'VSA') {
    return `${baseClasses} text-indigo-600`;
  }
  return grade.grade >= 5.5 ? 
    `${baseClasses} text-green-600` : 
    `${baseClasses} text-red-600`;
};

// Add tabs state
const currentTab = ref('vsa');
const tabs = [
  { key: 'vsa', label: 'VSA Progress', icon: Star },
  { key: 'bsa', label: 'BSA Progress', icon: GraduationCap },
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
