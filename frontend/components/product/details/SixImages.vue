<template>
  <div id="product-images-6" class="col-12">
    <div class="row g-1">
      <div v-for="image in allImages" :key="image.id" class="col-4">
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

const allImages = computed(() => {
  const result = props.images.map(x => x.is_main_image)
  
  if (result.length > 0) {
    return props.images.filter(x => !x.is_main_image)
  } else {
    const firstImage = props.images[0]
    return props.images.filter(x => x.id !== firstImage.id || !x.is_main_image)
  }
})
</script>
