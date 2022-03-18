<template>
  <!-- TODO: Create unique reusable component for the skeletons -->
  <section v-if="isLoading">
    <div class="container">
      <div class="row">
        <div class="col-md-12 d-flex justify-content-left">
          <b-skeleton width="10%" />
          <b-skeleton width="10%" class="ml-2" />
          <b-skeleton width="10%" class="ml-2" />
        </div>
        
        <div class="col-md-7">
          <div class="row">
            <div class="col-12">
              <div class="row">
                <div class="col-2">
                  <b-skeleton-img v-for="i in 3" :key="i" height="80px" class="mb-2" />
                </div>

                <div class="col-10">
                  <b-skeleton-img height="600px" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-5">
          <b-skeleton width="100%" class="mt-3" />
          <b-skeleton width="50%" class="mt-3" />
          <b-skeleton width="30%" class="mt-3" />

          <div id="actions" class="d-flex justify-content-left my-5">
            <b-skeleton width="30%" />
            <b-skeleton width="30%" class="mx-2" />
            <b-skeleton width="30%" />
          </div>
          
          <b-skeleton width="100%" height="200px" class="mt-3" />
          <b-skeleton width="100%" height="200px" class="mt-3" />
        </div>
      </div>
    </div>
  </section>

  <section v-else id="product" class="space my-9">
    <div class="container-fluid dark-grey-text mt-5">

      <div class="row">
        <!-- <div class="col-12">
          <b-breadcrumb :items="breadcrumbs" class="pl-1"></b-breadcrumb>
        </div> -->

        <!-- Images -->
        <div class="col-md-7">
          <tile-display :is-new="currentProduct.display_new" :images="productImages" :product-video="currentProduct.video" />
          <!-- <images :is-new="currentProduct.display_new" :images="productImages" :product-video="currentProduct.video" /> -->
        </div>

        <!-- Information -->
        <div class="col-md-5">
          <information :product="currentProduct" :number-of-reviews="numberOfReviews" :product-variants="productVariants" />
        </div>
      </div>

      <hr class="my-8">

      <!-- More -->
      <more-products />

      <!-- TODO:  Implement recently viewed -->
      <!-- <recently-viewed /> -->
      
      <!-- FIXME: Implement the review section -->
      <!-- <hr> -->
      
      <!-- Reviews -->
      <!-- <reviews :reviews="currentProductReviews" /> -->
    </div>

  </section>
</template>

<script>
import { mapState } from 'vuex'

// import Images from '../components/product/Images.vue'
import Information from '../components/product/Information.vue'
import MoreProducts from '../components/product/MoreProducts.vue'
import TileDisplay from '../components/product/images/TileDisplay.vue'
// import Reviews from '../components/product/Reviews.vue'
// import RecentlyViewed from '../components/product/RecentlyViewed.vue'

export default {
  name: 'Product',

  title () {
    return this.currentProduct.name
  },

  components: {
    Information,
    MoreProducts,
    TileDisplay
    // Images,
    // Reviews,
    // RecentlyViewed
  },

  data: () => ({
    isLoading: true,
    productVariants: []
  }),
  
  computed: {
    ...mapState({
      currentProduct: (state) => { return state.shopModule.currentProduct },
      currentProductReviews: (state) => { return state.shopModule.currentProductReviews },
    }),
    
    productImages() {
      try {
        return this.currentProduct.images
      } catch (error) {
        return []
      }
    },
    
    numberOfReviews() {
      return this.currentProductReviews.length
    },

    

    // breadcrumbs() {
    //   return [
    //       {
    //         text: 'Home',
    //         to: 'home'
    //       },
    //       {
    //         text: 'Collections',
    //         to: 'collection_all'
    //       },
    //       {
    //         text: this.currentProduct.name,
    //         active: false
    //       }
    //     ]
    // }
  },

  watch: {
    '$route.params.id'(newValue, oldValue) {
      if (newValue != oldValue) {
        this.$store.commit('setCurrentProduct', newValue)
        this.$store.commit('setRecentlyViewed', newValue)
        this.$localstorage.create('recentlyViewedProducts', this.$store.getters['recentlyViewedProducts'])
        this.requestProductVariants()
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    console.log(2)
    next(vm => {
      // TODO: When relaoding (or maybe even accessing the page)
      // this tries to access products/product that is not yet
      // defined. We have to define these to prevent
      // sending undefined to the recentlyViewed
      vm.$store.commit('setRecentlyViewed', to.params.id)
      // vm.$session.set('recentlyViewedProducts', vm.$store.state.shopModule.recentlyViewed)
      vm.$localstorage.create('recentlyViewedProducts', vm.$store.getters['recentlyViewedProducts'])
    })
  },

  created () {
    console.log(1)
    // In order to get the currentProduct set,
    // reload the current list of products
    // from the session
    if (!this.$store.getters['hasProducts']) {
      this.$store.commit('setProducts', this.$session.retrieve('products'))
    }

    var product = this.$store.getters['getProduct'](this.$route.params.id)
    this.$store.commit('setCurrentProduct', product)
  },

  mounted () {
    console.log(3)
    // Get the products with the same name but
    // with a different color variant
    this.requestProductVariants()
  },

  methods: {
    requestProductVariants () {
      // TODO: Maybe if we preload all the products from
      // the database, we might not need to request
      // the variants because this relies on the front
      // knowing all similar products that exis in the
      // database in order to show the color variants
      this.$api.shop.products.variants(this.currentProduct)
      .then((response) => {
        this.productVariants = response.data
        setTimeout(() => {
          this.isLoading = false
        }, 1000);
      })
      .catch((error) => {
        this.$store.dispatch('addErrorMessage', error.response.statusText)
      })
    }
  }
  
  // FIXME: Use mapmutations to
  // set the recently viewed product
  // methods: {
  //   ...mapMutations(['addToRecentlyViewed'])
  // }
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
</style>
