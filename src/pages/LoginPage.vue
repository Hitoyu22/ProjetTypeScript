<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'vue-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const email = ref('');
const password = ref('');
const loginError = ref(false); 

const userStore = useUserStore();
const router = useRouter();

const loginUser = async () => {
  try {
    const response = await axios.post(
      'https://realword-api.nouwillcode.com/api/users/login',
      {
        user: {
          email: email.value,
          password: password.value,
        }
        
      }
    );

    if (response.status === 201 && response.data.user) {
      const { token, username } = response.data.user;

      userStore.setUser(token, username);

      loginError.value = false;

      router.push('/articles');
    } else {
      loginError.value = true;
    }
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
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
                v-model="email"
                type="email"
                placeholder="Entrez votre adresse email"
                required
                class="text-black"
              />
            </div>

            <div class="grid gap-2 relative">
              <Label for="password">Mot de passe</Label>
              <Input
                :type="password"
                id="password"
                v-model="password"
                placeholder="Entrez votre mot de passe"
                required
              />
              
            </div>

            <p v-if="loginError" class="text-sm text-red-600">
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
