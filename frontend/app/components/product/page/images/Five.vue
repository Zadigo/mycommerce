<template>
  <div id="product-images-five" class="grid grid-cols-1 auto-rows-min col-span-8">
    <div class="grid grid-cols-2 gap-x-1">
      <div v-for="image in images.slice(0, 2)" :key="image.id" id="image">
        <nuxt-img :src="image.original" :alt="image.name" class="cursor-zoom-in" @click="emit('zoom-image', image)">
      </div>
    </div>

    <div class="grid grid-cols-3 gap-x-1 gap-y-1 mt-1 auto-cols-max">
      <div v-for="image in images.slice(2, 5)" :key="image.id" id="image">
        <nuxt-img :src="image.original" :alt="image.name" class="cursor-zoom-in" @click="emit('zoom-image', image)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BaseImage } from '~/types'

const { mediaPath } = useDjangoUtilies()

const { images = [] } = defineProps<{ images: BaseImage[] }>()
const emit = defineEmits<{ 'zoom-image': [image: BaseImage] }>()
</script>
