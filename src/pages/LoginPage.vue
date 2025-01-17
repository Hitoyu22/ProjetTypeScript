<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'vue-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const form = ref({
  email: '',
  password: '',
});

const loginError = ref(false); 

const userStore = useUserStore();
const router = useRouter();

const loginUser = async () => {
  const { email, password } = form.value;

  if (!email || !password) {
    loginError.value = true;
    return;
  }

  const response = await userStore.login(email, password);

  if (response.success) {
    loginError.value = false;
    router.push('/articles');
  } else {
    loginError.value = true;
  }
};
</script>

<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <Card class="mx-auto w-[450px] bg-white p-6 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Entrez vos identifiants pour vous connecter.</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="loginUser" class="grid gap-4">
            <div class="grid gap-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Entrez votre adresse email"
                required
                class="text-black"
              />
            </div>

            <div class="grid gap-2 relative">
              <Label for="password">Mot de passe</Label>
              <Input
                type="password"
                id="password"
                v-model="form.password"
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>

            <p v-if="loginError" class="text-sm text-red-600" aria-live="assertive">
              Échec de la connexion, identifiants invalides.
            </p>

            <Button type="submit" class="w-full">
              Se connecter
            </Button>
          </form>
        </CardContent>
        <CardFooter class="text-center">
          <p class="text-sm text-gray-600">
            Pas encore de compte ? 
            <router-link to="/register" class="text-indigo-600 hover:text-indigo-700">
              S'inscrire
            </router-link>
          </p>
        </CardFooter>
      </Card>
    </div>

    <div class="hidden bg-muted lg:block">
      <img
        src="https://www.shadcn-vue.com/placeholder.svg"
        alt="Image"
        width="1920"
        height="1080"
        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>
</template>

<style scoped>
button:disabled {
  background-color: #e5e7eb;
  cursor: not-allowed;
}
</style>
