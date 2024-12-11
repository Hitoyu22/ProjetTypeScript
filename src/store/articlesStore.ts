import axios from "axios";
import { defineStore } from "pinia";
import { useUserStore } from "./userStore";

export interface Author {
  id: number;
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Author;
}

export interface Comment {
  id: number;
  body: string;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}

export const useArticlesStore = defineStore("articles", {
  state: () => ({
    articles: [] as Article[],
    articlesCount: 0,
    currentPage: 1,
    filters: {
      searchQuery: "",
      selectedTag: "",
      favorited: false,
      author: "",
    },
    tagsList: [] as string[],
    article: null as Article | null,
    comments: [] as Comment[],
    itemsPerPage: 10,
  }),

  actions: {
    async fetchArticles() {
      try {
        const params: Record<string, any> = {
          offset: (this.currentPage - 1) * this.itemsPerPage,
          limit: this.itemsPerPage,
        };

        const isFiltersEmpty =
          !this.filters.searchQuery &&
          !this.filters.selectedTag &&
          !this.filters.author &&
          !this.filters.favorited;

        if (isFiltersEmpty) {
          localStorage.removeItem("tagsList");
        } else {
          if (this.filters.searchQuery) params.query = this.filters.searchQuery;
          if (this.filters.selectedTag) params.tag = this.filters.selectedTag;
          if (this.filters.author) params.author = this.filters.author;
          if (this.filters.favorited) params.favorited = this.filters.favorited;
        }

        const response = await axios.get(
          "https://realword-api.nouwillcode.com/api/articles",
          { params }
        );
        this.articles = response.data.articles;
        this.articlesCount = response.data.articlesCount;

        if (!localStorage.getItem("tagsList")) {
          this.extractTags();
          this.saveTagsToLocalStorage();
        } else {
          this.loadTagsFromLocalStorage();
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des articles:", error);
        throw new Error("Erreur lors de la récupération des articles");
      }
    },

    async fetchArticle(slug: string) {
      try {
        const response = await axios.get<{ article: Article }>(
          `https://realword-api.nouwillcode.com/api/articles/${slug}`
        );
        this.article = response.data.article;
      } catch (error) {
        console.error("Erreur lors de la récupération de l'article:", error);
        throw new Error("Erreur lors de la récupération de l'article");
      }
    },

    async createArticle(newArticle: {
      article: {
        title: string;
        description: string;
        body: string;
        tagList: string[];
      };
    }) {
      try {
        const userStore = useUserStore();
        const token = userStore.token;

        if (!token) {
          throw new Error(
            "Utilisateur non authentifié. Le token JWT est manquant."
          );
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.post(
          "https://realword-api.nouwillcode.com/api/articles",
          newArticle,
          config
        );

        console.log("Article créé:", response.data.article);
      } catch (error) {
        console.error("Erreur lors de la création de l'article:", error);
        throw new Error("Erreur lors de la création de l'article");
      }
    },

    async fetchComments(slug: string) {
      try {
        const response = await axios.get<{ comments: Comment[] }>(
          `https://realword-api.nouwillcode.com/api/articles/${slug}/comments`
        );
        this.comments = response.data.comments;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des commentaires:",
          error
        );
        throw new Error("Erreur lors de la récupération des commentaires");
      }
    },

    async deleteArticle(slug: string) {
      try {
        const userStore = useUserStore();
        const token = userStore.token;

        if (!token) {
          throw new Error("Utilisateur non authentifié");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.delete(
          `https://realword-api.nouwillcode.com/api/articles/${slug}`,
          config
        );
        console.log("Article supprimé");
      } catch (error) {
        console.error("Erreur lors de la suppression de l'article:", error);
        throw new Error("Erreur lors de la suppression de l'article");
      }
    },

    async deleteComment(slug: string, commentId: number) {
      try {
        const userStore = useUserStore();
        const token = userStore.token;

        if (!token) {
          throw new Error("Utilisateur non authentifié");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.delete(
          `https://realword-api.nouwillcode.com/api/articles/${slug}/comments/${commentId}`,
          config
        );
        console.log("Commentaire supprimé");
      } catch (error) {
        console.error("Erreur lors de la suppression du commentaire:", error);
        throw new Error("Erreur lors de la suppression du commentaire");
      }
    },

    async addComment(slug: string, commentBody: string) {
      try {
        const userStore = useUserStore();
        const token = userStore.token;

        if (!token) {
          throw new Error(
            "Utilisateur non authentifié. Le token JWT est manquant."
          );
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.post(
          `https://realword-api.nouwillcode.com/api/articles/${slug}/comments`,
          { comment: { body: commentBody } },
          config
        );

        this.comments.push(response.data);
      } catch (error) {
        console.error("Erreur lors de l'ajout d'un commentaire:", error);
        throw new Error("Erreur lors de l'ajout d'un commentaire");
      }
    },

    async favoriteArticle(slug: string) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Utilisateur non authentifié");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.post(
          `https://realword-api.nouwillcode.com/api/articles/${slug}/favorite`,
          {},
          config
        );

        this.article = response.data.article;
        this.fetchArticles();
      } catch (error) {
        console.error("Erreur lors de l'ajout aux favoris:", error);
        throw new Error("Erreur lors de l'ajout aux favoris");
      }
    },

    async unfavoriteArticle(slug: string) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Utilisateur non authentifié");
        }

        const response = await axios.delete(
          `https://realword-api.nouwillcode.com/api/articles/${slug}/favorite`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.article = response.data.article;
        this.fetchArticles();
      } catch (error) {
        console.error("Erreur lors du retrait des favoris:", error);
        throw new Error("Erreur lors du retrait des favoris");
      }
    },

    extractTags() {
      const allTags = new Set<string>();
      this.articles.forEach((article) => {
        article.tagList.forEach((tag) => allTags.add(tag));
      });
      this.tagsList = Array.from(allTags);
    },

    saveTagsToLocalStorage() {
      try {
        localStorage.setItem("tagsList", JSON.stringify(this.tagsList));
      } catch (error) {
        console.error(
          "Erreur lors de la sauvegarde des tags dans le localStorage:",
          error
        );
      }
    },

    loadTagsFromLocalStorage() {
      try {
        const storedTags = localStorage.getItem("tagsList");
        if (storedTags) {
          this.tagsList = JSON.parse(storedTags);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des tags depuis le localStorage:",
          error
        );
      }
    },

    async fetchTags() {
      try {
        const storedTags = localStorage.getItem("tagsList");
        if (storedTags) {
          this.tagsList = JSON.parse(storedTags);
        } else {
          const response = await axios.get(
            "https://realword-api.nouwillcode.com/api/tags"
          );
          this.tagsList = response.data.tags;
          this.saveTagsToLocalStorage();
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des tags:", error);
        throw new Error("Erreur lors de la récupération des tags");
      }
    },

    getTagsList() {
      return this.tagsList;
    },

    async fetchFavoriteArticles() {
      try {
        const params: Record<string, any> = {
          offset: (this.currentPage - 1) * this.itemsPerPage,
          limit: this.itemsPerPage,
        };

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Utilisateur non authentifié");
        }

        const response = await axios.get(
          "https://realword-api.nouwillcode.com/api/articles/feed",
          {
            params, 
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );

        this.articles = response.data.articles;
        this.articlesCount = response.data.articlesCount;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des articles favoris:",
          error
        );
        throw new Error("Erreur lors de la récupération des articles favoris");
      }
    },

    async updateArticle(slug: string, updatedArticle: { title: string, description: string, body: string, tagList: string[] }) {
      try {
        const userStore = useUserStore();
        const token = userStore.token;

        if (!token) {
          throw new Error("Utilisateur non authentifié. Le token JWT est manquant.");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.put(
          `https://realword-api.nouwillcode.com/api/articles/${slug}`,
          { article: updatedArticle },
          config
        );

        const updated = response.data.article;
        const index = this.articles.findIndex(article => article.slug === updated.slug);
        if (index !== -1) {
          this.articles[index] = updated;
        }

        if (this.article && this.article.slug === updated.slug) {
          this.article = updated;
        }

        console.log("Article mis à jour:", updated);
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'article:", error);
        throw new Error("Erreur lors de la mise à jour de l'article");
      }
    },
  },
});
