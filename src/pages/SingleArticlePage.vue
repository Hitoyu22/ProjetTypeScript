<template>
  <div v-if="article" class="container mx-auto px-6 py-8">
    <div class="mb-6 flex justify-between items-center">
      <!-- Bouton Retour aux articles -->
      <Button @click="$router.push('/articles')" class="mr-4">
        <LucideArrowLeft class="mr-2" /> Retour aux articles
      </Button>

      <!-- Conteneur pour les boutons Supprimer et Mettre à jour l'article -->
      <div class="flex items-center space-x-4 ml-auto">
        <!-- Bouton Supprimer l'article -->
        <Dialog v-if="isOwner">
          <DialogTrigger as-child>
            <Button
              @click="showModal = true"
              class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300"
            >
              Supprimer l'article
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirmation de suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer cet article ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" @click="showModal = false">
                Non
              </Button>
              <Button class="bg-red-600 text-white" @click="deleteArticle">
                Oui, supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <!-- Bouton Mettre à jour l'article -->
        <UpdateArticle v-if="isOwner && article" :articleToUpdate="article" @updated="fetchData" />
      </div>
    </div>

    <!-- Bloc complet avec contenu, auteur, tags et réactions -->
    <div class="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto mb-8">
      <div class="flex items-center space-x-4 mb-8">
        <img
          :src="article.author.image"
          alt="Auteur"
          class="w-16 h-16 rounded-full border-2 border-gray-200"
        />
        <div>
          <p class="font-semibold text-xl text-gray-800">{{ article.author.username }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ article.author.bio || "Pas de bio disponible" }}</p>

          <!-- Bouton Suivre / Ne plus suivre -->
          <Button v-if="!isOwner"
            @click="toggleFollow"
            :class="isFollowing ? 'bg-gray-500' : 'bg-blue-600'"
            class="text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300 mt-2"
          >
            {{ isFollowing ? "Ne plus suivre" : "Suivre" }}
          </Button>
        </div>
      </div>

      <!-- Contenu de l'article -->
      <h1 class="text-4xl font-semibold text-gray-900 mb-6">{{ article.title }}</h1>
      <p class="text-lg text-gray-700 leading-relaxed mb-6">{{ article.body }}</p>
      <p class="text-lg text-gray-700 leading-relaxed mb-6">{{ article.description }}</p>

      <!-- Tags et Réactions -->
      <div class="text-gray-800 mb-6">
        <p><strong>Réactions:</strong></p>
        <p><span class="font-medium">J'aime:</span> {{ article.favorited ? "Oui" : "Non" }}</p>
        <p><span class="font-medium">Nombre de favoris:</span> {{ article.favoritesCount }}</p>
        <div>
          <span v-if="article.tagList.length > 0" class="text-blue-600">
            <Badge v-for="(tag, index) in article.tagList" :key="index" class="mr-2 mb-2">
              {{ tag }}
            </Badge>
          </span>
          <span v-else class="italic text-gray-500">Aucun tag</span>
        </div>
      </div>

      <div class="flex justify-end mt-4">
        <Button
          @click="toggleFavorite"
          class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          <LucideHeart class="mr-2" />
          Ajouter aux favoris
        </Button>
      </div>
    </div>

    <!-- Section des commentaires -->
    <div v-if="comments.length > 0" class="max-w-3xl mx-auto mt-8">
      <h2 class="text-3xl font-semibold text-gray-800 mb-4">Commentaires</h2>
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center"
      >
        <div>
          <p class="text-gray-700">{{ comment.body }}</p>
          <p v-if="comment.user" class="text-sm text-gray-500">
            - {{ comment.user.fullName }} (@{{ comment.user.username }})
          </p>
        </div>

        <!-- Icône de corbeille pour supprimer le commentaire, visible seulement pour le propriétaire -->
        <div v-if="isOwner">
          <Button @click="deleteComment(comment.id)" class="text-red-600 hover:text-red-700" variant="link">
            <LucideTrash />
          </Button>
        </div>
      </div>
    </div>

    <p v-else class="text-gray-500 text-center mt-6">
      Aucun commentaire encore
    </p>

    <!-- Ajouter un commentaire -->
    <div class="mt-8 max-w-3xl mx-auto">
      <Textarea
        v-model="newComment"
        placeholder="Ajouter un commentaire"
        class="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />
      <Button
        @click="submitComment"
        :disabled="!newComment.trim()"
        class="bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
      >
        <LucideSend class="mr-2" /> Ajouter un commentaire
      </Button>
    </div>
  </div>

  <!-- Loading spinner -->
  <div v-else class="flex justify-center items-center h-screen bg-gray-100">
    <p class="text-xl text-gray-500">Chargement de l'article...</p>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useArticlesStore, Article, Comment } from "@/store/articlesStore";
