<template>
  <div class="relative cursor-pointer has-[.selected]:opacity-50 transition-opacity duration-500" @click="selected = !selected">
    <div class="absolute top-0 right-0">
      <nuxt-badge v-if="image.is_main_image" label="Main" />
    </div>

    <div :class="{ 'selected': selected }" class="overflow-hidden w-full h-full">
      <img class="h-auto max-w-full rounded-lg object-cover object-center hover:scale-105 transition-transform duration-200" :src="image.mid_size" :alt="image.name">
    </div>

    <div id="info" class="absolute bottom-0 left-0 right-0 bg-black/50 bg-opacity-50 text-white p-2 text-sm text-center rounded-b-lg">
      <p>{{ image.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductImage } from '~/types'
  
const props = defineProps<{ image: ProductImage }>()
const emit = defineEmits<{ select: [state: boolean, image: ProductImage] }>()

/**
 * Selection
 */

const selected = ref<boolean>(false)
watch(selected, (newValue) => { emit('select', newValue, props.image) })
</script>
