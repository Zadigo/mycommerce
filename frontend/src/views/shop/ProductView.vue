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
              <li class="breadcrumb-item active" aria-current="page">{{ currentProduct.name }}</li>
            </ol>
          </nav>
        </div>

        <!-- Images -->
        <div class="col-sm-12 col-md-7">
          <tile-display :is-new="currentProduct.display_new" :images="productImages" :product-video="currentProduct.video" />
        </div>

        <div class="col-sm-12 col-md-5 ps-5">
          <div class="row">
            <!-- Tags -->
            <div v-show="currentProduct.on_sale || currentProduct.display_new" id="tags" class="col-12">
              <base-tag v-if="currentProduct.on_sale" class="mr-2" background-color="bg-danger">
                {{ $t('Sale') }}
              </base-tag>

              <base-tag v-if="currentProduct.display_new" background-color="bg-primary">
                {{ $t('New') }}
              </base-tag>
            </div>

            <!-- Information -->
            <div id="information" class="col-12 pt-0 pb-0">
              <p class="fw-bold fs-4 m-0">
                {{ capitalizeLetters(currentProduct.name) }} - <span class="text-muted fw-normal">{{ currentProduct.color }}</span>
              </p>

              <!-- <p class="my-2 font-weight-bold">
                <span v-if="currentProduct.on_sale" class="mr-1 text-muted">
                  <del>{{ $n(currentProduct.unit_price, 'currency') }}</del>
                </span>

                <span v-if="currentProduct.on_sale">
                  {{ $n(currentProduct.sale_price, 'currency', $i18n.locale) }}
                </span>

                <span v-else class="fw-4 fs-24">
                  {{ $n(currentProduct.unit_price, 'currency', $i18n.locale) }}
                </span>
              </p> -->
            </div>

            <!-- Actions -->
            <product-actions :product="currentProduct" :product-variants="productVariants" />

            <!-- Product Information -->
            <product-information :product="currentProduct" />
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
import { capitalizeLetters } from '@/utils'
import { useShop } from '@/store/shop'
import { mapState } from 'pinia'

import BaseTag from '@/layouts/shop/BaseTag.vue'
import ProductActions from '@/components/shop/product/ProductActions.vue'
import ProductInformation from '@/components/shop/product/ProductInformation.vue'
// import MoreProducts from '@/components/shop/product/MoreProducts.vue'
// import RecentlyViewed from '@/components/shop/product/RecentlyViewed.vue'
// import ProductSkeleton from '@/components/shop/skeletons/ProductSkeleton.vue'
// import Reviews from '@/components/shop/product/reviews/Reviews.vue'
import TileDisplay from '@/components/shop/product/images/TileDisplay.vue'

export default {
  name: 'ProductView',
  components: {
    ProductActions,
    BaseTag,
    ProductInformation,
    // MoreProducts,
    // ProductSkeleton,
    // Reviews,
    TileDisplay,
    // RecentlyViewed
  },
  setup() {
    var store = useShop()

    store.$onAction((name, store, after) => {
      if (name == 'getProduct') {
        after(() => {
          console.info('GetProduct action')
          this.$localstorage.create('recentlyViewedProducts', store.recentlyViewedProducts)
        })
      }
    })

    return {
      store,
      capitalizeLetters
    }
  },
  data: () => ({
    isLoading: true,
    productVariants: [],
    reviews: [],
    recommendedProducts: []
  }),
  computed: {
    ...mapState(useShop, ['currentProduct']),
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
      // When leaving the page, this still triggers
      // sending a request with undefined so make sure
      // that newValue is actually defined
      if (newValue != undefined && newValue != oldValue) {
        this.isLoading = true
        this.store.getProduct(newValue)
        this.requestProductVariants()
        this.$localstorage.create('recentlyViewedProducts', this.store.recentlyViewedProducts)
        // this.sendAnalytics()
      }
    }
  },
  beforeMount() {
    // In order to get the currentProduct set,
    // reload the current list of products
    // from the session
    if (this.store.products.length == 0) {
      this.store.$patch({
        products: this.$localstorage.retrieve('products')
      })
    }
    this.store.getProduct(this.$route.params.id)
    this.$localstorage.create('recentlyViewedProducts', this.store.recentlyViewedProducts)
  },
  mounted () {
    // Get the products with the same name but
    // with a different color variant
    this.requestProductVariants()
    // this.sendAnalytics()
  },
  methods: {
    async requestProductVariants() {
      try {
        var response = await this.axios.post(`/shop/products/${this.currentProduct.id}`)

        this.productVariants = response.data['variants']
        this.reviews = response.data['reviews']

        // TODO: If the recommended products is below 1, maybe propose
        // and alternative set of items to the user
        this.recommendedProducts = response.data['recommended_products']

        setTimeout(() => {
          this.isLoading = false
        }, 1000)
      } catch(error) {
        this.store.addErrorMessage('Could not get the current product')
      }
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
