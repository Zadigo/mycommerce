<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-12 col-md-12">
        <h4 class="text-uppercase fw-bold">
          {{ $t('Recently viewed') }}
        </h4>
      </div>

      <div class=" col-sm-12 col-md-12">
        <div class="row">
          <div v-for="product in getRecentlyViewedProducts" :key="product.id" class="col-sm-12 col-md-3">
            <product-card :product="product" :is-loading="isLoading" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useShop } from '@/store/shop'

import ProductCard from '@/components/shop/products/ProductCard.vue'

export default {
  name: 'RecentlyViewed',
  components: {
    ProductCard
  },
  props: {
    isLoading: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState(useShop, ['getRecentlyViewedProducts'])
  }
}
</script>
