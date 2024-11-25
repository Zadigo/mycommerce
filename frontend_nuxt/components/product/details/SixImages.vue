<template>
  <div id="product-images-6" class="col-12">
    <div class="row g-1">
      <div v-for="image in images" :key="image.id" class="col-4">
        <v-img :src="mediaPath(image.original)" :lazy-src="mediaPath(image.original)" :alt="image.name" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ProductImage } from '~/types';

const { mediaPath } = useDjangoUtilies()

defineProps({
  images: {
    type: Array as PropType<ProductImage[]>,
    required: true,
    default: () => []
  }
})
</script>
