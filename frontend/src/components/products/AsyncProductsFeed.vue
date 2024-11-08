<template>
  <section id="product-feed" class="row">
    <!-- Filtering -->
    <div class="col-12">
      <default-filtering :products="products" :total-product-count="totalProductCount" @show-product-filters="showProductFilters=!showProductFilters" @update-grid-size="handleGridSize" />
    </div>

    <!-- Products -->
    <div class="row gx-1 gy-1">
      <base-product-iterator :products="priceLimitProducts" :columns="currentGridSize" />
    </div>

    <div ref="moreProductsIntersect" class="fw-bold text-uppercase d-flex justify-content-center mt-5">
      <v-btn v-if="isEndOfPage" size="x-large" variant="tonal" rounded flat @click="scrollToTop">
        <font-awesome-icon :icon="['fas', 'arrow-up']" class="me-2" />
        {{ $t('Tu es arrivé à la fin') }}
      </v-btn>
      
      <div v-else class="flex-grow">
        <v-progress-circular v-if="isLoadingMoreProducts" :size="50" color="dark" indeterminate />

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
            <h4 class="m-0">
              {{ $t("Filtrer") }}
            </h4>

            <v-btn variant="tonal" @click="showProductFilters=false">
              <font-awesome-icon icon="close" round />
            </v-btn>
          </v-container>
                
          <v-container>
            <v-expansion-panels>
              <!-- Filter By -->
              <v-expansion-panel collapse-icon="mdi-minus" expand-icon="mdi-plus">
                <v-expansion-panel-title>Trier par</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="price-filters p-2">
                    <div class="d-flex justify-content-around gap-2">
                      <v-btn v-for="sortingFilter in sortingFilters" :key="sortingFilter[0]" :active="selectedFilters.sorted_by===sortingFilter[0]" variant="outlined" size="small" rounded @click="handleFilterSelection('sorted by', sortingFilter[0])">
                        {{ $t(sortingFilter[1]) }}
                      </v-btn>
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel collapse-icon="mdi-minus" expand-icon="mdi-plus">
                <v-expansion-panel-title>
                  {{ $t("Typologie") }}
                </v-expansion-panel-title>
              </v-expansion-panel>
              
              <!-- Color -->
              <v-expansion-panel collapse-icon="mdi-minus" expand-icon="mdi-plus">
                <v-expansion-panel-title>
                  {{ $t("Couleur") }}
                </v-expansion-panel-title>
              </v-expansion-panel>

              <!-- Size -->
              <v-expansion-panel collapse-icon="mdi-minus" expand-icon="mdi-plus">
                <v-expansion-panel-title>
                  {{ $t("Taille") }}

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

              <!-- Price -->
              <v-expansion-panel collapse-icon="mdi-minus" expand-icon="mdi-plus">
                <v-expansion-panel-title>
                  {{ $t("Prix") }}
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
              {{ $t("Supprimer") }}
            </v-btn>
            
            <v-btn color="secondary" variant="tonal" rounded @click="showProductFilters=false">
              Voir résulats ({{ priceLimitProducts.length }})
            </v-btn>
          </v-container>
        </div>
      </v-navigation-drawer>
    </teleport>
  </section>
</template>

