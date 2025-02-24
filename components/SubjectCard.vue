<template>
  <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
    <div class="flex justify-between items-center mb-2">
      <h4 class="font-semibold text-gray-800">{{ subject.name }}</h4>
      <span class="text-sm bg-roc-100 text-roc-700 px-2 py-1 rounded">
        {{ subject.period }}
      </span>
    </div>
    <div class="flex justify-between items-center">
      <span class="text-gray-600 flex items-center gap-2">
        <GraduationCap class="w-4 h-4" />
        {{ subject.credits }} studiepunten
      </span>
      <span :class="getGradeClass">
        {{ formatGrade }}
      </span>
    </div>
    <div v-if="subject.requirement" class="text-sm text-gray-500 mt-2 flex items-center gap-1">
      <AlertCircle class="w-3 h-3" />
      Vereist: {{ subject.requirement }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { GraduationCap, AlertCircle } from 'lucide-vue-next';

const LEVEL_GRADES = {
  O: { value: 'Onvoldoende', score: 4.0, color: 'text-red-500' },
  V: { value: 'Voldoende', score: 6.5, color: 'text-green-500' },
  G: { value: 'Goed', score: 8.0, color: 'text-green-500' }
};

const props = defineProps({
  subject: {
    type: Object,
    required: true,
    validator: (obj) => {
      return obj && typeof obj === 'object' && 'name' in obj;
    }
  },
  grade: {
    type: Object,
    default: null
  }
});

const formatGrade = computed(() => {
  if (!props.grade) return 'Niet behaald';
  
  if (props.grade.gradeType === 'numeric') {
    const numericGrade = props.grade.grade;
    if (!numericGrade) return 'Niet behaald';
    return numericGrade >= 5.5 ? 'Behaald' : 'Niet behaald';
  }
  
  // For level grades (O, V, G)
  if (!props.grade.grade) return 'Niet behaald';
  return ['V', 'G'].includes(props.grade.grade) ? 'Behaald' : 'Niet behaald';
});

const getGradeClass = computed(() => {
  if (!props.grade?.grade) return 'text-red-500 font-medium';
  
  if (props.grade.gradeType === 'numeric') {
    return props.grade.grade >= 5.5 
      ? 'font-medium text-green-500' 
      : 'font-medium text-red-500';
  }
  
  return ['V', 'G'].includes(props.grade.grade)
    ? 'font-medium text-green-500'
    : 'font-medium text-red-500';
});
</script>
