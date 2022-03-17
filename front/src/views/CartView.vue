<template>
  <section id="cart">

    <v-container>
      <v-row>
        <!-- Products -->
        <v-col v-if="hasItems" cols="8">
          <v-row>
            <v-col cols="12">
              <h1>Cart</h1>
              <p>{{ cartItems.length }} {{ $tc('product', cartItems.length) }}</p>
            </v-col>

            <transition-group name="general-transition">
              <v-col v-for="item in cartItems" :key="item.id" cols="12" class="d-flex justify-content-left">
                <div id="image" class="mr-3">
                  <v-img :src="item.product.images[0].mid_size|mediaUrl" width="100"></v-img>
                </div>
                
                <!-- Information -->
                <div id="infos">
                  <h5>{{ item.product.name }}</h5>
                  <v-text-field type="number" solo></v-text-field>

                  <div class="font-weight-bold">
                    {{ $n(item.price, 'currency', $i18n.locale) }}
                  </div>

                  <v-btn @click="removeFromCart(item)">
                    {{ $t('Remove') }}
                  </v-btn>
                </div>
                <hr>
              </v-col>
            </transition-group>
          </v-row>

        </v-col>

        <v-col v-else cols="8">
          <h4>No products</h4>
        </v-col>

        <!-- Aside -->
        <v-col id="cart-sidebar" cols="4">
          <aside>
            <h2>{{ $t('Summary') }}</h2>
            <v-radio-group v-model="giftOptions.is_gift" hide-details>
              <v-radio label="Please Gift Wrap my Order — $6.00"></v-radio>
            </v-radio-group>

            <hr>

            <div>
              <h5>Total</h5>
              <h5>{{ $n(cartTotal, 'currency', $i18n.locale) }}</h5>
            </div>

            <hr>

            <b-btn block>
              {{ $t('Checkout') }}
            </b-btn>

            <b-link :to="{ name: 'collection_details', params: { collection: 'all', lang: $i18n.locale } }">
              {{ $t('Continue shopping') }}
            </b-link>
          </aside>
        </v-col>
      </v-row>
    </v-container>
    
  </section>
</template>

<script>
import { mapState } from 'vuex'

import cartMixin from '../components/cartMixin'

export default {
  name: 'CartView',
  mixins: [cartMixin],
  data: () => ({
    giftOptions: {
      is_gift: false
    }
  }),
  computed: {
    ...mapState(['cartItems']),
    ...mapState({
      cartTotal: (state) => { return state.cachedCartResponse.total },
    }),
    hasItems () {
      return this.cartItems.length > 0
    }
  }
}
</script>

<style scoped>
#cart-sidebar {
  position: sticky;
  width: 100%;
  max-width: 100%;
}
</style>
