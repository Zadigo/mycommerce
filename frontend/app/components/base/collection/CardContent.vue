<template>
  <nuxt-link-locale id="link-collection-card" :to="`/shop/collection/${urlId || category}`" class="block">
    <nuxt-img :alt="collectionName" :src="image" format="webp" quality="80" class="aspect-square object-cover w-full xl:hover:scale-110 xl:hover:rotate-2 transition-all ease-in-out duration-200" />
    
    <h1 class="text-white text-3xl absolute bottom-4 left-3 uppercase font-bold">
      {{ category }}
    </h1>
  </nuxt-link-locale>
</template>

<script setup lang="ts">
defineProps<{ 
  collectionName: string,
  category: string,
  image: string,
  urlId?: string
}>()
</script>
