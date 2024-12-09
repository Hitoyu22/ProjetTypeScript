<template>
  <div v-if="article" class="container mx-auto px-4 py-8">
    <div class="mb-8 flex items-center space-x-4">
      <Button @click="$router.push('/articles')">
        <LucideArrowLeft class="mr-2" /> Retour aux articles
      </Button>
    </div>

    <div class="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ article.title }}</h1>
      <p class="text-lg text-gray-700 leading-relaxed">{{ article.body }}</p>

      <div class="mt-6 text-gray-600">
        <p><strong>Tags:</strong>
          <span v-if="article.tagList.length > 0">{{ article.tagList.join(', ') }}</span>
          <span v-else>Aucun tag</span>
        </p>
        <p><strong>Réactions:</strong> J'aime: {{ article.favorited ? 'Oui' : 'Non' }}, Nombre de favoris: {{ article.favoritesCount }}</p>
        <p><strong>Auteur:</strong> {{ article.author.username }}</p>
        <p><strong>Bio de l'auteur:</strong> {{ article.author.bio || 'Pas de bio' }}</p>
        <img :src="article.author.image" alt="Auteur" class="w-16 h-16 rounded-full mt-4" />
        
        <div class="mt-4">
          <Button @click="toggleFavorite" class="bg-blue-500 text-white hover:bg-blue-600">
            <LucideHeart class="mr-2" /> 
            {{ article.favorited ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
          </Button>
          <p v-if="article.favorited" class="text-green-500 mt-2">Cet article est déjà dans vos favoris!</p>
        </div>
      </div>
    </div>

    <div v-if="comments.length > 0" class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-semibold text-gray-800 mb-4">Commentaires</h2>
      <div v-for="comment in comments" :key="comment.id" class="bg-gray-50 p-4 rounded-xl shadow-md mb-4">
        <p class="text-gray-700">{{ comment.body }}</p>
        <p v-if="comment.user" class="text-sm text-gray-500">
          - {{ comment.user.fullName }} (@{{ comment.user.username }})
        </p>
      </div>
    </div>

    <p v-else class="text-gray-500 text-center mt-6">Aucun commentaire encore</p>

    <div class="mt-8 max-w-3xl mx-auto">
      <Textarea
        v-model="newComment"
        placeholder="Ajouter un commentaire"
        class="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />
      <Button @click="submitComment">
        <LucideSend class="mr-2" /> Ajouter un commentaire
      </Button>
    </div>
  </div>

  <div v-else class="flex justify-center items-center h-screen bg-gray-100">
    <p class="text-xl text-gray-500">Chargement de l'article...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useArticlesStore, Article, Comment } from '@/store/articlesStore';
import { LucideArrowLeft, LucideSend, LucideHeart } from 'lucide-vue-next';
import Textarea from './../components/ui/textarea/Textarea.vue';
import Button from './../components/ui/button/Button.vue';

export default defineComponent({
  components: {
    LucideArrowLeft,
    LucideSend,
    LucideHeart,
    Button,
    Textarea,
  },
  name: 'SingleArticlePage',
  setup() {
    const store = useArticlesStore(); 


    const slug = window.location.pathname.split('/').pop() || '';

    const article = ref<Article | null>(null); 
    const comments = ref<Comment[]>([]); 
    const newComment = ref<string>(''); 

    const fetchData = async () => {
      try {
        await store.fetchArticle(slug);
        article.value = store.article;
        await store.fetchComments(slug); 
        comments.value = store.comments; 
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    onMounted(() => {
      fetchData();
    });

    const submitComment = async () => {
      if (newComment.value.trim()) {
        try {
          await store.addComment(slug, newComment.value); 
          newComment.value = ''; 
          await store.fetchComments(slug); 
          comments.value = store.comments; 
        } catch (error) {
          console.error('Erreur lors de la soumission du commentaire:', error);
        }
      }
    };

    const toggleFavorite = async () => {
      try {
        if (article.value) {
          if (article.value.favorited) {
            await store.unfavoriteArticle(slug); 
          } else {
            await store.favoriteArticle(slug); 
          }
          article.value = store.article; 
        }
      } catch (error) {
        console.error('Erreur lors du changement de statut des favoris:', error);
      }
    };

    return {
      article,
      comments,
      newComment,
      submitComment,
      toggleFavorite,
    };
  }
});
</script>

<style scoped>
.container {
  max-width: 800px;
}

textarea {
  min-height: 150px;
}

button {
  cursor: pointer;
}
</style>
