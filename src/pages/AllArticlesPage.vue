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
import ArticleCard from '@/components/ArticleCard.vue';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar.vue';
import {
  fetchArticles as fetchArticlesService,
  fetchFavoriteArticles as fetchFavoriteArticlesService,
  extractTagsFromArticles as extractTagsFromArticlesService,
} from '@/service/article';

// Variables et états
const loading = ref(true);
const tags = ref<string[]>([]);
const currentPage = ref(1);
const filteredArticles = ref<any[]>([]);  // Remplace `any` par le type de ton article si nécessaire
const isFavoritesVisible = ref(false);
const totalItemsPerPage = 10; // Défini par défaut ou dans les paramètres de ton service.

// Calcul du nombre total de pages
const totalPages = computed(() =>
  Math.ceil(filteredArticles.value.length / totalItemsPerPage)
);

// Mapper les articles pour les afficher dans le composant ArticleCard
const mapArticles = (articles: any[]) => {
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
    },
  }));
};

// Fonction pour récupérer les articles
const fetchArticles = async () => {
  loading.value = true;
  try {
    if (isFavoritesVisible.value) {
      // Appel à la fonction pour récupérer les articles favoris
      const { articles } = await fetchFavoriteArticlesService({
        page: currentPage.value,
        limit: totalItemsPerPage,
      });
      filteredArticles.value = mapArticles(articles);
    } else {
      // Appel à la fonction pour récupérer tous les articles
      const { articles } = await fetchArticlesService({
        page: currentPage.value,
        limit: totalItemsPerPage,
      });
      filteredArticles.value = mapArticles(articles);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
  } finally {
    loading.value = false;
  }
};

// Mettre à jour les filtres et récupérer les articles
const updateFilters = (filters: any) => {
  currentPage.value = 1;
  fetchArticles();
};

// Fonction pour changer de page
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchArticles();
};

// Fonction pour basculer entre les favoris et tous les articles
const toggleFavorites = () => {
  isFavoritesVisible.value = !isFavoritesVisible.value;
  fetchArticles();
};

// Initialisation des tags lors du montage du composant
onMounted(async () => {
  try {
    tags.value = await extractTagsFromArticlesService();  // Récupérer les tags
    fetchArticles();  // Récupérer les articles après les tags
  } catch (error) {
    console.error('Erreur lors de l’extraction des tags:', error);
  }
});
</script>

<style scoped>
button:disabled {
  background-color: #e5e7eb;
  cursor: not-allowed;
}
</style>
