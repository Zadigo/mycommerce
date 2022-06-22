<template>
  <div class="col-12">
    <!-- Statistics -->
    <p class="text-center text-muted m-0 mt-3 mb-3">{{ $tc('styles_found', sortedProducts.length) }}</p>

    <!-- Products -->
    <div class="row">
      <div v-for="product in sortedProducts" :key="product.id" class="col-sm-2 col-md-3">
        <product-card :key="product.id" :product="product" :is-loading="isLoading" />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import dayjs from '@/plugins/dayjs'

import { getCurrentInstance } from 'vue'
import { useShop } from '@/store/shop'
import { useRoute } from 'vue-router'
import { mapState } from 'pinia'

import ProductCard from '@/components/shop/products/ProductCard.vue'

import useShopComposable from '@/composables/shop'

export default {
  name: 'ProductItems',
  components: {
    ProductCard
  },
  setup () {
    const store = useShop()
    const app = getCurrentInstance()
    const route = useRoute()
    const { isLoading, productsRequest, getProducts } = useShopComposable(app, route)
    return {
      store,
      isLoading,
      productsRequest,
      getProducts
    }
  },
  data: () => ({
    // isLoading: true,
    hideFilters: false,
    multipleGridDisplay: false,
    sortMethod: null,
    searchedPrice: []
  }),
  computed: {
    ...mapState(useShop, ['minPrice', 'maxPrice', 'products']),

    // searchedPrice: {
    //   get () { return this.$store.setSearchedPrices },
    //   set (value) { this.$store.commit('setSearchedPrices', value) }
    // },

    sortedProducts () {
      // TODO: Determine whether we should send a request
      // to the database in order to refresh the products
      // when the uses the sort function
      let products = []

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
      // When leaving the page, this still triggers
      // sending a request with undefined so make sure
      // that newValue is actually defined
      if (newValue !== undefined && newValue !== oldValue) {
        this.getProducts()
      }
    }
  },  
  created () {  
    this.productsRequest()
    this.isLoading = false
  },
  methods: {
    changeGrid () {
      this.multipleGridDisplay = !this.multipleGridDisplay
      this.$localstorage.create('grid', this.multipleGridDisplay)
    },

    doSort (method) {
      this.sortMethod = method
      this.$localstorage.create('sort', method)
    },

    mapPrices (sortMethod) {
      // Transform each price into a numeric and
      // then return the products using the
      // selected ordering method
      const items = _.map(this.products, (item) => {
        item.unit_price = item.unit_price * 1
        item.sale_price = item.sale_price * 1
        item.get_price = item.get_price * 1
        return item
      })

      const method = sortMethod || 'desc'
      return _.orderBy(items, ['get_price'], [method])
    },

    sortByDates () {
      return this.products.sort((a, b) => {
        return dayjs(a.created_on) - dayjs(b.created_on)
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
