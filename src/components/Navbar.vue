<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUser, Package2 } from "lucide-vue-next";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const avatarImageUrl = ref<string | undefined>('');
const usernameValue = ref<string | undefined>('');

onMounted(() => {
  const storedPicture = localStorage.getItem('picture');
  const username = localStorage.getItem('username');
  if (storedPicture && isValidUrl(storedPicture)) {
    avatarImageUrl.value = storedPicture;
  } else {
    avatarImageUrl.value = ''; 
  }

  if (username) {
    usernameValue.value = username;
  } else {
    usernameValue.value = ''; 
  }

  console.log('usernameValue', usernameValue.value);
  console.log('avatarImageUrl', avatarImageUrl.value);
});

const isValidUrl = (url: string) => {
  try {
    new URL(url); 
    return true;
  } catch (e) {
    return false;
  }
};
</script>

<template>
  <div class="flex w-full flex-col">
    <header
      class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6"
    >
      <nav
        class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
      >
        <router-link
          to="/articles"
          class="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 class="h-6 w-6" />
          <span class="sr-only">Acme Inc</span>
        </router-link>
        <router-link
          to="/articles"
          class="text-muted-foreground transition-colors hover:text-foreground"
        >
          Articles
        </router-link>
      </nav>
      <div class="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form class="ml-auto flex-1 sm:flex-initial"></form>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="rounded-full">
              <Avatar v-if="avatarImageUrl" >
                <AvatarImage :src="avatarImageUrl" alt="Mon Avatar" />
                <AvatarFallback>
                  <CircleUser class="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <CircleUser v-else class="h-5 w-5" />
              <span class="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel v-if="usernameValue">{{ usernameValue }}</DropdownMenuLabel>
            <DropdownMenuLabel v-else="">Mon profil</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <router-link
                to="/settings"
                class="text-muted-foreground transition-colors hover:text-foreground"
              >
                Paramètres
              </router-link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <router-link
                to="/logout"
                class="text-muted-foreground transition-colors hover:text-foreground"
              >
                Déconnexion
              </router-link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  </div>
</template>