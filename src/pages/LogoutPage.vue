<script setup lang="ts">
import { useUserStore } from '@/store/userStore'; 
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

userStore.logout();
router.push('/login');
</script>

<template>
  <div class="loading">
    <p>Déconnexion en cours...</p>
  </div>
</template>
