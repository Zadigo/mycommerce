<template>
  <div :data-count="quantity" class="recommendations">
    <h2 class="h4 text-center">
      {{ blockTitle }}
    </h2>

    <div ref="productsRow" class="row g-1">
      <div v-for="i in quantity" :key="i" class="col-3">
        <base-skeleton :loading="true" height="329px" />
        <base-skeleton :loading="true" class="my-1" height="22px" width="50%" />
        <base-skeleton :loading="true" height="22px" width="25%" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import BaseSkeleton from '@/layouts/BaseSkeleton.vue';

export default defineComponent({
  name: 'LoadingRecommendationsBlock',
  components: {
    BaseSkeleton
  },
  props: {
    blockTitle: {
      type: String,
      default: () => {
        return "Cela peut t'intéresser"
      }
    },
    quantity: {
      type: Number,
      default: 20
    }
  },
  mounted () {
    if (this.scrollable) {
      this.$refs.productsRow.classList.add('products-wrapper')
    }
  }
})
</script>
