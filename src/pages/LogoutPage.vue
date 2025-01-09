<script setup lang="ts">
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const userStore = useUserStore();
const router = useRouter();
const loading = ref(true);

const logoutUser = async () => {
  try {
    await userStore.logout();  
    router.push('/login');      
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  } finally {
    loading.value = false;
  }
};

logoutUser();
</script>

<template>
  <div v-if="loading">
    <p>Déconnexion en cours...</p>
  </div>
</template>

