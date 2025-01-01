<template>
  <div>
    <SearchBar v-if="!isFavoritesVisible" :tags="tags" @update-filters="updateFilters" />
    
    <div class="text-center mt-4" v-if="loading">Chargement...</div>
    <div v-else>
      <div v-if="filteredArticles.length === 0" class="text-center mt-6 text-lg font-semibold">
        Il n'existe aucun article.
      </div>

      <div v-if="filteredArticles.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <ArticleCard v-for="article in currentArticles" :key="article.slug" :article="article" />
      </div>

      <div v-if="filteredArticles.length > 0" class="flex justify-center mt-6">
        <Button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="mr-2">
          Précédente
        </Button>
        <Button @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages" class="ml-2">
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
} from '@/service/article';

const loading = ref(false);
const tags = ref<string[]>([]);
const currentPage = ref(1);
const filteredArticles = ref<any[]>([]);
const isFavoritesVisible = ref(false);
const selectedTag = ref<string | null>(null);
const totalItemsPerPage = 10;

const currentArticles = computed(() => {
  const start = (currentPage.value - 1) * totalItemsPerPage;
  const end = start + totalItemsPerPage;
  return filteredArticles.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / totalItemsPerPage));

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

const fetchArticles = async () => {
  loading.value = true;
  try {
    const params: Record<string, any> = {
      page: currentPage.value,
      limit: totalItemsPerPage,
      tag: selectedTag.value,
    };

    const service = isFavoritesVisible.value
      ? fetchFavoriteArticlesService
      : fetchArticlesService;

    const { articles } = await service(params);
    filteredArticles.value = mapArticles(articles);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
  } finally {
    loading.value = false;
  }
};

const updateFilters = (filters: { selectedTag: string | null }) => {
  currentPage.value = 1;
  selectedTag.value = filters.selectedTag;
  fetchArticles();
};

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchArticles();
};

const toggleFavorites = () => {
  isFavoritesVisible.value = !isFavoritesVisible.value;
  fetchArticles();
};

onMounted(async () => {
  loading.value = true;
  try {
    tags.value = await extractTagsFromArticlesService();
    fetchArticles();
  } catch (error) {
    console.error('Erreur lors de l’extraction des tags:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
button:disabled {
  background-color: #e5e7eb;
  cursor: not-allowed;
}
</style>
