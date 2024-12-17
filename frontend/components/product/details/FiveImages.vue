<template>
  <div id="product-images-5" class="col-12">
    <div class="row g-1">
      <div v-for="image in firstImages" :key="image.id" class="col-6">
        <v-img :src="mediaPath(image.original)" :lazy-src="mediaPath(image.original)" :alt="image.name" />
      </div>

      <div v-for="image in lastImages" :key="image.id" class="col-4">
        <v-img :src="mediaPath(image.original)" :lazy-src="mediaPath(image.original)" :alt="image.name" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ProductImage } from '~/types';

const { mediaPath } = useDjangoUtilies()

const props = defineProps({
  images: {
    type: Array as PropType<ProductImage[]>,
    required: true,
    default: () => []
  }
})

const firstImages = computed(() => {
  return props.images.slice(0, 2)
})

const lastImages = computed(() => {
  return props.images.slice(2, props.images.length)
})
</script>
