<template>
  <Dialog v-model:open="dialogOpen" @closed="handleDialogClose">
    <DialogTrigger as-child>
      <Button variant="outline" class="mr-2">Créer un nouvel article</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Créer un nouvel article</DialogTitle>
        <DialogDescription>
          Remplissez les différents champs ci-dessous. 
          Les tags doivent être séparés par des virgules. 
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-3">
          <Label for="title" class="text-right">Titre <span class="text-red-500">*</span></Label>
          <Input 
            v-model="article.title" 
            id="title" 
            class="col-span-3" 
            required 
            :class="{'border-red-500': submitted && !article.title.trim()}"
          />
          <span v-if="submitted && !article.title.trim()" class="text-red-500 text-sm">Le titre est obligatoire</span>
        </div>
        <div class="grid grid-cols-4 items-center gap-3">
          <Label for="description" class="text-right">Description <span class="text-red-500">*</span></Label>
          <Input 
            v-model="article.description" 
            id="description" 
            class="col-span-3" 
            required
            :class="{'border-red-500': submitted && !article.description.trim()}"
          />
          <span v-if="submitted && !article.description.trim()" class="text-red-500 text-sm">La description est obligatoire</span>
        </div>
        <div class="grid grid-cols-4 items-center gap-3">
          <Label for="body" class="text-right">Corps <span class="text-red-500">*</span></Label>
          <Input 
            v-model="article.body" 
            id="body" 
            class="col-span-3" 
            required
            :class="{'border-red-500': submitted && !article.body.trim()}"
          />
          <span v-if="submitted && !article.body.trim()" class="text-red-500 text-sm">Le corps de l'article est obligatoire</span>
        </div>
        <div class="grid grid-cols-4 items-center gap-3">
          <Label for="tags" class="text-right">Tags <span class="text-red-500">*</span></Label>
          <Input 
            v-model="tagInput" 
            id="tags" 
            class="col-span-3" 
            placeholder="tag1,tag2,tag3" 
            required
            :class="{'border-red-500': submitted && !tagInput.trim()}"
          />
          <span v-if="submitted && !tagInput.trim()" class="text-red-500 text-sm">Les tags sont obligatoires</span>
        </div>
      </div>

      <DialogFooter>
        <DialogClose>
        <Button 
          @click="createArticleHandler" 
          :disabled="isSubmitDisabled"
        >
          Créer l'article
        </Button>
      </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { defineEmits } from 'vue';
import { createArticle } from '@/service/article';

const article = ref({
  title: '',
  description: '',
  body: '',
  tagList: [] as string[],
});

const tagInput = ref('');
const dialogOpen = ref(false);
const submitted = ref(false);

const emit = defineEmits(['created']);

const validateFields = () => {
  return {
    titleError: !article.value.title.trim(),
    descriptionError: !article.value.description.trim(),
    bodyError: !article.value.body.trim(),
    tagsError: !tagInput.value.trim(),
  };
};

const isSubmitDisabled = computed(() => {
  const { titleError, descriptionError, bodyError, tagsError } = validateFields();
  return titleError || descriptionError || bodyError || tagsError;
});

const createArticleHandler = async () => {
  submitted.value = true;

  validateFields();

  if (isSubmitDisabled.value) {
    return;
  }

  try {
    const newArticle = {
      title: article.value.title,
      description: article.value.description,
      body: article.value.body,
      tagList: tagInput.value.split(',').map((tag: string) => tag.trim()),
    };

    await createArticle(newArticle);

    window.location.reload();

  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
  }
};

const handleDialogClose = () => {
  article.value.title = '';
  article.value.description = '';
  article.value.body = '';
  tagInput.value = '';
  submitted.value = false; 
};

watch([article, tagInput], validateFields);

</script>