import { useUserStore } from "@/store/userStore";
import { LucideArrowLeft, LucideSend, LucideHeart, LucideTrash } from "lucide-vue-next";
import { useRouter } from "vue-router";
import Textarea from "../components/ui/textarea/Textarea.vue";
import Button from "../components/ui/button/Button.vue";
import Badge from "@/components/ui/badge/Badge.vue";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar.vue";
import UpdateArticle from "@/components/UpdateArticle.vue";

export default defineComponent({
  components: {
    LucideArrowLeft,
    LucideSend,
    LucideHeart,
    LucideTrash,
    Button,
    Textarea,
    Badge,
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Navbar,
    UpdateArticle,
  },
  name: "SingleArticlePage",
  setup() {
    const store = useArticlesStore();
    const user = useUserStore();
    const router = useRouter();
    const slug = window.location.pathname.split("/").pop() || "";
    const article = ref<Article | null>(null);
    const comments = ref<Comment[]>([]);
    const newComment = ref<string>(""); 
    const isOwner = ref(false); 
    const isFollowing = ref(false);
    const showModal = ref(false);

    const fetchData = async () => {
      try {
        await store.fetchArticle(slug);
        article.value = store.article;
        await store.fetchComments(slug);
        comments.value = store.comments;
        checkOwnership();
        checkFollowStatus();
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    onMounted(() => {
      fetchData();
    });


    const submitComment = async () => {
      if (newComment.value.trim()) {
        try {
          await store.addComment(slug, newComment.value);
          newComment.value = "";
          await store.fetchComments(slug);
          comments.value = store.comments;
        } catch (error) {
          console.error("Erreur lors de la soumission du commentaire:", error);
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
        console.error("Erreur lors du changement de statut des favoris:", error);
      }
    };

    const checkOwnership = () => {
      const currentUser = localStorage.getItem("username");
      if (article.value) {
        isOwner.value = currentUser === article.value.author.username;
      }
    };

    const checkFollowStatus = async () => {
      const currentUser = localStorage.getItem("username");
      if (article.value && currentUser) {
        try {
          const response = await user.checkFollowing(article.value.author.username);
          isFollowing.value = response;
        } catch (error) {
          console.error("Erreur lors de la vérification du statut de suivi:", error);
        }
      }
    };

    const toggleFollow = async () => {
      try {
        if (isFollowing.value) {
          await user.unfollowUser(article.value!.author.username);
        } else {
          await user.followUser(article.value!.author.username);
        }
        isFollowing.value = !isFollowing.value;
      } catch (error) {
        console.error("Erreur lors de la gestion du suivi:", error);
      }
    };


    const deleteArticle = async () => {
      try {
        await store.deleteArticle(slug);
        router.push("/articles"); // Rediriger après suppression
      } catch (error) {
        console.error("Erreur lors de la suppression de l'article:", error);
      }
    };

    const deleteComment = async (commentId: number) => {
      try {
        await store.deleteComment(slug, commentId);
        comments.value = comments.value.filter(comment => comment.id !== commentId);
      } catch (error) {
        console.error("Erreur lors de la suppression du commentaire:", error);
      }
    };

    return {
      article,
      comments,
      newComment,
      isOwner,
      isFollowing,
      fetchData,
      submitComment,
      toggleFavorite,
      toggleFollow,
      deleteArticle,
      deleteComment,
      showModal,
    };
  },
});
</script>
