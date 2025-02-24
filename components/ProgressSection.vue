<template>
  <div class="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
    <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-roc-500">
      <component :is="icon" class="w-5 h-5" /> {{ title }}
    </h2>
    <div class="mb-6">
      <div class="flex justify-between mb-2">
        <span class="text-gray-600">Huidig: {{ progress.toFixed(1) }}</span>
        <span class="text-yellow-700">Benodigd: {{ student[progressKey].required }}</span>
        <span class="text-gray-600">Maximaal haalbaar: {{ student[progressKey].max }}</span>
      </div>
      <StatusBar :value="progress" :max="student[progressKey].max" />
      <p v-if="progress >= student[progressKey].required" 
         class="text-roc-500 text-center mt-2 font-medium flex items-center justify-center gap-2"
      >
        <Star class="w-4 h-4" />
        Gefeliciteerd! Je hebt een positief {{ title.split(' ')[2] }}!
      </p>
      <p v-else 
         class="text-yellow-700 text-center mt-2 font-medium flex items-center justify-center gap-2"
      >
        <TrendingUp class="w-4 h-4" />
        Blijf doorgaan! Je hebt nog {{ (student[progressKey].required - progress).toFixed(1) }} punten nodig
      </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SubjectCard 
        v-for="subject in subjects" 
        :key="subject.id" 
        :subject="subject"
        :grade="student.grades.find(g => 
          g.name === subject.name && 
          g.op === parseInt(subject.period.replace('OP', ''))
        )"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import SubjectCard from './SubjectCard.vue';
import StatusBar from './StatusBar.vue';
import { Star, TrendingUp } from 'lucide-vue-next';

const props = defineProps(['title', 'icon', 'progress', 'progressKey', 'subjects']);
const student = inject('student');
</script>
