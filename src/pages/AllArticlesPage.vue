<template>
  <div>
    <SearchBar v-if="!isFavoritesVisible" :tags="tags" @update-filters="updateFilters" />

    <div class="text-center mt-4" v-if="loading">Chargement...</div>

    <div v-else>
      <div v-if="filteredArticles.length === 0" class="text-center mt-6 text-lg font-semibold">
        Il n'existe aucun article.
      </div>

      <div v-if="filteredArticles.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <ArticleCard v-for="article in filteredArticles" :key="article.slug" :article="article" />
      </div>

      <div v-if="totalPages > 0 && !isFavoritesVisible" class="flex justify-center mt-6">
        <Button @click="goToPage(currentPage - 1)" :disabled="isPreviousPageDisabled" class="mr-2">
          Précédente
        </Button>
        <span class="mx-4">Page {{ currentPage + 1 }} sur {{ totalPages }}</span>
        <Button @click="goToPage(currentPage + 1)" :disabled="isNextPageDisabled" class="ml-2">
          Suivante
        </Button>
      </div>
    </div>

    <div class="flex justify-center mt-6">
      <Button @click="toggleFavorites" :disabled="loading">
        {{ isFavoritesVisible ? 'Voir tous les articles' : 'Voir articles des personnes suivies' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ArticleCard from '@/components/ArticleCard.vue';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar.vue';
import {
  fetchArticles as fetchArticlesService,
  fetchFavoriteArticles as fetchFavoriteArticlesService,
  extractTagsFromArticles as extractTagsFromArticlesService,
  getArticlesCount,
  getFavoriteArticlesCount,
} from '@/service/article';

const loading = ref(false);
const tags = ref<string[]>([]);
const currentPage = ref(0); 
const filteredArticles = ref<any[]>([]);
const isFavoritesVisible = ref(false);
const selectedTag = ref<string | null>(null);
const totalItemsPerPage = 9;

const totalPages = ref(1);

const isPreviousPageDisabled = computed(() => currentPage.value === 0);
const isNextPageDisabled = computed(() => currentPage.value >= totalPages.value - 1); 

const fetchTotalPages = async () => {
  try {
    const totalArticles = isFavoritesVisible.value
      ? await getFavoriteArticlesCount()
      : await getArticlesCount();
    totalPages.value = Math.ceil(totalArticles / totalItemsPerPage); 
  } catch (error) {
    console.error('Erreur lors du calcul des pages totales:', error);
    totalPages.value = 0;
  }
};

const fetchArticles = async () => {
  loading.value = true;
  try {
    const params = isFavoritesVisible.value
      ? {} 
      : {
          offset: currentPage.value * totalItemsPerPage,  
          limit: totalItemsPerPage,
          tag: selectedTag.value,
        };

    const service = isFavoritesVisible.value
      ? fetchFavoriteArticlesService
      : fetchArticlesService;

    const { articles } = await service(params);
    filteredArticles.value = mapArticles(articles);

    await fetchTotalPages();
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
  } finally {
    loading.value = false;
  }
};

const mapArticles = (articles: any[]) =>
  articles.map((article) => ({
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
    },
  }));

const updateFilters = (filters: { selectedTag: string | null }) => {
  currentPage.value = 0; 
  selectedTag.value = filters.selectedTag;
  fetchArticles();
};

const goToPage = (page: number) => {
  if (page < 0 || page >= totalPages.value) return; 
  currentPage.value = page;
  fetchArticles();
};

const toggleFavorites = () => {
  isFavoritesVisible.value = !isFavoritesVisible.value;
  currentPage.value = 0; 
  fetchArticles();
};

onMounted(async () => {
  loading.value = true;
  try {
    tags.value = await extractTagsFromArticlesService();
    await fetchArticles();
  } catch (error) {
    console.error('Erreur lors de l’extraction des tags:', error);
  } finally {
    loading.value = false;
  }
});
</script>

