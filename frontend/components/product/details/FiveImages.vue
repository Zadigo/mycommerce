<template>
  <div id="product-images" class="grid grid-cols-1 grid-rows-2 col-span-8 auto-cols-min auto-rows-max">
    <div class="grid grid-cols-2 gap-x-1">
      <div v-for="image in images.slice(0, 2)" :key="image.id" id="image">
        <img :src="mediaPath(image.original, '/placeholder.svg')" :alt="image.name" class="cursor-zoom-in" @click="emit('zoom-image', image)">
      </div>
    </div>

    <div class="grid grid-cols-3 gap-x-1 gap-y-1 mt-1 auto-cols-max">
      <div v-for="image in images.slice(2, 5)" :key="image.id" id="image">
        <NuxtImg :src="mediaPath(image.original, '/placeholder.svg')" :alt="image.name" class="cursor-zoom-in" @click="emit('zoom-image', image)" />
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

const emit = defineEmits({
  'zoom-image'(image: ProductImage) {
    return true
  }
})
</script>
