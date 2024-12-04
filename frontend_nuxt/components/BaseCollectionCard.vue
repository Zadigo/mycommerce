<template>
  <article class="col-sm-12 col-md-4 my-1">
    <NuxtLink :to="`/shop/collection/${collection.get_view_name}`">
      <div :aria-label="collection.name" class="card shadow-none">
        <NuxtImg :alt="collection.name" :src="image" class="card-img" />
        
        <h1 class="text-white text-left h3 fw-bold text-uppercase px-2 py-4">
          {{ collection.name }}
        </h1>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { CollectionName } from '~/types';

defineProps({
  collection: {
    type: Object as PropType<CollectionName>,
    required: true
  },
  image: {
    type: String,
    default: '/img5.jpeg'
  }
})
</script>

<style lang="scss" scoped>
article {
  h1 {
    position: absolute;
    bottom: 3%;
    left: 3%;
    width: 100%;
  }
}
</style>
