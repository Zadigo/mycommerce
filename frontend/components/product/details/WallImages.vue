<template>
  <div class="row gy-1 d-none">
    <div id="product-multi-grid" class="col-12">
      <div class="row">
        <ProductDetailsSingleMainImage :product="product" />
        <ProductDetailsAside :product="product" :is-loading="isLoading" class="col-4 mt-4" />
      </div>
    </div>
    <component :is="imageComponent" :images="product?.images" />
  </div>
</template>

<script lang="ts" setup>
import type { ConcreteComponent } from 'vue'
import type { Product } from '~/types'

const ProductDetailsFiveImages = resolveComponent('ProductDetailsFiveImages')
const ProductDetailsSixImages = resolveComponent('ProductDetailsSixImages')

const props = defineProps({
  product: {
    type: Object as PropType<Product | null>,
    default: () => ({})
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

/**
 * Returns the proper image component to display
 * the remaining images for the given product
 */
const imageComponent = computed((): ConcreteComponent | string => {
  const imageCount = props.product.images?.length ?? 0
  return imageCount === 6 
  ? ProductDetailsSixImages
  : ProductDetailsFiveImages
})

</script>
