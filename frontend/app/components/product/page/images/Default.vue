<template>
  <div id="product-images-default" class="grid grid-cols-2 auto-rows-min gap-1 col-span-8">
    <div v-for="image in images" :key="image.id" id="image" class="cursor-zoom-in">
      <nuxt-img :src="image.original" :alt="image.name" class="cursor-zoom-in w-full" @click="emit('zoom-image', image)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ProductImage } from '~/types';

const { mediaPath } = useDjangoUtilies()
const { images = [] } = defineProps<{ images: ProductImage[] }>()
const emit = defineEmits<{ 'zoom-image': [image: ProductImage] }>()
</script>
