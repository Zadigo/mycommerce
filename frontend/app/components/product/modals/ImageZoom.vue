<template>
  <volt-drawer id="image-zoom" v-model:visible="showModal" position="full" :modal="false">
    <div class="px-20 my-2 relative overflow-y-scroll">
      <div v-if="selectedImage" :style="{ backgroundImage: `url(${selectedImage.original})` }" class="w-full h-full bg-center bg-no-repeat bg-cover cursor-zoom-out z-30" @click="() => { toggleShowModal() }" />

      <div v-if="product && selectedImage" id="image-choices" class="flex flex-col gap-3 absolute top-1/12 right-1/12">
        <nuxt-img v-for="(otherImage, idx) in product.node.productImages" :key="idx" :class="{ 'selected': otherImage.id ===  selectedImage.id }" :src="otherImage.thumbnail" class="aspect-square object-fill w-25 z-50"  @click="selectImage(otherImage, () => $emit('select-image', otherImage))" />
      </div>
    </div>
  </volt-drawer>
</template>

<script setup lang="ts">
import type { ProductNode, Undefineable } from '~/types';

const props = defineProps<{ product: Undefineable<ProductNode> }>()

/**
 * Store
 */

const { selectedImage, showModal, toggleShowModal, selectImage } = useImageZoomComposableStore()
</script>
