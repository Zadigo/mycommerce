<template>
  <section id="product" class="ecommerce-section">
    <div class="container-fluid">
      <div class="row">
        <!-- Breadbumbs -->
        <div class="col-12">

        </div>

        <!-- Images -->
        <div class="col-sm-12 col-md-7">
          <tile-display :is-new="currentProduct.display_new" :images="productImages" :product-video="currentProduct.video" />
        </div>

        <div class="col-sm-12 col-md-5 ps-5">
          <div class="row">
            <!-- Tags -->
            <div id="tags" class="col-12">
              <base-tag v-if="currentProduct.on_sale" background-color="error">
                <template>
                  {{ $t('Sale') }}
                </template>
              </base-tag>
            </div>

            <!-- Information -->
            <div id="information" class="col-12 pt-0 pb-0">
              <p class="font-weight-bold font-size-3 m-0">
                {{ currentProduct.name|capitalizeLetters }}
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
            <actions :product="currentProduct" :product-variants="productVariants" :sizes="sizes" />

            <!-- Additional Information -->
            <information :product="currentProduct" />
          </div>
        </div>
      </div>

      <hr class="my-5">

      <div class="row">
        <div class="col-12">
          <more-products :recommended-products="recommendedProducts" :is-loading="isLoading" />
        </div>

        <div class="col-12">
          <recently-viewed :is-loading="isLoading" />
        </div>

        <div class="col-12">
          <reviews :reviews="[]" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'

import Actions from '@/components/shop/product/Actions.vue'
import Information from '@/components/shop/product/Information.vue'
import MoreProducts from '@/components/product/MoreProducts.vue'
import RecentlyViewed from '@/components/shop/product/RecentlyViewed.vue'
// import ProductSkeleton from '@/components/shop/skeletons/ProductSkeleton.vue'
import Reviews from '@/components/product/Reviews.vue'
import TileDisplay from '@/components/product/images/TileDisplay.vue'


export default {
  name: 'ProductView',

  title() {
    return this.currentProduct.name
  },

  components: {
    Actions,
    Information,
    MoreProducts,
    // ProductSkeleton,
    Reviews,
    TileDisplay,
    RecentlyViewed
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

    breadcrumbs() {
      return [
        {
          text: this.$t('Home'),
          to: 'home'
        },
        {
          text: this.$route.params.collection,
          to: 'collection_details',
          params: { collection: this.$route.params.collection }
        },
        {
          text: this.currentProduct.name,
          active: false
        }
      ]
    },

    hasDescription() {
      return this.product == undefined
    },

    sizes() {
      // Return all the size options for the given product
      return _.filter(this.currentProduct.additional_variants, (variant) => {
        return variant.category === 'Size'
      })
    }
  },

  watch: {
    '$route.params.id'(newValue, oldValue) {
      if (newValue != oldValue) {
        this.isLoading = true
        this.$store.commit('setCurrentProduct', newValue)
        this.$store.commit('setRecentlyViewed', newValue)
        this.$localstorage.create('recentlyViewedProducts', this.$store.getters['recentlyViewedProducts'])
        this.requestProductVariants()
        this.sendAnalytics()
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    console.log(2)
    next(vm => {
      // TODO: Set the name on the page via the product
      vm.sendAnalytics()
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

    var product = this.$store.getters['getProduct'](this.$route.params.id)
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

    sendAnalytics() {
      var product = this.currentProduct
      product
      // this.$analytics.google.viewItem({
      //   index : this.$store.getters['productIndex'](product),
      //   item_id: product.id,
      //   item_name: product.name,
      //   item_variant: product.color,
      //   price: product.get_price,
      //   discount: product.sale_value
      // })
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
