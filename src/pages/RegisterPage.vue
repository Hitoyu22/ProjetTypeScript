<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const registerError = ref(false);

const router = useRouter();

const registerUser = async () => {
  try {
    if (password.value !== confirmPassword.value) {
      registerError.value = true;
      return;
    }

    const response = await axios.post(
      'https://realword-api.nouwillcode.com/api/users',
      {
        user: {
          email: email.value,
          username: username.value,
          password: password.value,
          bio: 'New user bio',
          image: 'https://example.com/default-profile.jpg',
        },
      }
    );

    if (response.status === 201 && response.data.user) {
      registerError.value = false;
      router.push('/login');
    } else {
      registerError.value = true;
    }
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    registerError.value = true;
  }
};

</script>
<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="hidden bg-muted lg:block">
      <img
        src="https://www.shadcn-vue.com/placeholder.svg"
        alt="Image"
        width="1920"
        height="1080"
        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
    <div class="flex items-center justify-center py-12">
      <Card class="mx-auto w-[450px] bg-white p-6 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Inscription</CardTitle>
          <CardDescription>Entrez vos informations pour vous inscrire.</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="registerUser" class="grid gap-4">
            <div class="grid gap-2">
              <Label for="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                v-model="username"
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                required
                class="text-black"
              />
            </div>

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

            <div class="grid gap-2">
              <Label for="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                :type="password"
                v-model="confirmPassword"
                placeholder="Confirmez votre mot de passe"
                required
                id="confirmPassword"
              />
            </div>

            <p v-if="registerError" class="text-sm text-red-600">
              L'inscription a échoué, veuillez vérifier vos informations.
            </p>

            <Button type="submit" class="w-full">
              S'inscrire
            </Button>
          </form>
        </CardContent>
        <CardFooter class="text-center">
          <p class="text-sm text-gray-600">
            Vous avez déjà un compte ?
            <router-link to="/login" class="text-indigo-600 hover:text-indigo-700">
              Se connecter
            </router-link>
          </p>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
