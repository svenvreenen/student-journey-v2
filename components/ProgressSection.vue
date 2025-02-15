<template>
  <div class="bg-white p-6 rounded-xl shadow-md transition hover:scale-105">
    <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-600">
      <component :is="icon" class="w-5 h-5" /> {{ title }}
    </h2>
    <div class="mb-6">
      <div class="flex justify-between mb-2">
        <span>Current: {{ progress }}</span>
        <span class="text-amber-600">Required: {{ student[progressKey].required }}</span>
        <span>Maximum: {{ student[progressKey].max }}</span>
      </div>
      <StatusBar :value="progress" :max="student[progressKey].max" />
      <p v-if="progress >= student[progressKey].required" class="text-green-600 text-center mt-2 font-medium">
        Congratulations! You're on track for your {{ title.split(' ')[2] }}!
      </p>
      <p v-else class="text-amber-600 text-center mt-2 font-medium">
        Keep going! You need {{ student[progressKey].required - progress }} more points
      </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SubjectCard v-for="subject in subjects" :key="subject.id" :subject="subject" />
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import SubjectCard from './SubjectCard.vue'; // Import SubjectCard
import StatusBar from './StatusBar.vue';
const props = defineProps(['title', 'icon', 'progress', 'progressKey', 'subjects']);
const student = inject('student'); // Inject student data
</script>
