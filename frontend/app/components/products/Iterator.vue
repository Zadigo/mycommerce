<template>
  <template v-if="products.length > 0">
    <div id="products" :class="gridClass">
      <div v-for="(product, i) in products" id="product" :key="product.node.id">
        <product-card-base :index="i" :product="product" :show-like-button="showLikeButton" :show-cart="showCart" :show-prices="showPrices" :show-carousel="true" :delay="300" v-motion-slide-bottom @has-navigated="handleNavigation" />
      </div>
    </div>
  </template>

  <div v-else>
    <p>Aucun produit à afficher.</p>
  </div>
</template>

<script setup lang="ts">
import { useHandleGridSize } from '~/composables/use/grid'
import { productsSymbol } from '~/data/constants/symbols'
import type { ProductNode } from '~/types'

const emit = defineEmits<{
  // This emit is used to indicate to parent components
  // hosting this component that a navigation occured.This
  // is useful for Google Analytics for example
  'has-navigated': [data: (number | ProductNode)[]]
}>()

const { showPrices = true, showCart = true, showLikeButton = true, quantity = 8 } = defineProps<{
  columns?: number
  showLikeButton?: boolean
  showCart?: boolean
  showPrices?: boolean,
  quantity?: number
}>()

// Function used to indicate to the parent that an
// item within this block has been clicked for navigation
function handleNavigation(data: (number | ProductNode)[]) {
  emit('has-navigated', data)
}

const products = inject<MaybeRef<ProductNode[]>>(productsSymbol, [])

console.log('Iterator', products)

/**
 * Grid
 */

const { gridClass } = useHandleGridSize()
</script>
