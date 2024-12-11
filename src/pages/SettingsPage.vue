<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/userStore"; 
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar.vue";
import { Label } from "@/components/ui/label";

const userStore = useUserStore();
const router = useRouter();

const email = ref("");
const username = ref("");
const bio = ref("");
const image = ref("");

const fetchUserData = async () => {
  if (userStore.token) {
    await userStore.fetchUserData(); 
    username.value = userStore.username;
    email.value = userStore.email; 
    bio.value = userStore.bio;
    image.value = userStore.image;
  } else {
    router.push("/login"); 
  }
};

onMounted(() => {
  fetchUserData();
});

const updateUser = async () => {
  const updatedData = {
    email: email.value,
    username: username.value,
    bio: bio.value,
    image: image.value,
  };

  await userStore.updateUser(updatedData); 
};
</script>

<template>
  <main
    class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10"
  >
    <div class="mx-auto grid w-full max-w-6xl gap-2">
      <h1 class="text-3xl font-semibold">Paramètres</h1>
    </div>
    <div
      class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"
    >
      <nav class="grid gap-4 text-sm text-muted-foreground">
        <p class="font-semibold text-primary">Profil</p>
      </nav>
      <div class="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Votre profil</CardTitle>
            <CardDescription>Modifiez votre profil</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <Label for="username">Nom d'utilisateur</Label>
              <Input v-model="username" id="username" placeholder="Username" class="mb-2" />
              <Label for="email">Email</Label>
              <Input v-model="email" id="email" placeholder="Email" class="mb-2" />
              <Label for="bio">Bio</Label>
              <Input v-model="bio" id="bio" placeholder="Bio" class="mb-2" />
              <Label for="image">Image</Label>
              <Input
                v-model="image"
                placeholder="URL de l'image"
                class="mb-2"
                id="image"
              />
            </form>
          </CardContent>
          <CardFooter class="border-t px-6 py-4">
            <Button @click="updateUser">Sauvegarder</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </main>
</template>
