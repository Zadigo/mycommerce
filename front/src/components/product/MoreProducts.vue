<template>
  <div class="row d-flex justify-content-center">
    <div class="col-md-12">
      <div class="d-flex justify-content-between mt-4 mb-2 ">
        <h4 class="text-uppercase font-weight-bold">
          {{ $t('You may also like') }}
        </h4>
        
        <router-link id="link-recommendations" :to="{ name: 'collection_all', params: { lang: $i18n.locale } }">
          {{ $t('View all') }}
        </router-link>
      </div>
    </div>
    
    <!-- Products -->
    <div class="col-md-12">
      <v-row>
        <v-col v-for="product in recommendedProducts" :key="product.id" cols="3">
          <card :product="product" :is-loading="isLoading" @product-card-click="updateProductList" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Card from '../products/Card.vue'

export default {
  name: 'AdditionalInformation',
  
  components: { Card },

  data: () => ({
    isLoading: false
  }),

  computed: {
    ...mapGetters(['recommendedProducts'])
  },

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
