<template>
  <transition-group name="opacity">
    <div v-for="product in products" :key="product.id" :class="gridClass">
      <product-card :product="product" :show-like-button="showLikeButton" />
    </div>
  </transition-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import ProductCard from '@/components/products/ProductCard.vue'

/**
 * This is a simple product iterator component that
 * can be used to passively iterator over a set of
 * products anywhere in the application. This
 * allows a consistent formatting accross the website 
 */
export default defineComponent({
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
    columns: {
      type: Number,
      default: 3
    },
    showLikeButton: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    gridClass () {
      return {
        [`col-md-${this.columns} col-sm-6`]: true
        // 'col-md-3 col-sm-6': this.columns === 3,
        // 'col-md-4 col-sm-6': this.columns === 4
      }
    }
  }
})
</script>
