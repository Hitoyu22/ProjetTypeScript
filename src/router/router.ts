import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store/userStore'; // Importer le store pour vérifier l'authentification
import LoginPage from './../pages/LoginPage.vue';
import SignUpPage from './../pages/SignUpPage.vue';
import SingleArticlePage from './../pages/SingleArticlePage.vue';
import FavoritesPage from './../pages/FavoritesPage.vue';
import AllArticlesPage from '@/pages/AllArticlesPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpPage,
  },
  {
    path: '/articles/',
    name: 'Articles',
    component: AllArticlesPage,
  },
  {
    path: '/articles/:slug',
    name: 'SingleArticle',
    component: SingleArticlePage,
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: FavoritesPage,
  },
];

// Créer un routeur
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = !!userStore.token;  

  if (['/articles', '/favorites'].includes(to.path) && !isAuthenticated) {
    next('/login');  
  } else {
    next(); 
  }
});


export default router;
