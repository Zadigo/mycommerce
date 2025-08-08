<template>
  <div class="relative">
    <button v-if="showCarousel && isHovered" type="button" class="absolute top-2/5 left-3 py-5 rounded-full z-10 w-5 place-content-center hover:opacity-60 flex" @click="() => decrement()">
      <Icon name="i-fa7-solid:caret-left" />
    </button>
    
    <NuxtLinkLocale id="link-product-carousel" :to="`/shop/${product.id}`" @click="emit('has-navigated', [index, product])">
      <img v-if="currentImage" :src="mediaPath(currentImage?.original, '/placeholder.svg')" :alt="currentImage?.name" :aria-label="currentImage?.name" class="self-center aspect-square w-full rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-full">
      <TailSkeleton v-else class="w-full h-[188px] md:h-[423px] bg-gray-100 rounded-md" />
    </NuxtLinkLocale >

    <button v-if="showCarousel && isHovered" type="button" class="absolute top-2/5 right-3 py-5 rounded-full z-10 w-5 place-content-center hover:opacity-60" @click="() => increment()">
      <Icon name="i-fa7-solid:caret-right" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

const props = defineProps<{
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

const { mediaPath } = useDjangoUtilies()
const { numberOfImages } = useProductComposable(props.product)

const { count, inc: increment, dec: decrement } = useCounter(0, {
  max: numberOfImages.value - 1,
})

// const currentIndex = ref<number>(0)
const currentImage = computed(() => {
  if (props.product.images) {
    // return props.product.images[currentIndex.value]
    return props.product.images[count.value]
  }
  return null
})

/**
 * 
 */
// function handlePreviousImage() {
//   const nextIndex = currentIndex.value - 1
//   if (nextIndex <= 0) {
//     currentIndex.value = numberOfImages.value - 1
//   } else {
//     currentIndex.value = nextIndex
//   }
// }

/**
 * 
 */
// function handleNextImage() {
//   const nextIndex = currentIndex.value + 1
//   if (nextIndex >= numberOfImages.value) {
//     currentIndex.value = 0
//   } else {
//     currentIndex.value = nextIndex
//   }
// }
</script>
