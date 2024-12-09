<template>
  <div class="p-6">
    <SearchBar :tags="tags" @update:filters="updateFilters" />

    <div v-if="loading" class="text-center mt-4">Chargement...</div>
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ArticleCard
          v-for="article in filteredArticles"
          :key="article.slug"
          :article="article"
        />
      </div>

      <div class="flex justify-center mt-6">
        <Button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="mr-2"
        >
          Précédente
        </Button>
        <Button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="ml-2"
        >
          Suivante
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useArticlesStore, Article } from '@/store/articlesStore';
import SearchBar from '@/components/SearchBar.vue';
import ArticleCard from '@/components/ArticleCard.vue';
import { Button } from '@/components/ui/button';

const store = useArticlesStore();
const loading = ref(true);

const tags = computed(() => store.tagsList); 
const currentPage = ref(1);
const filteredArticles = ref<Article[]>([]); 

const totalPages = computed(() =>
  Math.ceil(store.articlesCount / store.itemsPerPage) 
);

const mapArticles = (articles: any[]): Article[] => {
  return articles.map((article) => ({
    title: article.title,
    body: article.body,
    tagList: article.tagList, 
    slug: article.slug,
    description: article.description,  
    createdAt: article.createdAt,  
    updatedAt: article.updatedAt,  
    favorited: article.favorited,  
    favoritesCount: article.favoritesCount,  
    author: {
      id: article.author.id,
      username: article.author.username,
      bio: article.author.bio,
      image: article.author.image,
      following: article.author.following,
    }
  }));
};

const fetchArticles = async () => {
  loading.value = true;
  try {
    store.currentPage = currentPage.value;
    await store.fetchArticles();  
    filteredArticles.value = mapArticles(store.articles); 
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
  } finally {
    loading.value = false;
  }
};

const updateFilters = (filters: any) => {
  store.filters = { ...store.filters, ...filters };
  currentPage.value = 1;
  fetchArticles();
};

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchArticles();
};

onMounted(async () => {
  store.extractTags(); 
  fetchArticles();
});
</script>

<style scoped>
button:disabled {
  background-color: #e5e7eb;
  cursor: not-allowed;
}
</style>
