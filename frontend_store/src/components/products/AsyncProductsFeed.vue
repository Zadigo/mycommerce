<template>
  <section class="row">
    <div class="col-12">
      <default-filtering :products="products" @update-grid-size="handleGridSize" />
    </div>

    <div class="row gx-1 gy-1">
      <base-product-iterator :products="products" :columns="currentGridSize" />
    </div>
  </section>
</template>

<script>
import { client } from 'src/plugins/axios'
import { ref, computed } from 'vue'
import { useVueSession } from 'src/plugins/vue-storages'
import { useRoute, useRouter } from 'vue-router'
import { useMessages } from 'src/stores/messages'

import DefaultFiltering from 'src/components/products/filtering/DefaultFiltering.vue'
import BaseProductIterator from 'src/components/BaseProductIterator.vue'

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
    BaseProductIterator,
    DefaultFiltering
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

    const currentGridSize = ref(3)

    const cachedResponse = ref({})
    const products = ref([])

    const messagesStore = useMessages()

    async function requestProducts () {
      try {
        const collectionName = route.params.id
        const collectionUrlPath = `collection/${collectionName}`

        if (instance.keyExists(collectionUrlPath)) {
          cachedResponse.value = instance.retrieve(collectionUrlPath)
        } else {
          const response = await client.get(collectionUrlPath)
          instance.create(collectionUrlPath, response.data)
          cachedResponse.value = response.data
        }
        products.value = cachedResponse.value.results
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
      currentGridSize,
      requestProducts
    }
  },
  computed: {
    gridClass () {
      return [
        {
          'col-sm-6 col-md-3': this.currentGridSize === 4,
          'col-sm-6 col-md-4': this.currentGridSize === 3
        }
      ] 
    }
  },
  watch: {
    '$route.params.id' (n, o) {
      if (n !== o) {
        this.requestProducts()
      }
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
      console.log('Loading more products')
      done('ok')
    },
    /**
     * Changes the size of the grid to
     * reduce or increase the amount of
     * products displayed on the screen
     * 
     * @param {Number} size 
     */
    handleGridSize (size) {
      this.currentGridSize = size
    },
  }
}
</script>
