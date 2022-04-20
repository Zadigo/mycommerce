<template>
  <v-row class="text-center">
    <v-col cols="12" class="pb-6">
      <!-- TODO: Translate with "AFFICHAGE ACTUEL 1-48 DE 386 STYLES" -->
      <p>Showing <span class="fw-bold">{{ productCount }}</span> of <span class="fw-bold">{{ totalCount }}</span> products</p>
      
      <base-pagination @start-load="$emit('start-pagination')" @end-load="$emit('end-pagination')">
        <v-icon class="mr-2">mdi-arrow-down</v-icon>
        {{ $t('Load more') }}
      </base-pagination>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

import BasePagination from '@/components/shop/products/BasePagination.vue'

export default {
  name: 'Pagination',
  components: {
    BasePagination
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
