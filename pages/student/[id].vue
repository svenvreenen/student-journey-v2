<template>
  <div class="max-w-4xl mx-auto p-4">
    <div class="mb-4">
      <button 
        @click="router.back()" 
        class="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
      >
        ← Back
      </button>
    </div>

    <div v-if="pending" class="p-4 text-gray-500 bg-gray-50 rounded-lg">
      Loading student data...
    </div>
    
    <div v-else-if="error" class="p-4 text-red-500 bg-red-50 rounded-lg">
      {{ error.message }}
    </div>
    
    <template v-else-if="student">
      <GradeCard 
        :student="transformedStudent"
        @update:student="(newValue) => transformedStudent = newValue"
      />
    </template>
  </div>
</template>

<script setup>
import { GradeCard } from '#components'
const route = useRoute()
const router = useRouter()
const { token } = useAuth()
const hasToken = computed(() => !!token?.value)

definePageMeta({
  middleware: ['auth']
})

// Define VSA credits mapping at the top level
const vsaCredits = {
  'Unit 13M: Market Research': { OP1: 10, OP2: 10 },
  'Bedrijfseconomie': { OP1: 10, OP2: 10 },
  'Online Marketingplan': { OP2: 10 },
  'Beroepshouding': { OP1: 10, OP2: 10 },
  'Marketing: Customer Journey': { OP1: 10, OP2: 30 }
};

const { data: student, error, pending } = await useAsyncData(
  'student',
  async () => {
    if (!hasToken.value) return null
    
    const response = await fetch(
      `https://student-journey-back-bxovn.ondigitalocean.app/items/students/${route.params.id}?fields=*,cijfers.*,cijfers.student_subject_period_id.*,cijfers.student_subject_period_id.subject_period.*,cijfers.student_subject_period_id.subject_period.vak.*`, {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch student')
    }
    
    const result = await response.json()
    return result.data
  }
)

const transformedStudent = computed(() => {
  if (!student.value) return null;

  // Construct the correct Directus asset URL
  const imageUrl = student.value.image
    ? `https://student-journey-back-bxovn.ondigitalocean.app/assets/${student.value.image}`
    : null;

  return {
    name: student.value.name,
    studentId: student.value.studentNumber,
    photoUrl: imageUrl,
    presence: {
      OP1: { attendance: parseInt(student.value.attendance_op1) || 0, required: 80 },
      OP2: { attendance: parseInt(student.value.attendance_op2) || 0, required: 80 },
      OP3: { attendance: parseInt(student.value.attendance_op3) || 0, required: 80 },
      OP4: { attendance: 0, required: 80 }
    },
    subjects: transformSubjects(student.value.cijfers),
    grades: transformGrades(student.value.cijfers),
    VSA: {
      required: 77,
      max: 110
    },
    BSA: {
      required: 147,
      max: 210
    }
  }
})

function transformSubjects(cijfers) {
  if (!cijfers) return []
  
  const uniqueSubjects = new Map()
  
  cijfers.forEach(cijfer => {
    const subject = cijfer.student_subject_period_id?.subject_period?.vak;
    const period = cijfer.student_subject_period_id?.subject_period?.periode;
    
    if (subject) {
      const subjectKey = `${subject.id}-OP${period}`;
      const credits = vsaCredits[subject.name]?.[`OP${period}`] || 0;
      
      // Add all subjects, not just VSA ones
      uniqueSubjects.set(subjectKey, {
        id: subject.id,
        compositeId: subjectKey,
        name: subject.name,
        credits: credits,
        requirement: subject.requirement || null,
        period: `OP${period}`
      });
    }
  });
  
  return Array.from(uniqueSubjects.values());
}

function transformGrades(cijfers) {
  if (!cijfers) return []
  
  return cijfers.map(cijfer => {
    const grade = cijfer.student_subject_period_id?.grade;
    const gradeType = cijfer.student_subject_period_id?.subject_period?.grade_type;
    const subject = cijfer.student_subject_period_id?.subject_period?.vak;
    const period = cijfer.student_subject_period_id?.subject_period?.periode;
    
    const isVSA = vsaCredits[subject?.name]?.[`OP${period}`] > 0;
    
    const result = {
      subjectId: subject?.id,
      name: subject?.name,
      op: parseInt(period),
      type: isVSA ? 'VSA' : 'BSA',
      gradeType: gradeType || 'numeric',
      grade: grade ? (
        gradeType === 'level' 
          ? grade.toUpperCase()
          : parseFloat(grade.replace(',', '.'))
      ) : null
    };
    console.log('Transformed grade in [id].vue:', result);
    return result;
  }).filter(grade => grade && grade.subjectId && grade.op);
}
</script> 
