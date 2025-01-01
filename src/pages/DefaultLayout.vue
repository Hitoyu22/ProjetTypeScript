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
  </style>