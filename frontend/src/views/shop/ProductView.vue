<doc>
  Shows specific details of a product:
    - Images
    - Price (discount)
    - Description
    - Recommended products
    - Reviews
</doc>

<template>
  <section id="product" class="ecommerce-section">
    <div class="container-fluid">
      <div class="row">
        <!-- Breadbumbs -->
        <div v-if="breakpoints.isGreater('sm')" class="col-12">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'shop_view', params: { lang: $i18n.locale } }" class="text-muted">
                  {{ $t('Home') }}
                </router-link>
              </li>

              <li class="breadcrumb-item">
                <router-link :to="{ name: 'collection_details_view', params: { collection: currentProduct.category.toLowerCase() } }" class="text-muted">{{ currentProduct.category }}</router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">{{ currentProduct.name }}</li>
            </ol>
          </nav>
        </div>

        <!-- Images -->
        <div class="col-sm-12 col-md-7">
          <tile-display v-if="productImages.length > 0" :images="productImages" :product-video="currentProduct.video" />
          <img v-else :src="require('@/assets/placeholder.png')" class="img-fluid" alt="Image">
        </div>

        <!-- Product information -->
        <div :class="{ 'ps-5': breakpoints.isGreater('sm') }" class="col-sm-12 col-md-5 pt-1">
          <div class="row">
            <!-- Tags -->
            <div v-show="currentProduct.on_sale || currentProduct.display_new" id="tags" class="col-12 d-flex justify-content-start w-100">
              <base-tag v-if="currentProduct.on_sale" class="me-2 mb-3" background-color="bg-danger">
                {{ $t('Sale') }}
              </base-tag>

              <base-tag v-if="currentProduct.display_new" class="mb-3" background-color="bg-primary">
                {{ $t('New') }}
              </base-tag>
            </div>

            <!-- Information -->
            <div id="information" class="col-12 pt-0 pb-0">
              <p class="fw-bold fs-5 m-1">
                {{ capitalizeLetters(currentProduct.name) }} - <span class="text-muted">{{ currentProduct.color }}</span>
              </p>

              <p class="mb-1 fs-4">
                <!-- Original price -->
                <span v-if="currentProduct.on_sale" class="me-2 fs-6 fw-light text-muted">
                  <del>{{ $n(currentProduct.unit_price * 1, 'currency', $i18n.locale) }}</del>
                </span>

                <!-- Discounted price -->
                <span v-if="currentProduct.on_sale" class="fw-bold fs-4">
                  {{ $n(currentProduct.sale_price * 1, 'currency', $i18n.locale) }}
                </span>

                <!-- Original price -->
                <span v-else :class="{ 'text-danger': currentProduct.on_sale }" class="fw-normal fs-3 fw-bolder">
                  {{ $n(currentProduct.unit_price * 1, 'currency', $i18n.locale) }}
                </span>

                <span v-if="currentProduct.on_sale" class="p-1 bg-danger text-white ms-2 rounded fs-5 fw-bold">
                  {{ formatAsPercentage(currentProduct.sale_value, true) }}
                </span>
              </p>
            </div>

            <!-- Actions -->
            <product-actions :product="currentProduct" :product-variants="productVariants" />

            <!-- Product Information -->
            <product-information :product="currentProduct" />
          </div>
        </div>
      </div>

      <hr class="my-5">

      <div class="row mt-5">
        <!-- More Products -->
        <div class="col-12">
          <more-products-vue :recommended-products="recommendedProducts" :is-loading="isLoading" />
        </div>

        <!-- Recently Viewed -->
        <div class="col-12 mt-5">
          <recently-viewed-vue :is-loading="isLoading" />
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
import { useShop } from '@/store/shop'
import { mapState } from 'pinia'
import { getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { useUtilities } from '@/composables/utils'

import useShopComposable from '@/composables/shop'


import BaseTag from '@/layouts/shop/BaseTag.vue'
import ProductActions from '@/components/shop/product/ProductActions.vue'
import ProductInformation from '@/components/shop/product/ProductInformation.vue'
import MoreProductsVue from '@/components/shop/product/MoreProducts.vue'
import RecentlyViewedVue from '@/components/shop/product/RecentlyViewed.vue'
// import ProductSkeleton from '@/components/shop/skeletons/ProductSkeleton.vue'
// import Reviews from '@/components/shop/product/reviews/Reviews.vue'
import TileDisplay from '@/components/shop/product/images/TileDisplay.vue'

export default {
  name: 'ProductView',
  components: {
    ProductActions,
    BaseTag,
    ProductInformation,
    MoreProductsVue,
    RecentlyViewedVue,
    TileDisplay
    // ProductSkeleton,
    // Reviews,
  },
  setup () {
    const store = useShop()
    const app = getCurrentInstance()
    const route = useRoute()
    const { isLoading } = useShopComposable(app, route)
    const breakpoints = useBreakpoints(breakpointsTailwind)
    const { formatAsPercentage, capitalizeLetters } = useUtilities()
    return {
      store,
      isLoading,
      capitalizeLetters,
      formatAsPercentage,
      breakpoints
    }
  },
  data: () => ({
    productVariants: [],
    reviews: [],
    recommendedProducts: []
  }),
  computed: {
    ...mapState(useShop, ['currentProduct']),
    productImages () {
      try {
        return this.currentProduct.images
      } catch (error) {
        return []
      }
    }
  },
  watch: {
    '$route.params.id' (current, previous) {
      // When leaving the page, this still triggers
      // sending a request with undefined so make sure
      // that newValue is actually defined
      if (current && current !== previous) {
        this.isLoading = true
        this.store.getProduct(current)
        this.requestProductVariants()
      }
    }
  },
  beforeMount () {
    this.store.reloadProducts()
    this.store.getProduct(this.$route.params.id)
  },
  mounted () {
    // Get the products with the same name but
    // with a different color variant
    this.requestProductVariants()

    const index = this.store.getProductIndex(this.$route.params.id)
    this.$analytics.google.viewItem({
      item_name: this.currentProduct.name,
      price: this.currentProduct.get_price
    }, this.$route.params.collection, index)
  },
  methods: {
    async requestProductVariants () {
      try {
        const response = await this.$http.post(`/shop/products/${this.currentProduct.id}`)

        this.productVariants = response.data.variants
        this.reviews = response.data.reviews

        // TODO: If the recommended products is below 1, maybe propose
        // and alternative set of items to the user
        this.recommendedProducts = response.data.recommended_products

        setTimeout(() => {
          this.isLoading = false
        }, 1000)
      } catch (error) {
        this.store.addErrorMessage('Could not return variants for the current product')
      }
    }
  }
}
</script>

<style scoped>
#more div {
  height: 500px;
  width: 100%;
  overflow-x: scroll;
  padding: 1rem;
}
/* 
#tags {
  display: flex;
  justify-content: left;
} */

.breadcrumb a:hover {
  color: #eee;
  text-decoration: underline;
}
</style>
