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
import { useVueSession } from 'src/plugins/vue-storages'
import { useRoute, useRouter } from 'vue-router'
import { useMessages } from 'src/stores/messages'

import ProductCard from './ProductCard.vue'

/**
 * This product iterator requests a specific collection
 * on setup(). This is an async component that is used
 * mainly for the products/collection page because it
 * requires the products to be loaded from the database
 * on initialization 
 */
export default {
  name: 'AsyncProductsFeed',
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
    const router = useRouter()
    const route = useRoute()
    const { instance } = useVueSession()

    const cachedResponse = ref({})
    const products = ref([])

    const messagesStore = useMessages()

    async function requestProducts () {
      try {
        const collectionName = route.params.id
        const response = await client.get(`collection/${collectionName}`)
        cachedResponse.value = response.data
        products.value = cachedResponse.value.results
        instance.create('products', response.data)
      } catch (e) {
        // If we fail to get the collectionName
        // redirect to the 404 page
        messagesStore.addNetworkError()
        console.error(e)

        if (e.response.status === 404) {
          router.push({ name: 'not_found' })
        }
      }
    }
    await requestProducts()

    const nextPageUrl = computed(() => {
      return cachedResponse.value.next
    })

    return {
      products,
      nextPageUrl,
      requestProducts
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
    /**
     * This is the main pagination function that is
     * used to load more products on the page when
     * the trigger section is reached
     * 
     * @param {{Function}} The triggering element  
     */
    async handleLoadMoreProducts ({ done }) {
      const newProducts = Array.from({ length: 30 }, (k, v) => v + 1)
      this.products.push(...newProducts)
      done('ok')
    }
  }
}
</script>
