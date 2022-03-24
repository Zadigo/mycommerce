<template>
  <section id="collection" class="ecommerce-section">

    <!-- Optional: Page Header -->
    <!-- <page-header :title="''" :content="''" :src="'http://via.placeholder.com/1200x300'" /> -->

    <div class="container-fluid">
      <div class="row">
        <div class="col-8 offset-md-2">
          <!-- Filters -->
          <filters-bar :multiple-grid-display="multipleGridDisplay" @loading-products-start="isLoading=true" @loading-products-end="isLoading=false" @change-grid="changeGrid" @do-sort="doSort" @toggle-filters="toggleFilters" />
        </div>

        <div class="col-12">
          <section id="products">
            <div class="row">
              <!-- TODO: Implement transition for all of this section especially between the filters and the products section -->
              <!-- Side Filters -->
              <!-- <side-filters :hide-filters="hideFilters" @selection-start="isLoading=true" @selection-end="isLoading=false" /> -->

              <!-- <div :class="{ 'col-10': !hideFilters, 'col-12': hideFilters }"> -->
              <div class="col-12">
                <transition name="general-transition" mode="out-in">
                  <div v-if="sortedProducts.length == 0" class="row">
                    <div class="col-md-12">
                      <b-card>
                        <b-card-text class="text-center">
                          <h2 class="p-1 mb-5">{{ $t('No products found') }}</h2>

                          <v-row>
                            <v-col cols="12">
                              <button-load-products>
                                <v-icon class="mr-2">mdi-refresh</v-icon>
                                {{ $t('Refresh page') }}
                              </button-load-products>
                            </v-col>
                          </v-row>
                        </b-card-text>
                      </b-card>
                    </div>
                  </div>

                  <!-- Products -->
                  <transition-group v-else name="card-transition" tag="div" class="row">
                    <div v-for="product in sortedProducts" :key="product.id" :class="{ 'col-lg-4': !multipleGridDisplay, 'col-lg-3': multipleGridDisplay }">
                      <card :key="product.id" :product="product" :multiple-grid-display="multipleGridDisplay" :is-loading="isLoading" :show-cart-button="true" />
                    </div>
                  </transition-group>
                </transition>

                <!-- TODO: Display product grid using flex instead of row + columns -->
                <!-- <div class="row">
                  <transition-group name="card-transition" tag="div" style="display:flex;flex-direction:row;align-items:flex-start;justify-content:flex-start;flex-wrap:wrap;">
                    <template v-for="product in sortedProducts">
                      <card :key="product.id" :product="product" :multiple-grid-display="multipleGridDisplay" :is-loading="isLoading" />
                    </template>
                  </transition-group>
                </div> -->
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <hr>  

    <!-- Pagination -->
    <pagination v-if="sortedProducts.length > 0" :product-count="sortedProducts.length" @start-pagination="isLoading=true" @end-pagination="isLoading=false" />
    
    <!-- Ad -->
    <section class="my-6">
      <v-container>
        <v-row>
          <v-col cols="12">
            <router-link :to="{ name: 'home', lang: $i18n.locale }">
              <!-- TODO: Emit a PageView when clicking on this section -->
              <v-img src="https://img.ltwebstatic.com/images3_acp/2022/02/25/164578700614872218156e3ff9868de22e7c67a145.webp"></v-img>
            </router-link>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
var _ = require('lodash')

import shopMixin from '../components/shopMixin'

import { mapGetters, mapMutations, mapState } from 'vuex'

import ButtonLoadProducts from '../components/products/ButtonLoadProducts.vue'
import Card from "../components/products/Card.vue"
// import PageHeader from "../components/products/PageHeader.vue"
import Pagination from "../components/products/Pagination.vue"
import FiltersBar from '../components/products/FiltersBar.vue'

export default {
  name: 'CollectionView',
  
  components: {
    ButtonLoadProducts,
    Card,
    // PageHeader,
    Pagination,
    FiltersBar
  },
  
  title: () => 'Shop Loungewear And Underwear', 

  mixins: [shopMixin],
  
  data: () => ({
    isLoading: true,
    multipleGridDisplay: false,
    hideFilters: false,
    sortMethod: null
  }),
  
  computed: {
    ...mapState({ products: (state) => { return state.shopModule.products } }),
    ...mapGetters(['minPrice', 'maxPrice']),

    searchedPrice: {
      get () { return this.$store.setSearchedPrices },
      set (value) { this.$store.commit('setSearchedPrices', value) }
    },

    sortedProducts() {
      // TODO: Determine whether we should send a request
      // to the database in order to refresh the products
      // when the uses the sort function

      var products = []

      // TODO: Sort by dates
      switch (this.sortMethod) {
        case 'Latest':
          products = this.sortByDates()
          break

        case 'Price high to low':
          products = this.mapPrices('desc')
          break

        case 'Price low to high':
          products = this.mapPrices('asc')
          break

        case 'Alphabetically A-Z':
          products = _.orderBy(this.products, ['name'], 'asc')
          break

        case 'Alphabetically Z-A':
          products = _.orderBy(this.products, ['name'], 'desc')
          break

        default:
          products = this.products
          break
      }

      return products
    }
  },

  watch: {
    '$route.params.collection' (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getProducts()
      }
    }
  },
  
  beforeMount () {
    this.multipleGridDisplay = this.$localstorage.retrieve('grid')
    this.hideFilters = this.$localstorage.retrieve('filters')

    this.getProducts()
    this.isLoading = false
  },

  methods: {
    ...mapMutations(['resetProducts']),

    changeGrid () {
      this.multipleGridDisplay = !this.multipleGridDisplay
      this.$localstorage.create('grid', this.multipleGridDisplay)
    },

    toggleFilters () {
      this.hideFilters = !this.hideFilters
      this.$localstorage.create('filters', this.hideFilters)
    },

    doSort(method) {
      this.sortMethod = method
      this.$localstorage.create('sort', method)
    },

    mapPrices (sortMethod) {
      var items = _.map(this.products, (item) => {
        item['unit_price'] = item['unit_price'] * 1
        item['sale_price'] = item['sale_price'] * 1
        return item
      })
      var method = sortMethod ? sortMethod : 'desc'
      return _.orderBy(items, ['unit_price'], [method])
    },

    sortByDates () {
      return this.products.sort((a, b) => {
        return new Date(b.created_on) - new Date(a.created_on)
      })
    }
  }
}
</script>

<style scoped>
.card-transition-enter-active,
.card-transition-leave-active {
    transition: all .3s ease;
}

.card-transition-enter,
.card-transition-leave-to {
  opacity: 0;
  transform: scale(.90, .90);
}

.card-transition-enter-to,
.card-transition-leave {
  opacity: 1;
  transform: scale(1, 1);
}

.card-transition-move {
  transition: all .5s ease-out;
}
</style>
