<template>
  <div :class="`col-${columns}`">
    <v-img v-if="firstImage" :src="firstImage.original" class="product-image img-fluid" @click="selectImage(firstImage, () => emit('select-image', firstImage))" />
    <BaseSkeleton v-else :loading="true" height="550px" />
  </div>
  
  <div :class="`col-${columns}`">
    <v-img v-if="secondImage" :src="secondImage.original" class="product-image img-fluid" @click="selectImage(secondImage, () => emit('select-image', secondImage))" />
    <BaseSkeleton v-else :loading="true" height="550px" />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Product, ProductImage } from '~/types';

const props = defineProps({
  product: {
    type: Object as PropType<Product | null>,
    default: () => ({})
  },
  indexes: {
    type: Array as PropType<number[]>,
    required: true
  },
  columns: {
    type: Number,
    default: 6
  }
})

const emit = defineEmits({
  'select-image' (_image: ProductImage) {
    return true
  }
})

const { selectImage } = useImages()

const images = computed(() => {
  if (props.product) {
    return props.product.images
  } else {
    return []
  }
})

const firstImage = computed(() => {
  return images.value[props.indexes[0]]
})

const secondImage = computed(() => {
  return images.value[props.indexes[1]]
})
</script>
