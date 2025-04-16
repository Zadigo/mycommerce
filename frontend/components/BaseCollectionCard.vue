<template>
  <article v-if="collection" class="relative rounded-md overflow-hidden">
    <NuxtLink :to="`/shop/collection/${collection.category.toLowerCase()}`">
      <div class="rounded-md">
        <NuxtImg :alt="collection.name" :src="image" format="webp" quality="80" class="rounded-md" placeholder />
        <h1 class="text-white text-3xl absolute bottom-4 left-3 uppercase font-bold">
          {{ collection.category }}
        </h1>
      </div>
    </NuxtLink>
  </article>

  <article v-else class="relative rounded-md overflow-hidden">
    <NuxtLink :to="`/shop/collection/${viewName}`">
      <div class="rounded-md">
        <NuxtImg :alt="customName" :src="image" format="webp" quality="80" class="rounded-md" placeholder />
        <h1 class="text-white text-3xl absolute bottom-4 left-3 uppercase font-bold">
          {{ customName }}
        </h1>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { CollectionName } from '~/types'

defineProps({
  collection: {
    type: Object as PropType<CollectionName>
  },
  customName: {
    type: String,
  },
  viewName: {
    type: String,
  },
  image: {
    type: String,
    default: '/img5.jpeg'
  }
})
</script>

<style lang="scss" scoped>
article {
  &:hover {
    img {
      transition: all 0.3s ease-in-out;
      transform: scale(1.1, 1.1);
    }
  }
}
</style>
