<template>
    <div>
      <Navbar />
      <main>
        <router-view></router-view>
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import Navbar from '@/components/Navbar.vue';
  </script>
  
  <style scoped>
  /* Ajoutez ici vos styles spécifiques au layout */
  </style>