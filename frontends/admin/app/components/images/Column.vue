<template>
  <div class="relative cursor-pointer has-[.selected]:opacity-50 transition-opacity duration-500" @click="() => { select(image) }">
    <div class="absolute top-0 right-0">
      <nuxt-badge v-if="image.isMainImage" label="Main" />
    </div>

    <div :class="{ 'selected': selected }" class="overflow-hidden w-full h-full rounded-lg">
      <nuxt-img class="h-auto max-w-full object-cover object-center hover:scale-105 transition-transform duration-200" :src="mediaUrl(image.original)" :alt="image.name" />
    </div>

    <div id="info" class="absolute bottom-0 left-0 right-0 bg-black/50 bg-opacity-50 text-white p-2 text-sm text-center rounded-b-lg">
      <p>{{ image.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BaseImage } from '~/types'
  
const props = defineProps<{ image: BaseImage }>()
const emit = defineEmits<{ select: [state: boolean, image: BaseImage] }>()

/**
 * Selection
 */

const { isSelected, select } = provideImageAssociation()
const selected = isSelected(props.image)
</script>
