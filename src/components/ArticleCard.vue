<template>
  <Card class="bg-white shadow-md rounded-lg">
    <CardHeader class="pb-2">
      <CardTitle class="text-xl font-semibold text-gray-800">{{ props.article.title }}</CardTitle>
      <CardDescription class="text-gray-600 mt-1">{{ truncatedBody }}</CardDescription>
      <CardDescription class="text-gray-600 mt-1">{{ props.article.description }}</CardDescription>
    </CardHeader>

    <CardContent class="pt-2">
      <div class="mt-2 flex flex-wrap">
        <Badge v-for="(tag) in props.article.tagList" :key="tag" class="mr-2 mb-2">
          {{ capitalize(tag) }}
        </Badge>
      </div>
    </CardContent>

    <CardFooter class="pt-2 flex justify-between items-center text-sm text-gray-500">
      <div class="flex space-x-4">
        
      </div>
      <div class="flex justify-between items-center">
        <Button @click="goToArticle">En découvrir plus</Button>
      </div>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { computed } from 'vue';

const props = defineProps({
  article: {
    type: Object as () => {
      title: string;
      body: string;
      tagList: string[]; 
      slug: string;
      description: string;
      createdAt: string;
      updatedAt: string;
      favorited: boolean;
      favoritesCount: number;
      author: {
        id: number;
        username: string;
        bio: string;
        image: string;
        following: boolean;
      };
    },
    required: true,
  },
});



const truncatedBody = computed(() => {
  return props.article.body.slice(0, 100) + '...';
});

const router = useRouter();

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const goToArticle = () => {
  router.push({ name: 'SingleArticle', params: { slug: props.article.slug } });
};


</script>
