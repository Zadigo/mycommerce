<template>
  <div ref="carouselEl" :id="`carousel-product__${product.node.id}`" class="relative">
    <button v-if="showCarousel && isHovered && isLargeScreen" type="button" class="absolute top-2/5 left-3 py-5 rounded-full z-10 w-15 h-50 place-content-center hover:opacity-60 flex" @click="() => { prev() }">
      <icon name="i-fa7-solid:caret-left" />
    </button>

    <!-- {{ isLargeScreen }} -->

    <nuxt-link-locale id="link-product-carousel" :to="`/shop/${product.node.id}`" @click="emit('has-navigated', index)">
      <img v-if="!isLoading && isReady" :src="state.original" :alt="state.name" class="self-center aspect-square w-full rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-full">
      <volt-skeleton v-else class="min-h-100 rounded-md" />
    </nuxt-link-locale>

    <button v-if="showCarousel && isHovered && isLargeScreen" type="button" class="absolute top-2/5 right-3 py-5 rounded-full z-10 w-15 h-50 place-content-center hover:opacity-60 flex" @click="() => { next() }">
      <icon name="i-fa7-solid:caret-right" />
    </button>

    <!-- Indicators -->
    <div class="flex absolute bottom-20 left-1/2 transform -translate-x-1/2 gap-2 z-20">
      <div v-for="idx in product.node.productImages.length" :class="{ 'bg-primary-200/80': cycleIndex === (idx - 1) }" class="w-3 h-3 bg-primary-50/20 backdrop-blur-md rounded-full transition-all ease-in-out duration-300" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useImage } from '@vueuse/core'
import type { ProductNode } from '~/types'

const { index, product, isHovered, showCarousel = false } = defineProps<{
  index: number
  product: ProductNode
  isHovered?: boolean
  showCarousel?: boolean
}>()

/** 
 * This emit is used to indicate to parents
 * hosting this component that a navigation occured. This
 * is useful for Google Analytics for example or for passing
 * information on a product on which the link was clicked
 */
const emit = defineEmits<{ 'has-navigated': [index: number] }>()

const cleanImages = useArrayMap(product.node.productImages, (image) => {
  // if (image.original.startsWith('/')) {
  //   image.original = `${useRuntimeConfig().public.prodDomain}${image.original}`
  // }

  return image
})

const { state, index: cycleIndex, next, prev } = useCycleList(cleanImages)
const { isLoading, isReady } = useImage({ src: isDefined(state) ? state.value.original : '' })

/**
 * Large screen detection
 */

const isLargeScreen = useMediaQuery('(min-width: 1600px)')

/**
 * Smaller screen handling
 */

const carouselEl = useTemplateRef<HTMLImageElement | null>('carouselEl')

if (import.meta.client && !isLargeScreen.value) {
  const { direction } = useSwipe(carouselEl)

  watch(direction, (newDirection) => {
    console.log(newDirection)
    if (newDirection === 'left') {
      next()
    } else if (newDirection === 'right') {
      prev()
    }
  })
}
</script>
