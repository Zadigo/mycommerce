<template>
  <template v-if="products.length > 0">
    <div id="products" :class="gridClass">
      <div v-for="(product, idx) in products" :id="`product__${product.node.id}`" :key="product.node.id">
        <product-card-base :index="idx" :product="product" :show-like-button="showLikeButton" :show-cart="showCart" :show-prices="showPrices" :show-carousel="true" :delay="300" v-motion-slide-bottom @has-navigated="$emit('has-navigated', idx)" />
      </div>
    </div>
  </template>

  <div v-else>
    <p class="text-center">Aucun produit à afficher.</p>
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
  'has-navigated': [index: number]
}>()

const { showPrices = true, showCart = true, showLikeButton = true, quantity = 8 } = defineProps<{
  columns?: number
  showLikeButton?: boolean
  showCart?: boolean
  showPrices?: boolean,
  quantity?: number
}>()

const products = inject<MaybeRef<ProductNode[]>>(productsSymbol, [])

/**
 * Grid
 */

const { gridClass } = useHandleGridSize()
</script>
