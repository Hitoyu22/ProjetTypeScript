<template>
  <footer class="bg-gray-800 text-white py-6">
    <div class="container mx-auto px-6">
      <div class="flex justify-between items-center">
        <!-- Logo ou Titre du site -->
        <div class="text-lg font-semibold">
          <p>&copy; 2024 MonSite. Tous droits réservés.</p>
        </div>

        <div class="flex space-x-6">
          <router-link to="/about" class="text-gray-400 hover:text-white">À propos</router-link>
          <router-link to="/contact" class="text-gray-400 hover:text-white">Contact</router-link>
          <router-link to="/privacy" class="text-gray-400 hover:text-white">Politique de confidentialité</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
export default {
  name: "Footer",
};
</script>

<style scoped>
</style>