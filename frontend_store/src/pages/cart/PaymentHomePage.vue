<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h2 class="card-title h5">
        Choisis un mode d'expédition
      </h2>

      <v-radio-group v-model="store.requestData.delivery">
        <v-radio v-for="delivery in deliveryMethods" :key="delivery" :label="delivery" :value="delivery"></v-radio>
      </v-radio-group>
    </div>

    <navigation-card-footer next-page="shop_shipment" />
  </div>
</template>

<script>
import { useHead } from 'unhead'
import { useCart } from 'src/stores/cart'

import NavigationCardFooter from 'src/components/cart/NavigationCardFooter.vue'

const deliveryMethods = [
  'Post office',
  'Deliveroo',
  'Uber eats'
]

export default {
  name: 'PaymentHomePage',
  components: {
    NavigationCardFooter
  },
  setup () {
    useHead({
      title: 'Delivery options'
    })
    
    const store = useCart()
    
    return {
      store,
      deliveryMethods
    }
  }
}
</script>
