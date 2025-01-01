<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white">
    <div class="text-center max-w-3xl mx-auto p-6">
      <h1 class="text-5xl font-bold mb-4">
        Découvrez des articles inspirants
      </h1>
      <p class="text-xl mb-6">
        Explorez une variété d'articles sur différents sujets. Restez à jour avec les dernières tendances, découvrez des conseils pratiques et plongez dans des récits captivants.
      </p>
      <p class="mb-8 text-lg">
        Rejoignez notre communauté d'explorateurs de contenu, trouvez des sujets qui vous passionnent et partagez vos idées.
      </p>
      <router-link to="/login">
        <button class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md text-lg shadow-lg transition duration-300">
          Se connecter
        </button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
h1 {
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

p {
  font-size: 1.25rem;
  line-height: 1.6;
}
</style>
