<template>
  <section id="product-feed" class="row">
    <div class="col-12">
      <default-filtering :products="products" :total-product-count="totalProductCount" @show-product-filters="showProductFilters=!showProductFilters" @update-grid-size="handleGridSize" />
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

    <!-- Filters -->
    <teleport to="body">
      <v-navigation-drawer id="product-filters-modal" v-model="showProductFilters" location="right" width="400" temporary>
        <div class="d-flex flex-column justify-content-around">
          <v-container class="border-bottom d-flex justify-content-between align-items-center">
            <h4 class="m-0">Filtrer</h4>
            <v-btn variant="tonal" @click="showProductFilters=false">
              <font-awesome-icon icon="['fas', 'close']" round />
            </v-btn>
          </v-container>
                
          <v-container>
            <v-expansion-panels>
              <v-expansion-panel collapse-icon="mdi-minus" expand-icon="mdi-plus">
                <v-expansion-panel-title>Trier par</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="price-filters p-2">
                    <div class="d-flex justify-content-around gap-2">
                      <v-btn variant="outlined" size="small" rounded @click="handleFilterSelection('sorted by', 'New')">Nouveautés</v-btn>
                      <v-btn variant="outlined" size="small" rounded @click="handleFilterSelection('sorted by', 'Price up')">Prix croissant</v-btn>
                      <v-btn variant="outlined" size="small" rounded @click="handleFilterSelection('sorted by', 'Price down')">Prix décroissant</v-btn>
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel collapse-icon="mdi-minus" expand-icon="mdi-plus">
                <v-expansion-panel-title>
                  Typologie
                </v-expansion-panel-title>
              </v-expansion-panel>

              <v-expansion-panel collapse-icon="mdi-minus" expand-icon="mdi-plus">
                <v-expansion-panel-title>
                  Couleur
                </v-expansion-panel-title>
              </v-expansion-panel>

              <v-expansion-panel collapse-icon="mdi-minus" expand-icon="mdi-plus">
                <v-expansion-panel-title>
                  Taille
                  <div v-if="selectedFilters.sizes.length > 0" class="badge badge-success ms-3">
                    {{ selectedFilters.sizes.length }}
                  </div>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <v-btn v-for="size in sizes.clothes" :key="size" :active="selectedFilters.sizes.includes(size)" size="small" variant="outlined" class="ms-2" rounded @click="handleFilterSelection('sizes', size)">
                    {{ size }}
                  </v-btn>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel collapse-icon="mdi-minus" expand-icon="mdi-plus">
                <v-expansion-panel-title>
                  Prix
                </v-expansion-panel-title>
                
                <v-expansion-panel-text>
                  <v-btn v-for="priceFilter in priceFilters" :key="priceFilter.value" :active="priceFilter.value===selectedFilters.price" class="me-2 mb-2" variant="outlined" size="small" color="dark" rounded @click="handleFilterSelection('price', priceFilter.value)">
                    {{ priceFilter.text }}
                  </v-btn>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-container>

          <v-container class="border-top d-flex justify-content-around gap-2">
            <v-btn color="secondary" variant="outlined" rounded @click="handleFiltersReset">
              Supprimer
            </v-btn>
            
            <v-btn color="secondary" variant="tonal" rounded @click="showProductFilters=false">
              Voir résulats ({{ products.length }})
            </v-btn>
          </v-container>
        </div>
      </v-navigation-drawer>
    </teleport>
  </section>
</template>

<script>
import { client } from 'src/plugins/axios'
import { ref, computed } from 'vue'
import { useVueSession } from 'src/plugins/vue-storages'
import { useRoute, useRouter } from 'vue-router'
import { useMessages } from 'src/stores/messages'
import { reactify, useIntersectionObserver, watchArray } from '@vueuse/core'
import { scrollToTop, useUtilities } from '@/composables/utils'

import sizes from 'src/data/sizes.json'

import DefaultFiltering from 'src/components/products/filtering/DefaultFiltering.vue'
import BaseProductIterator from 'src/components/BaseProductIterator.vue'

const priceFilters = [
  {
    text: "Jusqu'à 15€",
    value: 'Up to 15'
  },
  {
    text: "Jusqu'à 20€",
    value: 'Up to 20'
  },
  {
    text: "Jusqu'à 25€",
    value: 'Up to 25'
  },
  {
    text: "Jusqu'à 30€",
    value: 'Up to 30'
  },
  {
    text: "Jusqu'à 35€",
    value: 'Up to 40',
  },
  {
    text: "Jusqu'à 50€",
    value: 'Up to 50'
  }
]

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
    const showProductFilters = ref(false)
    const selectedFilters = ref({
      sorted_by: 'New',
      typology: [],
      colors: [],
      sizes: [],
      price: null
    })
    const { capitalizeFirstLetter, listManager } = useUtilities()

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

    /**
     * Main function for requesting new products based
     * on the filters that were selected by the user 
     */
    // async function requestFilteredProducts () {
    //   try {
    //     const response = []
    //     products.value = response
    //   } catch (e) {
    //     console.log (e)
    //   }
    // }

    watchArray(selectedFilters.value.sizes, (n) => {
      console.log(n)
      // requestFilteredProducts()
    }, {
      deep: true
    })

    return {
      sizes,
      products,
      nextPageUrl,
      intersectionTarget,
      totalProductCount,
      currentGridSize,
      isLoadingMoreProducts,
      isEndOfPage,
      showProductFilters,
      selectedFilters,
      priceFilters,
      listManager,
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
     *  
     */
    handleFilterSelection (action, value) {
      switch (action) {
        case 'sorted by':
          this.selectedFilters.sorted_by = value
          break;

        case 'typology':
          this.listManager(this.selectedFilters.typology, value)
          break;

        case 'colors':
          this.listManager(this.selectedFilters.colors, value)
          break;

        case 'sizes':
          this.listManager(this.selectedFilters.sizes, value)
          break;

        case 'price':
          this.selectedFilters.price = value
          break;
      
        default:
          break;
      }
    },
    handleFiltersReset () {
      this.selectedFilters = {
        sorted_by: 'New',
        typology: [],
        colors: [],
        sizes: [],
        price: null
      }
    }
  }
}
</script>

<style scoped>
.price-filters {
  overflow-x: scroll;
}

.price-filters::-webkit-scrollbar {
  display: none;
  scrollbar-width: none;
}
</style>
