<template>
  <section id="collection">

    <!-- Page Header -->
    <page-header :title="''" :content="''" :src="'http://via.placeholder.com/1200x300'" />

    <div class="container">
      <page-nav :multiple-grid-display="multipleGridDisplay" @change-grid="changeGrid" @do-sort="doSort" @toggle-filters="toggleFilters" />

      <section id="products" class="mb-4">
        <div class="row">
          <!-- Side Filters -->
          <side-filters :hide-filters="hideFilters" @selection-start="isLoading=true" @selection-end="isLoading=false" />

          <!-- Products -->
          <div :class="{ 'col-10': !hideFilters, 'col-12': hideFilters }">
            <transition-group name="card-transition" tag="div" class="row">
              <div v-for="product in sortedProducts" :key="product.id" :class="{ 'col-lg-4': !multipleGridDisplay, 'col-lg-3': multipleGridDisplay }">
                <card :product="product" :multiple-grid-display="multipleGridDisplay" :is-loading="isLoading" />
              </div>
            </transition-group>

            <!-- TODO: Display product grid using flex instead of row + columns -->
            <!-- <div class="row">
              <transition-group name="card-transition" tag="div" style="display:flex;flex-direction:row;align-items:flex-start;justify-content:flex-start;flex-wrap:wrap;">
                <template v-for="product in sortedProducts">
                  <card :key="product.id" :product="product" :multiple-grid-display="multipleGridDisplay" :is-loading="isLoading" />
                </template>
              </transition-group>
            </div> -->

            <div v-if="sortedProducts.length == 0" class="row">
              <div class="col-md-12">
                <b-card>
                  <b-card-text class="text-center">
                    <h2>
                      {{ $t('No products') }}
                    </h2>
                  </b-card-text>
                </b-card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <hr>  

    <!-- Pagination -->
    <pagination v-if="sortedProducts.length > 0" :product-count="sortedProducts.length" @is-loading="isLoading=true" @end-loading="isLoading=false" />
    
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

import { mapGetters, mapState } from 'vuex'

import Card from "../components/products/Card.vue"
import PageHeader from "../components/products/PageHeader.vue"
import Pagination from "../components/products/Pagination.vue"
import PageNav from '../components/products/PageNav.vue'
import SideFilters from '../components/products/SideFilters.vue'

export default {
  name: 'CollectionView',
  
  components: {
    Card,
    PageHeader,
    Pagination,
    PageNav,
    SideFilters
  },
  
  title: () => 'Shop Loungewear And Underwear', 
  
  data: () => ({
    isLoading: true,
    multipleGridDisplay: false,
    hideFilters: false,
    sortMethod: null
  }),
  
  computed: {
    ...mapState({ products: (state) => { return state.shopModule.products } }),
    ...mapGetters(['searchedProducts', 'minPrice', 'maxPrice']),

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
        case 'Price high to low':
          products = _.orderBy(this.searchedProducts, ['unit_price'], ['desc'])
          break

        case 'Price low to high':
          products = _.orderBy(this.searchedProducts, ['unit_price'], ['asc'])
          break

        default:
          products = this.searchedProducts
          break
      }

      return products
    }
  },
  
  beforeMount () {
    this.multipleGridDisplay = this.$localstorage.get('grid')
    this.hideFilters = this.$localstorage.get('filters')
    // var settings = this.getLocalStorageSettings()
    // this.multipleGridDisplay = settings['grid']
    // this.hideFilters = settings['filters']

    // To prevent excess backend querying
    //  store the produts in the session
    // on the client side
    var products = this.$session.get('products')

    if (_.isUndefined(products)) {
      this.isLoading = true
      this.$api.shop.products.all()
      .then((response) => {
        products = response.data
        this.$store.commit('setProducts', products)
        this.$session.set('products', products)
      })
      .catch((error) => {
        this.$store.dispatch('addErrorMessage', error.response.statusText)
      })
    } else {
      this.$store.commit('setProducts', products)
    }

    setTimeout(() => {
      this.isLoading = false
    }, 1000);
  },

  methods: {
    // TODO: Create a localstorage plugin that allows
    // us to run these functions more easily +
    // create a unique function that does the
    // getting and the setting at once when passing
    // a key and a value
    changeGrid () {
      this.multipleGridDisplay =! this.multipleGridDisplay

      var settings = this.getLocalStorageSettings()
      settings['grid'] = this.multipleGridDisplay
      this.setLocalStorageSettings(settings)
    },

    toggleFilters () {
      this.hideFilters =! this.hideFilters

      var settings = this.getLocalStorageSettings()
      settings['filters'] = this.hideFilters
      this.setLocalStorageSettings(settings)
    },

    doSort(method) {
      this.sortMethod = method
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
