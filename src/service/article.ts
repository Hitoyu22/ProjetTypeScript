import axios from "axios";
import { useUserStore } from "../store/userStore";

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

const API_BASE_URL = "https://realword-api.nouwillcode.com/api";

const saveArticlesCount = (articlesCount: number) => {
  localStorage.setItem("articlesCount", articlesCount.toString());
}

const saveFavoriteArticlesCount = (favoriteArticlesCount: number) => { 
  localStorage.setItem("favoriteArticlesCount", favoriteArticlesCount.toString());
}

export const getArticlesCount = () => {
  return parseInt(localStorage.getItem("articlesCount") || "0");
}

export const getFavoriteArticlesCount = () => {
  return parseInt(localStorage.getItem("favoriteArticlesCount") || "0");
}

const getAuthHeaders = () => {
  const userStore = useUserStore();
  const token = userStore.token;
  if (!token) {
    throw new Error("Utilisateur non authentifié. Le token JWT est manquant.");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const fetchArticles = async (params: Record<string, any> = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/articles`, { params });
    saveArticlesCount(response.data.articlesCount);
    return {
      articles: response.data.articles as Article[],
      articlesCount: response.data.articlesCount,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);
    throw new Error("Erreur lors de la récupération des articles");
  }
};


export const fetchArticle = async (slug: string) => {

  try {
    const headers = getAuthHeaders();
    const response = await axios.get<{ article: Article }>(
      `${API_BASE_URL}/articles/${slug}`, { headers }
    );
    return response.data.article;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article:", error);
    throw new Error("Erreur lors de la récupération de l'article");
  }
};

export const createArticle = async (newArticle: {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.post(
      `${API_BASE_URL}/articles`,
      { article: newArticle },
      { headers }
    );
    return response.data.article;
  } catch (error) {
    console.error("Erreur lors de la création de l'article:", error);
    throw new Error("Erreur lors de la création de l'article");
  }
};

export const updateArticle = async (slug: string, updatedArticle: { title: string, description: string, body: string, tagList: string[] }) => {
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

  try {
    const response = await axios.put(
      `https://realword-api.nouwillcode.com/api/articles/${slug}`,
      { article: updatedArticle },
      config
    );
    
    return response.data.article; 
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'article:", error);
    throw new Error("Erreur lors de la mise à jour de l'article");
  }
};

export const deleteArticle = async (slug: string) => {
  try {
    const headers = getAuthHeaders();
    await axios.delete(`${API_BASE_URL}/articles/${slug}`, { headers });
    console.log("Article supprimé");
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article:", error);
    throw new Error("Erreur lors de la suppression de l'article");
  }
};

export const fetchComments = async (slug: string) => {
  try {
    const response = await axios.get<{ comments: Comment[] }>(
      `${API_BASE_URL}/articles/${slug}/comments`
    );
    return response.data.comments;
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
    throw new Error("Erreur lors de la récupération des commentaires");
  }
};

export const addComment = async (slug: string, commentBody: string) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.post(
      `${API_BASE_URL}/articles/${slug}/comments`,
      { comment: { body: commentBody } },
      { headers }
    );
    return response.data.comment;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un commentaire:", error);
    throw new Error("Erreur lors de l'ajout d'un commentaire");
  }
};

export const deleteComment = async (slug: string, commentId: number) => {
  try {
    const headers = getAuthHeaders();
    await axios.delete(
      `${API_BASE_URL}/articles/${slug}/comments/${commentId}`,
      { headers }
    );
    console.log("Commentaire supprimé");
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire:", error);
    throw new Error("Erreur lors de la suppression du commentaire");
  }
};

export const fetchTags = async () => {
  try {
    const response = await axios.get<{ tags: string[] }>(
      `${API_BASE_URL}/tags`
    );
    return response.data.tags;
  } catch (error) {
    console.error("Erreur lors de la récupération des tags:", error);
    throw new Error("Erreur lors de la récupération des tags");
  }
};

export const fetchFavoriteArticles = async (params: Record<string, any> = {}) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/articles/feed`, { headers, params });
    saveFavoriteArticlesCount(response.data.articlesCount);
    return {
      articles: response.data.articles as Article[],
      articlesCount: response.data.articlesCount,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des articles favoris:", error);
    throw new Error("Erreur lors de la récupération des articles favoris");
  }
};

export const unfavoriteArticle = async (slug: string) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.delete(
      `${API_BASE_URL}/articles/${slug}/favorite`,
      { headers }
    );
    return response.data.article;
  } catch (error) {
    console.error("Erreur lors du retrait des favoris:", error);
    throw new Error("Erreur lors du retrait des favoris");
  }
};

export const addFavoriteArticle = async (slug: string) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.post(
      `${API_BASE_URL}/articles/${slug}/favorite`,
      {},
      { headers }
    );
    return response.data.article;
  } catch (error) {
    console.error("Erreur lors du retrait des favoris:", error);
    throw new Error("Erreur lors du retrait des favoris");
  }
};


export async function extractTagsFromArticles(): Promise<string[]> {
  try {
    const { articles } = await fetchArticles();

    const allTags = new Set<string>();

    articles.forEach((article) => {
      article.tagList.forEach((tag) => allTags.add(tag));
    });

    return Array.from(allTags);
  } catch (error) {
    console.error("Erreur lors de l'extraction des tags:", error);
    throw new Error("Erreur lors de l'extraction des tags");
  }
}


