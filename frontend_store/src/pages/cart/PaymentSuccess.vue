<template>
  <section class="row">
    <div class="col-12 mb-4">
      <div class="card shadow-sm">
        <div class="card-body text-center">
          <h1>Thank you</h1>
          <v-btn :to="{ name: 'shop_collections' }" color="secondary" variant="tonal" rounded>
            Notre nouvelle collection
          </v-btn>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="row gx-1 gy-1">
        <div v-for="product in recommendations" :key="product" class="col-3">
          <product-card :product="product" :show-like-button="false" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'
import { useHead } from 'unhead'
import { createMockupProducts } from 'src/utils'

import ProductCard from 'src/components/products/ProductCard.vue'

export default {
  name: 'PaymentSuccess',
  components: {
    ProductCard
  },
  setup () {
    useHead({
      title: 'Payment success'
    })

    const recommendations = ref(createMockupProducts(8))

    return {
      recommendations
    }
  },
  beforeMount () {
    this.$session.create('cart', [])
  }
}
</script>
