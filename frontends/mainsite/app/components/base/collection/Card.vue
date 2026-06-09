<template>
  <article v-if="collection" class="relative rounded-md overflow-hidden">
    <base-collection-card-content :url-id="collection.slug" :collection-name="collection.name" :category="collection.category" :image="image" />
  </article>

  <article v-else class="relative rounded-md overflow-hidden">
    <base-collection-card-content :collection-name="customName" :category="viewName" :image="image" />
  </article>
</template>

<script setup lang="ts">
import type { BaseProductCollection } from '~/types'

const { image = '/images/group1/img2.jpeg' } = defineProps<{
  customName?: string,
  viewName?: string,
  collection?: BaseProductCollection,
  image?: string
}>()
</script>
