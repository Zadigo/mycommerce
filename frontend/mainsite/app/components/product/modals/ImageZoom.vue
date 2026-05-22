<template>
  <volt-drawer id="image-zoom" v-model:visible="showModal" position="full" :modal="false">
    <div class="relative overflow-y-scroll w-full h-full">
      <div v-if="selectedImage" :style="{ backgroundImage: `url(${selectedImage.original})` }" class="w-full min-h-350 bg-center bg-no-repeat bg-cover cursor-zoom-out z-30" @click="() => { toggleShowModal() }" />

      <div v-if="product && selectedImage" id="image-choices" class="flex flex-col gap-3 absolute top-5 right-5">
        <nuxt-img v-for="(otherImage, idx) in product.node.productImages" :key="idx" :class="{ 'opacity-90 border-2': otherImage.id ===  selectedImage.id }" :src="otherImage.thumbnail" class="aspect-square object-fill w-25 z-50 cursor-pointer"  @click="selectImage(otherImage, () => $emit('select-image', otherImage))" />
      </div>
    </div>
  </volt-drawer>
</template>

<script setup lang="ts">
import type { ProductNode, Undefineable } from '~/types'

const props = defineProps<{ product: Undefineable<ProductNode> }>()

/**
 * Store
 */

const { selectedImage, showModal, toggleShowModal, selectImage } = useImageZoomComposableStore()
</script>
