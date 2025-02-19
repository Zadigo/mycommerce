<template>
  <article class="col-sm-12 col-md-4 my-1">
    <NuxtLink :to="`/shop/collection/${collection.get_view_name}`">
      <div :aria-label="collection.name" class="card shadow-none">
        <div class="wrapper rounded-2">
          <NuxtImg :alt="collection.name" :src="image" class="card-img" format="webp" quality="80" placeholder />
        </div>
        
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
  .wrapper {
    overflow: hidden;
    
    &:hover {
      img {
        transition: all 0.3s ease-in;
        transform: scale(1.1, 1.1);
      }
    }
  }

  h1 {
    position: absolute;
    bottom: 3%;
    left: 3%;
    width: 100%;
  }
}
</style>
