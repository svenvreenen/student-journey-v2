<template>
  <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
    <div
      class="h-full transition-all duration-500"
      :class="getColorClass"
      :style="{ width: `${percentage}%` }"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    required: true,
    default: 0
  },
  max: {
    type: Number,
    required: true,
    default: 100
  },
  type: {
    type: String,
    default: 'progress' // 'progress' or 'presence'
  }
});

const percentage = computed(() => Math.min((props.value / props.max) * 100, 100));

const getColorClass = computed(() => {
  if (props.type === 'presence') {
    if (percentage.value >= 80) return 'bg-green-500';
    if (percentage.value >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  } else {
    // Default progress bar colors
    if (percentage.value >= 80) return 'bg-green-500';
    if (percentage.value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }
});
</script> 
