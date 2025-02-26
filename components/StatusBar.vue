<template>
  <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
    <div 
      class="h-2.5 rounded-full transition-all duration-300 ease-in-out animate-progress" 
      :class="colorClass"
      :style="{ 
        width: progressPercentage + '%',
        '--progress-width': progressPercentage + '%'
      }"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    default: 'default'
  }
});

const progressPercentage = computed(() => Math.min((props.value / props.max) * 100, 100));

const colorClass = computed(() => {
  if (props.type === 'presence') {
    if (progressPercentage.value >= 80) return 'bg-indigo-600';
    if (progressPercentage.value >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  }
  // Default progress colors with indigo theme
  if (progressPercentage.value >= 80) return 'bg-indigo-600';
  if (progressPercentage.value >= 60) return 'bg-indigo-400';
  return 'bg-indigo-300';
});
</script>
