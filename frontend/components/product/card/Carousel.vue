<template>
  <div class="relative">
    <button v-if="showCarousel && isHovered" type="button" class="absolute top-2/5 left-3 py-5 rounded-full z-10 w-5 place-content-center hover:opacity-60 flex" @click="handlePreviousImage">
      <Icon name="fa:caret-left" class="" />
    </button>
    
    <NuxtLink id="link-product-card-carousel" :to="`/shop/${product.id}`" @click="emit('has-navigated')">
      <img v-if="currentImage" :src="mediaPath(currentImage?.original, '/placeholder.svg')" :alt="currentImage?.name" :aria-label="currentImage?.name" class="self-center aspect-square w-full rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-full">
      <TailSkeleton v-else class="w-full h-[188px] md:h-[423px] bg-gray-100 rounded-md" />
    </NuxtLink>

    <button v-if="showCarousel && isHovered" type="button" class="absolute top-2/5 right-3 py-5 rounded-full z-10 w-5 place-content-center hover:opacity-60" @click="handleNextImage">
      <Icon name="fa:caret-right" class="" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Product } from '~/types'

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true
  },
  isHovered: {
    type: Boolean,
    default: false
  },
  showCarousel: {
    type: Boolean,
    default: true
  },
})

const emit = defineEmits({
  /** 
   * This emit is used to indicate to parents
   * hosting this component that a navigation occured. This
   * is useful for Google Analytics for example or for passing
   * information on a product on which the link was clicked
   */
  'has-navigated'() {
    return true
  }
})

const { mediaPath } = useDjangoUtilies()

const currentIndex = ref<number>(0)

const numberOfImages = computed(() => props.product.images?.length || 0)

/**
 * 
 */
const currentImage = computed(() => {
  if (props.product.images) {
    return props.product.images[currentIndex.value]
  }
  return null
})

/**
 * 
 */
function handlePreviousImage() {
  const nextIndex = currentIndex.value - 1
  if (nextIndex <= 0) {
    currentIndex.value = numberOfImages.value - 1
  } else {
    currentIndex.value = nextIndex
  }
}

/**
 * 
 */
function handleNextImage() {
  const nextIndex = currentIndex.value + 1
  if (nextIndex >= numberOfImages.value) {
    currentIndex.value = 0
  } else {
    currentIndex.value = nextIndex
  }
}
</script>
