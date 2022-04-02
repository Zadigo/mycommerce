<template>
  <v-row class="text-center">
    <v-col cols="12" class="pb-6">
      <!-- TODO: Translate with "AFFICHAGE ACTUEL 1-48 DE 386 STYLES" -->
      <p>Showing <span class="font-weight-bold">{{ productCount }}</span> of <span class="font-weight-bold">{{ totalCount }}</span> products</p>
      
      <button-load-products @start-load="$emit('start-pagination')" @end-load="$emit('end-pagination')">
        <v-icon class="mr-2">mdi-arrow-down</v-icon>
        {{ $t('Load more') }}
      </button-load-products>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

import ButtonLoadProducts from './ButtonLoadProducts.vue'

export default {
  name: 'Pagination',
  components: {
    ButtonLoadProducts
  },
  props: {
    productCount: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters(['totalCount', 'nextUrl']),
  }
}
</script>
