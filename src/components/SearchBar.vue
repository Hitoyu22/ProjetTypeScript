<template>
  <div class="flex justify-between items-center p-4 bg-gray-200 rounded-md mb-6">
    <div class="flex space-x-4">
      <Select v-model="selectedTag" @update:modelValue="onFilterChange">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Choisissez un tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tags</SelectLabel>
            <SelectItem v-for="tag in tags" :key="tag" :value="tag">
              {{ tag }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <button
        class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        @click="resetFilters"
      >
        Réinitialiser
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

defineProps<{ tags: string[] }>();

const selectedTag = ref(''); 

const emit = defineEmits<{
  (event: 'update:filters', params: any): void;
}>();

const onFilterChange = (newTag: string) => {
  selectedTag.value = newTag;
  emit('update:filters', {
    selectedTag: selectedTag.value,
  });
};

const resetFilters = () => {
  selectedTag.value = ''; 
  emit('update:filters', { selectedTag: null }); 
};
</script>

<style scoped>
button {
  cursor: pointer;
}
</style>
