<template>
  <div id="product-images" class="grid grid-cols-2 auto-rows-min gap-1 col-span-8">
    <div v-for="image in images" :key="image.id" id="image" class="cursor-zoom-in">
      <NuxtImg :src="mediaPath(image.original, '/placeholder.svg')" :alt="image.name" class="cursor-zoom-in w-full" @click="emit('zoom-image', image)" />
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
