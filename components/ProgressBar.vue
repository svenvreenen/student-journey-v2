<template>
  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
    <div
      class="h-full transition-all duration-500 ease-in-out animate-progress"
      :class="getColorClass"
      :style="{ 
        width: `${percentage}%`,
        '--progress-width': `${percentage}%`
      }"
    />
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

const percentage = computed(() => Math.min((props.value / props.max) * 100, 100));

const getColorClass = computed(() => {
  if (props.type === 'presence') {
    if (percentage.value >= 80) return 'bg-roc-500';
    if (percentage.value >= 70) return 'bg-roc-gold';
    return 'bg-red-500';
  }
  
  // Default progress colors with ROC theme
  if (percentage.value >= 80) return 'bg-roc-500';
  if (percentage.value >= 60) return 'bg-roc-300';
  return 'bg-roc-200';
});
</script>
