<template>
  <div :data-count="quantity" class="recommendations">
    <h2 class="h4 text-center">
      {{ blockTitle }}
    </h2>

    <div ref="productsRow" class="row g-1">
      <div v-for="product in quantity" :key="product.id" class="col-3">
        <v-skeleton-loader type="image" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoadingRecommendationsBlock',
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
