<template>
  <section id="product" class="ecommerce-section">
    <div class="container-fluid">
      <div class="row">
        <!-- Breadbumbs -->
        <div class="col-12 d-none">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><router-link :to="{ name: 'home_view' }">{{ $t('Home') }}</router-link></li>
              <li class="breadcrumb-item"><router-link :to="{ name: 'collection_details_view', params: { collection: currentProduct.category.toLowerCase() } }">{{ currentProduct.category }}</router-link></li>
              <li class="breadcrumb-item active" aria-current="page">
                {{ currentProduct.name }}
              </li>
            </ol>
          </nav>
        </div>

        <!-- Images -->
        <div class="col-sm-12 col-md-7">
          <!-- <tile-display :is-new="currentProduct.display_new" :images="productImages" :product-video="currentProduct.video" /> -->
        </div>

        <div class="col-sm-12 col-md-5 ps-5">
          <div class="row">
            <!-- Tags -->
            <div v-show="currentProduct.on_sale || currentProduct.display_new" id="tags" class="col-12">
              <base-tag v-if="currentProduct.on_sale" class="mr-2" background-color="error">
                <template>
                  {{ $t('Sale') }}
                </template>
              </base-tag>

              <base-tag v-if="currentProduct.display_new" background-color="primary">
                <template>
                  {{ $t('New') }}
                </template>
              </base-tag>
            </div>

            <!-- Information -->
            <div id="information" class="col-12 pt-0 pb-0">
              <p class="fw-bold fs-4 m-0">
                {{ capitalizeLetters(currentProduct.name) }} - <span class="text-muted fw-normal">{{ currentProduct.color }}</span>
              </p>

              <p class="my-2 font-weight-bold">
                <span v-if="currentProduct.on_sale" class="mr-1 text-muted">
                  <del>{{ $n(currentProduct.unit_price, 'currency') }}</del>
                </span>

                <span v-if="currentProduct.on_sale">
                  {{ $n(currentProduct.sale_price, 'currency', $i18n.locale) }}
                </span>

                <span v-else class="fw-4 fs-24">
                  {{ $n(currentProduct.unit_price, 'currency', $i18n.locale) }}
                </span>
              </p>
            </div>

            <!-- Actions -->
            <!-- <actions :product="currentProduct" :product-variants="productVariants" /> -->

            <!-- Product Information -->
            <!-- <information :product="currentProduct" /> -->
          </div>
        </div>
      </div>

      <hr class="my-5">

      <div class="row">
        <!-- More Products -->
        <div class="col-12">
          <!-- <more-products :recommended-products="recommendedProducts" :is-loading="isLoading" /> -->
        </div>

        <!-- Recently Viewed -->
        <div class="col-12">
          <!-- <recently-viewed :is-loading="isLoading" /> -->
        </div>

        <!-- Reviews -->
        <div class="col-12">
          <!-- <reviews :reviews="[]" /> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import { mapState } from 'vuex'

// import Actions from '@/components/shop/product/Actions.vue'
// import Information from '@/components/shop/product/Information.vue'
// import MoreProducts from '@/components/shop/product/MoreProducts.vue'
// import RecentlyViewed from '@/components/shop/product/RecentlyViewed.vue'
// import ProductSkeleton from '@/components/shop/skeletons/ProductSkeleton.vue'
// import Reviews from '@/components/shop/product/reviews/Reviews.vue'
// import TileDisplay from '@/components/shop/product/images/TileDisplay.vue'


// FIXME: When viewing a product and then clicking on a product
// in the recommended, when we try to return to the previous
// product by pressing the back button in the browser, we get
// an error with url http://127.0.0.1:8000/api/v1/shop/products/undefined
// Seems like the ID is not correctly detected.

export default {
  name: 'ProductView',

  // title() {
  //   return 'this.currentProduct.name'
  // },

  components: {
    // Actions,
    // Information,
    // MoreProducts,
    // ProductSkeleton,
    // Reviews,
    // TileDisplay,
    // RecentlyViewed
  },

  data: () => ({
    isLoading: true,
    productVariants: [],
    reviews: [],
    recommendedProducts: []
  }),
  
  computed: {
    // ...mapState({
    //   currentProduct: (state) => { return state.shopModule.currentProduct }
    // }),
    
    productImages() {
      try {
        return this.currentProduct.images
      } catch (error) {
        return []
      }
    }
  },

  watch: {
    '$route.params.id'(newValue, oldValue) {
      console.log('watch', newValue, oldValue)
      if (newValue != oldValue) {
        this.isLoading = true
        this.$store.commit('setCurrentProduct', this.getProduct())
        this.$store.commit('setRecentlyViewed', newValue)
        this.$localstorage.create('recentlyViewedProducts', this.$store.getters['recentlyViewedProducts'])
        this.requestProductVariants()
        this.sendAnalytics()
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    console.log(2, to.params, from.params)
    next(vm => {
      // TODO: Set the name on the page via the product
      // vm.sendAnalytics()
      // TODO: When relaoding (or maybe even accessing the page)
      // this tries to access products/product that is not yet
      // defined. We have to define these to prevent
      // sending undefined to the recentlyViewed
      vm.$store.commit('setRecentlyViewed', to.params.id)
      vm.$localstorage.create('recentlyViewedProducts', vm.$store.getters['recentlyViewedProducts'])
    })
  },

  created() {
    console.log(1)
    // In order to get the currentProduct set,
    // reload the current list of products
    // from the session
    if (!this.$store.getters['hasProducts']) {
      this.$store.commit('setProducts', this.$session.retrieve('products'))
    }

    var product = this.getProduct()
    console.log('product', product, this.$route.params)
    this.$store.commit('setCurrentProduct', product)

    // if (!product) {
    //   this.$router.push({ name: 'not_found_view' })
    // } else {
    // }
  },

  mounted () {
    console.log(3)
    // Get the products with the same name but
    // with a different color variant
    this.requestProductVariants()
  },

  methods: {
    async requestProductVariants() {
      try {
        var response = await this.axios.post(`/shop/products/${ this.currentProduct.id }`)

        this.productVariants = response.data['variants']
        this.reviews = response.data['reviews']

        // TODO: If the recommended products is below 1, maybe propose
        // and alternative set of items to the user
        this.recommendedProducts = response.data['recommended_products']

        setTimeout(() => {
          this.isLoading = false
        }, 1000)
      } catch(error) {
        console.log(error.response.status)
        this.$store.dispatch('addErrorMessage', 'Could not get the current product')
      }
    },

    getProduct() {
      return this.$store.getters['getProduct'](this.$route.params.id)
    }
  } 
}
</script>

<style scoped>
  #more div {
    height: 500px;
    width: 100%;
    /* background-color: blue; */
    overflow-x: scroll;
    padding: 1rem;
  }

  section#product {
    height: auto;
    min-height: 600px;
  }

  #tags {
    display: flex;
    justify-content: around;
  }

  .v-image__image {
    cursor: pointer;
  }
</style>
