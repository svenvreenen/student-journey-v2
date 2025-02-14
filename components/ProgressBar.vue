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
const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  }
});

const percentage = computed(() => (props.value / props.max) * 100);

const getColorClass = computed(() => {
  if (percentage.value >= 80) return 'bg-green-500';
  if (percentage.value >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
});
</script>
