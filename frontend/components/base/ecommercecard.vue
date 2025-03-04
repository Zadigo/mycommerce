<template>
<div class="group relative" @mouseover="showCart=true" @mouseleave="showCart=false">
  <!-- Single Image -->
  <!-- <NuxtLink :to="`/products/${product.id}`">
    <img :src="product.get_main_image.original" :alt="product.get_main_image.name" class="w-full lg:aspect-auto">
  </NuxtLink> -->

  <!-- Carousel -->
  <div class="relative">
    <button v-if="showCart" type="button" class="absolute top-2/4 left-3 py-5 rounded-full z-10 w-5 place-content-center hover:opacity-60 flex" @click="handlePreviousImage">
      <Icon name="fa:caret-left" class="" />
    </button>
    
    <NuxtLink :to="`/products/${product.id}`">
      <img :src="currentImage.original" :alt="currentImage.name" :aria-label="currentImage.name" class="self-center aspect-square w-full rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-full">
    </NuxtLink>

    <button v-if="showCart" type="button" class="absolute top-2/4 right-3 py-5 rounded-full z-10 w-5 place-content-center hover:opacity-60" @click="handleNextImage">
      <Icon name="fa:caret-right" class="" />
    </button>
  </div>
  
  <div v-show="showCart" class="absolute w-full flex justify-center align-middle transition-all ease-in-out z-50 invisible lg:visible lg:bottom-[3.5rem]">
    <div class="bg-white p-5 w-full m-1">
      <p class="fw-semibold text-sm text-center mb-3 font-normal" aria-label="">
        Sélectionne une taille
      </p>

      <div class="flex justify-center flex-wrap gap-2">
        <button v-for="size in product.sizes" :key="size.id" type="button" class="py-1 px-1 text-sm flex gap-1 place-items-center underline-offset-4 transition-all duration-200 hover:underline hover:font-semibold" aria-label="">
        <!-- <button v-for="size in product.sizes" :key="size.id" type="button" class="py-1 px-4 rounded-full text-sm flex gap-1 place-items-center hover:bg-gray-50" aria-label=""> -->
          <Icon v-if="!size.availability" name="fa-regular:clock" size="11" class="text-orange-400" />
          <span>{{ size.name }}</span>
        </button>
      </div>
    </div>
  </div>

  <div class="mt-4 flex justify-between align-top gap-5">
    <div>
      <h3 class="text-sm text-gray-700">
        <NuxtLink :to="`/products/${product.id}`" aria-label="">
          <span aria-hidden="true" class="absolute inset-0" />
          {{ product.name }}
        </NuxtLink>
      </h3>

      <!-- <p class="mt-1 text-sm text-gray-500">
        Black
      </p> -->
      <p class="font-semibold text-sm">
        {{ product.unit_price }}
      </p>
    </div>
    
    <!-- <p class="text-sm font-medium text-gray-900">
      35€
    </p> -->
    <div class="flex align-center">
      <button type="button" class="bg-white rounded-full p-2" @click="isLiked=!isLiked">
        <Icon v-if="isLiked" name="fa:heart" size="13" />
        <Icon v-else name="fa-regular:heart" size="13" />
      </button>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Product } from '~/types';

const currentIndex = ref<number>(0)
const showCart = ref(false)
const isLiked = ref(false)

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true
  }
})

const numberOfImages = computed(() => props.product.images.length)
const currentImage = computed(() => props.product.images[currentIndex.value])

function handlePreviousImage() {
  const nextIndex = currentIndex.value - 1
  if (nextIndex <= 0) {
    currentIndex.value = numberOfImages.value - 1
  } else {
    currentIndex.value = nextIndex
  }
}

function handleNextImage() {
  const nextIndex = currentIndex.value + 1
  if (nextIndex >= numberOfImages.value) {
    currentIndex.value = 0
  } else {
    currentIndex.value = nextIndex
  }
}
</script>
