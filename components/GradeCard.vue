<template>
  <div class="max-w-4xl mx-auto bg-gray-50 rounded-2xl overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
      <div class="flex items-center gap-6">
        <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img :src="student.photoUrl || '/placeholder-avatar.jpg'" :alt="student.name" class="w-full h-full object-cover">
        </div>
        <div>
          <h1 class="text-3xl font-bold mb-2">{{ student.name }}</h1>
          <p class="text-indigo-200">Student ID: {{ student.studentId }}</p>
        </div>
      </div>
    </div>

    <div class="p-8 space-y-8">

      <!-- Presence Section -->
      <div class="bg-white p-6 rounded-xl shadow-md">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
          <CalendarDays class="w-5 h-5 text-indigo-600" />
          Attendance Overview
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(data, op) in student.presence" 
               :key="op" 
               class="p-4 bg-gray-50 rounded-lg">
            <div class="flex justify-between mb-2">
              <span class="font-medium">{{ op }}</span>
              <span :class="data.attendance >= data.required ? 'text-green-600' : 'text-yellow-600'">
                {{ data.attendance }}%
              </span>
            </div>
            <StatusBar 
              :value="data.attendance" 
              :max="100" 
              type="presence" 
            />
            <div class="mt-2 text-sm text-gray-600">
              Present: {{ data.present }}/{{ data.classes }} classes
            </div>
          </div>
        </div>
      </div>

      <!-- VSA Progress -->
      <div class="bg-white p-6 rounded-xl shadow-md">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
          <Star class="w-5 h-5 text-indigo-600" />
          Road to VSA (OP1-OP2)
        </h2>
        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <span>Current: {{ vsaProgress }}</span>
            <span class="text-amber-600">Required: {{ student.VSA.required }}</span>
            <span>Maximum: {{ student.VSA.max }}</span>
          </div>
          <StatusBar :value="vsaProgress" :max="student.VSA.max" />
          <p v-if="vsaProgress >= student.VSA.required" 
             class="text-green-600 text-center mt-2 font-medium">
            Congratulations! You're on track for your VSA!
          </p>
          <p v-else class="text-amber-600 text-center mt-2 font-medium">
            Keep going! You need {{ student.VSA.required - vsaProgress }} more points
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SubjectCard v-for="subject in getVSASubjects()" 
                      :key="subject.id" 
                      :subject="subject" />
        </div>
      </div>

      <!-- BSA Progress -->
      <div class="bg-white p-6 rounded-xl shadow-md">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
          <GraduationCap class="w-5 h-5 text-indigo-600" />
          Road to BSA (OP3)
        </h2>
        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <span>Current: {{ bsaProgress }}</span>
            <span class="text-amber-600">Required: {{ student.BSA.required }}</span>
            <span>Maximum: {{ student.BSA.max }}</span>
          </div>
          <StatusBar :value="bsaProgress" :max="student.BSA.max" />
          <p v-if="bsaProgress >= student.BSA.required" 
             class="text-green-600 text-center mt-2 font-medium">
            Congratulations! You're on track for your BSA!
          </p>
          <p v-else class="text-amber-600 text-center mt-2 font-medium">
            Keep going! You need {{ student.BSA.required - bsaProgress }} more points
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SubjectCard v-for="subject in getBSASubjects()" 
                      :key="subject.id" 
                      :subject="subject" />
        </div>
      </div>

      <!-- OP Grades -->
      <div v-for="op in [1,2,3,4]" :key="op" class="bg-white p-6 rounded-xl shadow-md">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
          <CalendarDays class="w-5 h-5 text-indigo-600" />
          OP{{ op }} Grades
        </h2>
        <div class="space-y-2">
          <div v-for="grade in getGradesForOP(op)" 
               :key="grade.subjectId"
               class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span class="text-gray-600 flex items-center gap-2">
              {{ grade.name }}
              <Star v-if="grade.type === 'VSA'" 
                    class="w-4 h-4 text-indigo-600" 
                    title="Part of VSA/BSA" />
            </span>
            <span :class="getGradeStatusClass(grade)">
              {{ formatGrade(grade) }}
            </span>
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

// Create the student data as a plain object first
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

// Then create the ref
const student = ref(studentData);

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
</script>
