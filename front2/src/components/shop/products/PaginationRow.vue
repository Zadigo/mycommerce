<template>
  <div class="row text-center my-3 py-3">
    <div class="col-12 pb-6">
      <!-- TODO: Translate with "AFFICHAGE ACTUEL 1-48 DE 386 STYLES" -->
      <p>Showing <span class="fw-bold">{{ productCount }}</span> of <span class="fw-bold">600</span> products</p>
      <base-pagination-button @start-load="$emit('start-pagination')" @end-load="$emit('end-pagination')">
        <!-- <v-icon class="mr-2">mdi-arrow-down</v-icon> -->
        {{ $t('Load more') }}
      </base-pagination-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useShop } from '@/store/shop'

import BasePaginationButton from '@/layouts/shop/BasePaginationButton.vue'

export default {
  name: 'PaginationRow',
  components: {
    BasePaginationButton
  },
  props: {
    productCount: {
      type: Number,
      default: 0
    }
  },
  emits: ['start-pagination', 'end-pagination'],
  computed: {
    ...mapState(useShop, ['displayedProductsCount'])
  }
}
</script>
