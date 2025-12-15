<template>
  <article v-if="collection" class="relative rounded-md overflow-hidden">
    <base-collection-card-content :collection-name="collection.name" :category="collection.category" :image="image" />
  </article>

  <article v-else class="relative rounded-md overflow-hidden">
    <base-collection-card-content :collection-name="customName" :category="viewName" :image="image" />
  </article>
</template>

<script setup lang="ts">
import type { CollectionApiResponse } from '~/types'

const { image = '/images/img5.jpeg' } = defineProps<{
  customName?: string,
  viewName?: string,
  collection?: CollectionApiResponse,
  image?: string
}>()
</script>
