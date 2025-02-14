<template>
  <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-center mb-2">
      <h4 class="font-semibold text-gray-800">{{ subject.name }}</h4>
      <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
        {{ subject.period }}
      </span>
    </div>
    <div class="flex justify-between items-center">
      <span class="text-gray-600">{{ subject.credits }} credits</span>
      <span :class="getGradeClass">
        {{ formatGrade }}
      </span>
    </div>
    <div v-if="subject.requirement" class="text-sm text-gray-500 mt-2">
      Required: {{ subject.requirement }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const LEVEL_GRADES = {
  DISTINCTION: { value: 'Distinction', score: 8.5, color: 'text-purple-600' },
  MERIT: { value: 'Merit', score: 7.0, color: 'text-green-600' },
  PASS: { value: 'Pass', score: 5.5, color: 'text-blue-600' },
  FAIL: { value: 'Fail', score: 4.0, color: 'text-red-600' }
};

const props = defineProps({
  subject: {
    type: Object,
    required: true,
    validator: (obj) => {
      return obj && typeof obj === 'object' && 'name' in obj;
    }
  }
});

const formatGrade = computed(() => {
  if (!props.subject.grade) return 'Not graded';
  if (props.subject.gradeType === 'numeric') {
    return props.subject.grade.toFixed(1);
  }
  return LEVEL_GRADES[props.subject.grade]?.value || 'Invalid grade';
});

const getGradeClass = computed(() => {
  if (!props.subject.grade) return 'text-gray-400';
  if (props.subject.gradeType === 'numeric') {
    return props.subject.grade >= 5.5 ? 'font-bold text-green-600' : 'font-bold text-red-600';
  }
  return `font-bold ${LEVEL_GRADES[props.subject.grade]?.color || 'text-gray-600'}`;
});
</script>
