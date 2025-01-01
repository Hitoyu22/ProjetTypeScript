<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-red-500">404</h1>
      <p class="text-xl mt-4">Oups! La page que vous cherchez n'existe pas.</p>
      <p class="text-lg mt-2">Il semble que vous ayez suivi un mauvais lien ou que la page ait été déplacée.</p>
      <div class="mt-6">
        <router-link
          to="/"
          class="text-blue-500 hover:text-blue-700 underline text-lg"
        >
          Retour à l'accueil
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
h1 {
  font-size: 6rem;
  color: #f87171;
}
</style>
