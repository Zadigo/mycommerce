<template>
  <div class="container">
    <div class="row">
      <div class=" col-sm-12 col-md-12">
        <v-row>
          <v-col v-for="product in recentlyViewedProducts" :key="product.id" cols="3">
            <card :product="product" :is-loading="isLoading" />
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Card from '@/components/shop/products/Card.vue'

export default {
  name: 'RecentlyViewd',
  props: {
    isLoading: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Card
  },
  computed: {
    ...mapGetters(['recentlyViewedProducts'])
  }
}
</script>
