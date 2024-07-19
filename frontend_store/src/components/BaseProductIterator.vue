<template>
  <transition-group name="opacity">
    <div v-for="product in products" :key="product.id" :class="gridClass">
      <product-card :product="product" :show-like-button="showLikeButton" />
    </div>
  </transition-group>
</template>

<script>
import ProductCard from 'src/components/products/ProductCard.vue'

/**
 * This is a simple product iterator component that
 * can be used to passively iterator over a set of
 * products anywhere in the application. This
 * allows a consistent formatting accross the website 
 */
export default {
  name: 'BaseProductIterator',
  components: {
    ProductCard
  },
  props: {
    products: {
      type: Array,
      required: true,
      default: () => []
    },
    gridClass: {
      type: String,
      default: 'col-md-4 col-sm-3'
    },
    showLikeButton: {
      type: Boolean,
      default: true
    }
  },
  setup () {
    return {

    }
  }
}
</script>
