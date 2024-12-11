<template>
  <div>
    <SearchBar :tags="tags" @update:filters="updateFilters" />
    <div class="text-center mt-4" v-if="loading">Chargement...</div>
    <div v-else>
      <!-- Affichage du message lorsqu'il n'y a pas d'articles -->
      <div v-if="filteredArticles.length === 0" class="text-center mt-6 text-lg font-semibold">
        Il n'existe aucun article.
      </div>

      <!-- Affichage des articles uniquement si des articles existent -->
      <div v-if="filteredArticles.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <ArticleCard v-for="article in filteredArticles" :key="article.slug" :article="article" />
      </div>

      <!-- Pagination -->
      <div v-if="filteredArticles.length > 0" class="flex justify-center mt-6">
        <Button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="mr-2">
          Précédente
        </Button>
        <Button @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages" class="ml-2">
          Suivante
        </Button>
      </div>
    </div>

    <!-- Bouton Voir les favoris -->
    <div class="flex justify-center mt-6">
      <Button @click="toggleFavorites" :disabled="loading">
        {{ isFavoritesVisible ? 'Voir tous les articles' : 'Voir les favoris' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useArticlesStore, Article } from '@/store/articlesStore';
import ArticleCard from '@/components/ArticleCard.vue';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar.vue';

const store = useArticlesStore();
const loading = ref(true);

const tags = computed(() => store.tagsList);
const currentPage = ref(1);
const filteredArticles = ref<Article[]>([]);
const isFavoritesVisible = ref(false);

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
    if (isFavoritesVisible.value) {
      await store.fetchFavoriteArticles();
    } else {
      await store.fetchArticles();
    }
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

const toggleFavorites = () => {
  isFavoritesVisible.value = !isFavoritesVisible.value;
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
