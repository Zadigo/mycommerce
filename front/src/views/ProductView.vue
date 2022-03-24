<template>
  <product-skeleton v-if="isLoading" />

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
      <more-products :recommended-products="recommendedProducts" :is-loading="isLoading" />

      <!-- TODO:  Implement recently viewed -->
      <!-- <recently-viewed /> -->
      
      <!-- FIXME: Implement the review section -->
      <hr>
      
      <!-- Reviews -->
      <reviews :reviews="reviews" />
    </div>

  </section>
</template>

<script>
import { mapState } from 'vuex'

// import Images from '../components/product/Images.vue'
import Information from '../components/product/Information.vue'
import MoreProducts from '../components/product/MoreProducts.vue'
import TileDisplay from '../components/product/images/TileDisplay.vue'
import ProductSkeleton from '../components/skeletons/ProductSkeleton.vue'
import Reviews from '../components/product/Reviews.vue'
// import RecentlyViewed from '../components/product/RecentlyViewed.vue'

export default {
  name: 'Product',

  title () {
    return this.currentProduct.name
  },

  components: {
    Information,
    MoreProducts,
    TileDisplay,
    ProductSkeleton,
    Reviews,
    // RecentlyViewed
  },

  data: () => ({
    isLoading: true,
    productVariants: [],
    reviews: [],
    recommendedProducts: []
  }),
  
  computed: {
    ...mapState({
      currentProduct: (state) => { return state.shopModule.currentProduct }
    }),
    
    productImages() {
      try {
        return this.currentProduct.images
      } catch (error) {
        return []
      }
    },
    
    numberOfReviews() {
      return this.reviews.length
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
        this.isLoading = true
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
    // requestProductVariants () {
    //   // TODO: Maybe if we preload all the products from
    //   // the database, we might not need to request
    //   // the variants because this relies on the front
    //   // knowing all similar products that exis in the
    //   // database in order to show the color variants
    //   this.$api.shop.products.variants(this.currentProduct)
    //   .then((response) => {
    //     this.productVariants = response.data
    //     setTimeout(() => {
    //       this.isLoading = false
    //     }, 1000);
    //   })
    //   .catch((error) => {
    //     this.$store.dispatch('addErrorMessage', error.response.statusText)
    //   })
    async requestProductVariants() {
      try {
        var response = await this.$axios.post(`/shop/products/${ this.currentProduct.id }`)

        this.productVariants = response.data['variants']
        this.reviews = response.data['reviews']

        // TODO: If the recommended products is below 1, maybe propose
        // and alternative set of items to the user
        this.recommendedProducts = response.data['recommended_products']

        setTimeout(() => {
          this.isLoading = false
        }, 1000)
      } catch(error) {
        this.$store.dispatch('addErrorMessage', error.response.statusText)
      }
    }
    // FIXME: Use mapmutations to
    // set the recently viewed product
    // methods: {
    //   ...mapMutations(['addToRecentlyViewed'])
    // }
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
</style>
