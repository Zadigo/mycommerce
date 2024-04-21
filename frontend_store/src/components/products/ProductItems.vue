<template>
  <div class="row gx-1 gy-1">
    <!-- <v-infinite-scroll :items="products" :on-load="handleLoadMoreProducts" :class="gridClass" class="mb-2">
      <template v-for="product in products" :key="product">
        <product-card :product="product" />
      </template>
    </v-infinite-scroll> -->
    <div v-for="product in products" :key="product.id" :class="gridClass">
      <product-card :product="product" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
// import { client } from '../../plugins/axios'
import { createMockupProducts } from '../../utils.js'

import ProductCard from './ProductCard.vue'

export default {
  name: 'ProductItems',
  components: {
    ProductCard
  },
  props: {
    gridSize: {
      type: Number,
      default: 4
    }
  },
  emits: {
    'update-products' () {
      return true
    }
  },
  async setup () {
    const products = ref([])

    async function requestProducts () {
      // client
      products.value = createMockupProducts(30)
    }
    await requestProducts()

    return {
      products
    }
  },
  computed: {
    gridClass () {
      return [
        'mb-2',
        {
          'col-sm-6 col-md-3': this.gridSize === 4,
          'col-sm-6 col-md-4': this.gridSize === 3
        }
      ] 
    }
  },
  mounted () {
    this.$emit('update-products', this.products)
  },
  methods: {
    // async handleLoadMoreProducts ({ done }) {
    //   const newProducts = Array.from({ length: 30 }, (k, v) => v + 1)
    //   this.products.push(...newProducts)
    //   done('ok')
    // }
  }
}
</script>

<style scoped>
</style>
