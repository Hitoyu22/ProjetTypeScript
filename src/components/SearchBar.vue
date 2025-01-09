<template>
  <div class="flex items-center p-4 mb-6">
    <h1 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Ensemble des articles</h1>
    <div class="ml-auto flex items-center space-x-4">
      <CreateArticle @created="refreshArticles" class="mr-2"/>

      <div v-if="!isTagsEmpty" class="flex space-x-4">
        <Select v-model="selectedTag" @update:modelValue="onFilterChange">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Choisissez un tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tags</SelectLabel>
              <SelectItem v-for="tag in tags" :key="tag" :value="tag">
                {{ capitalize(tag) }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <button
          class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          :disabled="!selectedTag"
          @click="resetFilters"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';   
import CreateArticle from './CreateArticle.vue';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

const props = defineProps<{ tags: string[] }>();

const selectedTag = ref('');

const isTagsEmpty = computed(() => props.tags.length === 0);

const emit = defineEmits<{
  (event: 'update-filters', params: any): void;
}>();

const onFilterChange = (newTag: string) => {
  selectedTag.value = newTag;
};

const resetFilters = () => {
  selectedTag.value = '';
  emit('update-filters', { selectedTag: null });
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const refreshArticles = () => {
  emit('update-filters', {}); 
};

watch(selectedTag, (newTag) => {
  emit('update-filters', {
    selectedTag: newTag,
  });
});

onMounted(() => {
  console.log('SearchBar component mounted');
});
</script>

<style scoped>
button {
  cursor: pointer;
}
</style>