<script lang="ts">
import { scrollToTop, useUtilities } from '@/composables/utils'
import { client } from '@/plugins/axios'
import { useVueSession } from '@/plugins/vue-storages'
import { useMessages } from '@/stores/messages'
import { Product, ProductsAPIResponse } from '@/types/shop'
import { reactify, useIntersectionObserver, watchArray } from '@vueuse/core'
import { AxiosError } from 'axios'
import { computed, defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import sizes from '@/data/sizes.json'

import BaseProductIterator from '@/components/BaseProductIterator.vue'
import DefaultFiltering from '@/components/products/filtering/DefaultFiltering.vue'

type Actions = 'sorted by' | 'typology' | 'colors' | 'sizes' | 'price'

interface SelectedFilters {
  sorted_by: string,
  typology: string[],
  colors: string[],
  sizes: string[],
  price: string | null
}

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

const sortingFilters = [
  ['New', 'Nouveautés'],
  ['Price up', 'Prix croissant'],
  ['Price down', 'Prix décroissant']
]

/**
 * This product iterator requests a specific collection
 * on setup(). This is an async component that is used
 * mainly for the products/collection page because it
 * requires the products to be loaded from the database
 * on initialization 
 */
export default defineComponent({
  name: 'AsyncProductsFeed',
  components: {
    BaseProductIterator,
    DefaultFiltering
  },
  emits: {
    'update-products' (_products: Product[]) {
      return true
    }
  },
  async setup () {
    const showProductFilters = ref(false)
    const selectedFilters = ref<SelectedFilters>({
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

    const cachedResponse = ref<ProductsAPIResponse>()
    const products = ref<Product[]>([])

    const messagesStore = useMessages()
    const intersectionTarget = ref<HTMLElement | null>(null)
    
    /**
     * Returns the collection of products based
     * on the limit offset values 
     */
    async function requestProducts () {
      try {
        const collectionName = route.params.id        
        const collectionUrlPath = `collection/${collectionName}`
        const response = await client.get<ProductsAPIResponse>(collectionUrlPath)

        instance.create(collectionUrlPath, response.data)

        cachedResponse.value = response.data
        products.value = response.data.results
        instance.create('products', products.value)
      } catch (e) {
        if (e instanceof AxiosError && e.response) {
          if (e.response.status === 404) {
            router.push({ name: 'not_found' })
          } else {
            messagesStore.addNetworkError()
          }
        }
      }
    }
    await requestProducts()

    // Provide the total product count for all children
    // since they do not have that information on load
    const totalProductCount = computed(() => {
      if (cachedResponse.value) {
        return cachedResponse.value.count
      } else {
        return 0
      }
    })

    const isLoadingMoreProducts = ref(false)
    const offsetsList = ref<string[]>([])
    
    /**
     * This is the main pagination function that is
     * used to load more products on the page when
     * the trigger section is reached
     */
    async function requestOffsetProducts (offset: string | number) {
      try {
        const collectionUrlPath = `${route.path.toString().replace('/shop/', '/')}?offset=${offset}`

        // TODO: If the user has applied filters to the products, we need
        // to request products with the exact same filters

        const response = await client.get<ProductsAPIResponse>(collectionUrlPath)

        instance.create(collectionUrlPath, response.data)
        cachedResponse.value = response.data

        products.value.push(...response.data.results)
        instance.create('products', products.value)
      } catch (e) {
        if (e instanceof AxiosError && e.response) {
          messagesStore.addNetworkError()
        }
      }
    }

    const nextPageUrl = computed(() => {
      if (cachedResponse.value) {
        return cachedResponse.value.next
      } else {
        return ''
      }
    })

    const isEndOfPage = computed(() => {
      return (
        nextPageUrl.value === null ||
        nextPageUrl.value === ''
      )
    })

    /**
     * Get the limit offset values for an url in order to
     * return the offset products 
     */
    const urlLimitOffsetValues  = reactify((url: string): (string | null)[] | boolean => {
      try {
        const urlObject = new URL(url)
        const limit = urlObject.searchParams.get('limit')
        const offset = urlObject.searchParams.get('offset')
        
        if (offset) {
          offsetsList.value.push(offset)
        }

        return [limit, offset]
      } catch {
        return false
      }
    })

    useIntersectionObserver(intersectionTarget, ([{ isIntersecting }]) => {
      if (isIntersecting && nextPageUrl.value !== null) {
        const offset = urlLimitOffsetValues(nextPageUrl)
        
        if (offset) {
          isLoadingMoreProducts.value = isIntersecting
          requestOffsetProducts(offset.value[1])
        } else {
          isLoadingMoreProducts.value = false
        }
      } else {
        isLoadingMoreProducts.value = false
      }
    }, {})

    watchArray(selectedFilters.value.sizes, (_n) => {
      // Logic
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
      sortingFilters,
      priceFilters,
      listManager,
      capitalizeFirstLetter,
      scrollToTop,
      urlLimitOffsetValues,
      requestProducts
    }
  },
  computed: {
    /**
     * 
     */
    gridClass () {
      return [
        {
          'col-sm-6 col-md-3': this.currentGridSize === 4,
          'col-sm-6 col-md-4': this.currentGridSize === 3
        }
      ]
    },
    /**
     * Sorts the products shown by price
     */
    sortedProducts () {
      const products = [...this.products]

      if (this.selectedFilters.sorted_by === 'New') {
        return this.products
      } else if (this.selectedFilters.sorted_by === 'Price up') {
        return products.sort((a, b) => {
          return b.get_price - a.get_price
        })
      } else if (this.selectedFilters.sorted_by === 'Price down') {
        return products.sort((a, b) => {
          return a.get_price - b.get_price
        })
      } else {
        return this.products
      }
    },
    /**
     * Return products whose price is lower or equal
     * to the specified price limit 
     */
    priceLimitProducts () {
      let limitNumber

      switch (this.selectedFilters.price) {
        case 'Up to 15':
          limitNumber = 15
          break;
        
        case 'Up to 20':
          limitNumber = 20
          break;

        case 'Up to 25':
          limitNumber = 25
          break;

        case 'Up to 30':
          limitNumber = 30
          break;
        
        case 'Up to 35':
          limitNumber = 35
          break;

        case 'Up to 50':
          limitNumber = 50
          break;
      
        default:
          limitNumber = null
          break;
      }

      if (!limitNumber) {
        return this.sortedProducts
      } else {
        return this.sortedProducts.filter((product) => product.get_price <= limitNumber)
      }
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
    this.intersectionTarget = this.$refs.moreProductsIntersect as HTMLElement | null
  },
  methods: {
    /**
     * Changes the size of the grid to
     * reduce or increase the amount of
     * products displayed on the screen
     */
    handleGridSize (size: number) {
      this.currentGridSize = size
    },
    /**
     * Receives a filter and then sorts
     */
    handleFilterSelection (action: Actions, value: string) {
      switch (action) {
        case 'sorted by':
          this.selectedFilters.sorted_by = value
          break;

        case 'typology':
          this.listManager<string[]>(this.selectedFilters.typology, value)
          break;

        case 'colors':
          this.listManager<string[]>(this.selectedFilters.colors, value)
          break;

        case 'sizes':
          this.listManager<string[]>(this.selectedFilters.sizes, value)
          break;

        case 'price':
          this.selectedFilters.price = value
          break;
      
        default:
          break;
      }
    },
    /**
     *  
     */
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
})
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
