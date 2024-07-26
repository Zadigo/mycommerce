<template>
  <section class="row">
    <div class="col-12">
      <default-filtering :products="products" :total-product-count="totalProductCount" @update-sorting="handleSorting" @update-grid-size="handleGridSize" />
    </div>

    <div class="row gx-1 gy-1">
      <base-product-iterator :products="products" :columns="currentGridSize" />
    </div>

    <div ref="moreProductsIntersect" class="fw-bold text-uppercase d-flex justify-content-center mt-5">
      <v-btn v-if="isEndOfPage" size="x-large" variant="tonal" rounded flat @click="scrollToTop">
        <font-awesome-icon :icon="['fas', 'arrow-up']" class="me-2" />
        {{ $t('Tu es arrivé à la fin') }}
      </v-btn>
      
      <div v-else class="flex-grow">
        <v-progress-circular v-if="isLoadingMoreProducts" :size="50" color="dark" indeterminate></v-progress-circular>

        <v-btn v-else size="x-large" variant="tonal" rounded flat>
          <font-awesome-icon :icon="['fas', 'arrow-down']" class="me-2" />
          {{ $t('Voir plus de produits') }}
        </v-btn>
      </div>
    </div>
  </section>
</template>

<script>
import { client } from 'src/plugins/axios'
import { ref, computed } from 'vue'
import { useVueSession } from 'src/plugins/vue-storages'
import { useRoute, useRouter } from 'vue-router'
import { useMessages } from 'src/stores/messages'
import { reactify, useIntersectionObserver } from '@vueuse/core'
import { scrollToTop, useUtilities } from '@/composables/utils'

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
    const { capitalizeFirstLetter } = useUtilities()

    const router = useRouter()
    const route = useRoute()
    const { instance } = useVueSession()

    const currentGridSize = ref(3)

    const cachedResponse = ref({})
    const products = ref([])

    const messagesStore = useMessages()
    const intersectionTarget = ref(null)

    /**
     * Returns the collection of products based
     * on the limit offset values 
     */
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
        instance.create('products', products.value)
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

    // Provide the total product count for all children
    // since they do not have that information on load
    const totalProductCount = ref(cachedResponse.value.count)
    const isLoadingMoreProducts = ref(false)
    const offsetsList = ref([])
    
    /**
     * This is the main pagination function that is
     * used to load more products on the page when
     * the trigger section is reached
     * 
     * @param {String} offset The value to offset by
     */
    async function requestOffsetProducts (offset) {
      try {
        const collectionUrlPath = `${route.path.toString().replace('/shop/', '/')}?offset=${offset}`
        const response = await client.get(collectionUrlPath)

        instance.create(collectionUrlPath, response.data)
        cachedResponse.value = response.data
        products.value.push(...cachedResponse.value.results)
        instance.create('products', products.value)
      } catch (e) {
        console.error(e)
      }
    }

    const nextPageUrl = computed(() => {
      return cachedResponse.value.next
    })
    const isEndOfPage = computed(() => {
      return nextPageUrl.value === null
    })

    /**
     * Get the limit offset values for an url in order to
     * return the offset products 
     */
    const urlLimitOffsetValues  = reactify((url) => {
      const urlObject = new URL(url)
      const limit = urlObject.searchParams.get('limit')
      const offset = urlObject.searchParams.get('offset')
      
      offsetsList.value.push(offset)
      return [limit, offset]
    })

    const currentSorting = ref(null)

    useIntersectionObserver(intersectionTarget, ([{ isIntersecting }]) => {
      if (isIntersecting && nextPageUrl.value !== null) {
        const offset = urlLimitOffsetValues(nextPageUrl)

        isLoadingMoreProducts.value = isIntersecting
        requestOffsetProducts(offset.value[1])
      } else {
        isLoadingMoreProducts.value = false
      }
    }, {
    })

    return {
      products,
      nextPageUrl,
      intersectionTarget,
      totalProductCount,
      currentGridSize,
      isLoadingMoreProducts,
      isEndOfPage,
      currentSorting,
      capitalizeFirstLetter,
      scrollToTop,
      urlLimitOffsetValues,
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
    this.intersectionTarget = this.$refs.moreProductsIntersect
  },
  methods: {
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
    /**
     * @param {String} sorting The sorting value
     */
    handleSorting (sorting) {
      this.currentSorting = sorting
    }
  }
}
</script>
