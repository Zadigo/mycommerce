<template>
  <div class="container">
    <div class="row d-flex justify-content-center">
      <div class="col-sm-12 col-md-12">
        <div class="d-flex justify-content-between mt-4 mb-2 ">
          <h4 class="text-uppercase fw-bold">
            {{ $t('You may also like') }}
          </h4>

          <!-- TODO: Put a recommended collection in the backend -->
          <router-link id="link-recommendations" :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale } }">
            {{ $t('View all') }}
          </router-link>
        </div>
      </div>

      <!-- Products -->
      <div class="col-md-12">
        <div class="row">
          <div v-for="product in recommendedProducts" :key="product.id" class="col-sm-12 col-md-3">
            <product-card :product="product" :is-loading="isLoading" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from '@/components/shop/products/ProductCard.vue'

export default {
  name: 'MoreProducts',
  components: {
    ProductCard
  },
  props: {
    isLoading: {
      type: Boolean,
      default: true
    },
    recommendedProducts: {
      type: Array,
      default: () => []
    }
  }
}
</script>
