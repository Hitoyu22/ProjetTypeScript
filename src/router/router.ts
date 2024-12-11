import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useUserStore } from './../store/userStore'; 
import LoginPage from './../pages/LoginPage.vue';
import SingleArticlePage from './../pages/SingleArticlePage.vue';
import AllArticlesPage from './../pages/AllArticlesPage.vue';
import RegisterPage from './../pages/RegisterPage.vue';
import Home from './../pages/HomePage.vue';
import NotFound from './../pages/NotFoundPage.vue';
import SettingsPage from '@/pages/SettingsPage.vue';
import LogoutPage from '@/pages/LogoutPage.vue';
import DefaultLayout from '@/pages/DefaultLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LogoutPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/articles',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'AllArticles',
        component: AllArticlesPage,
      },
      {
        path: ':slug',
        name: 'SingleArticle',
        component: SingleArticlePage,
      },
    ],
  },
  {
    path: '/settings',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'SettingsPage',
        component: SettingsPage,
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const userStore = useUserStore();
  const isAuthenticated = !!userStore.token;

  if (['/articles', '/favorites'].includes(to.path) && !isAuthenticated) {
    next('/login');  
  } else {
    next(); 
  }
});

export default router;