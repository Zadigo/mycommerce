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
import { ref, computed } from 'vue'
import { client } from 'src/plugins/axios'
import { useRoute, useRouter } from 'vue-router'

// import { createMockupProducts } from '../../utils.js'

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
  setup () {
    const router = useRouter()
    const route = useRoute()

    const cachedResponse = ref({})
    const products = ref([])

    async function requestProducts () {
      // products.value = createMockupProducts(30)
      try {
        // TODO: Get the collection to get from
        // the url parameters
        const collectionName = route.params.id
        collectionName

        const response = await client.get(`collection/all`)
        cachedResponse.value = response.data
        products.value = cachedResponse.value.results
      } catch (e) {
        // If we fail to get the collectionName
        // redirect to the 404 page
        if (e.response.status === 404) {
          router.push({
            name: 'not_found'
          })
        }
        console.error(e)
      }
    }
    requestProducts()

    const nextPageUrl = computed(() => {
      // Independently save the url for
      // retrieving the data for the
      // next page
      return cachedResponse.value.next
    })

    return {
      products,
      nextPageUrl
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
