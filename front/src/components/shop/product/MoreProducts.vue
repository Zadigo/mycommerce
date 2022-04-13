<template>
  <div class="container">
    <div class="row d-flex justify-content-center">
      <div class="col-sm-12 col-md-12">
        <div class="d-flex justify-content-between mt-4 mb-2 ">
          <h4 class="text-uppercase font-weight-bold">
            {{ $t('You may also like') }}
          </h4>

          <!-- TODO: Put a recommended collection in the backend -->
          <router-link id="link-recommendations" :to="{ name: 'collection_details', params: { collection: 'all', lang: $i18n.locale } }">
            {{ $t('View all') }}
          </router-link>
        </div>
      </div>
      
      <!-- Products -->
      <div class="col-md-12">
        <v-row>
          <div v-for="product in recommendedProducts" :key="product.id" class="col-sm-12 col-md-3">
            <card :product="product" :is-loading="isLoading" @product-card-click="updateProductList" />
          </div>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/products/Card.vue'

export default {
  name: 'MoreProducts',
  props: {
    isLoading: {
      type: Boolean,
      default: true
    },
    recommendedProducts: {
      type: Array,
      default: () => []
    }
  },
  components: { Card },

  methods: {
    updateProductList() {
      // TODO: When the user changes to another product,
      // update the current product list so that
      // to capture the current state of the product
      // and the ones that were already stored

      // TODO: Send a PageView for the current
      // recommended list
    }
  }
}
</script>
