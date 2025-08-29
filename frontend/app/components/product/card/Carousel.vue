<template>
  <div class="relative">
    <button v-if="showCarousel && isHovered" type="button" class="absolute top-2/5 left-3 py-5 rounded-full z-10 w-5 place-content-center hover:opacity-60 flex" @click="() => { prev() }">
      <Icon name="i-fa7-solid:caret-left" />
    </button>
    
    <NuxtLinkLocale id="link-product-carousel" :to="`/shop/${product.id}`" @click="emit('has-navigated', [index, product])">
      <img v-if="!isLoading && isReady" :src="state.original" :alt="state.name" class="self-center aspect-square w-full rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-full">
      <TailSkeleton v-else class="w-full h-[188px] md:min-h-[600px] bg-gray-100 rounded-md" />
    </NuxtLinkLocale >

    <button v-if="showCarousel && isHovered" type="button" class="absolute top-2/5 right-3 py-5 rounded-full z-10 w-5 place-content-center hover:opacity-60" @click="() => { next() }">
      <Icon name="i-fa7-solid:caret-right" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useImage } from '@vueuse/core'
import type { Product } from '~/types'

const { index, product, isHovered, showCarousel = false } = defineProps<{
  index: number
  product: Product
  isHovered?: boolean
  showCarousel?: boolean
}>()

/** 
 * This emit is used to indicate to parents
 * hosting this component that a navigation occured. This
 * is useful for Google Analytics for example or for passing
 * information on a product on which the link was clicked
 */
const emit = defineEmits<{ 'has-navigated': [data: (number | Product)[]] }>()

const cleanImages = useArrayMap(product.images, (image) => {
  if (image.original.startsWith('/')) {
    image.original = `${useRuntimeConfig().public.prodDomain}${image.original}`
  }

  return image
})
const { state, index: cycleIndex, next, prev } = useCycleList(cleanImages)
const { isLoading, isReady } = useImage({ src: isDefined(state) ? state.value.original : '' })

console.log('Img', isLoading.value, isReady.value)
</script>
