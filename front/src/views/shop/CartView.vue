<template>
  <section id="cart" class="ecommerce-section">

    <v-container>
      <v-row>
        <!-- Products -->
        <v-col v-if="hasItems" cols="8" class="px-6">
          <v-row>
            <v-col cols="12">
              <h1>{{ $t('Cart') }}</h1>
              <p>{{ cartItems.length }} {{ $tc('product', cartItems.length) }}</p>
            </v-col>

            <transition-group name="general-transition">
              <v-col v-for="item in cartItems" :key="item.id" cols="12" class="d-flex justify-content-left py-5 mb-5 border-bottom">
                <router-link :to="{ name: 'product_view', params: { id: item.product.id, slug: item.product.slug, lang: $i18n.locale } }">
                  <div id="image" class="me-6">
                    <v-img :src="item.product.images[0].mid_size|mediaUrl" width="100"></v-img>
                  </div>
                </router-link>
                
                <!-- Information -->
                <div id="infos">
                  <router-link :to="{ name: 'product_view', params: { id: item.product.id, slug: item.product.slug, lang: $i18n.locale } }">
                    <h5>{{ item.product.name }}</h5>
                  </router-link>

                  <v-text-field type="number" class="my-5" outlined hide-details></v-text-field>

                  <div class="font-weight-bold">
                    {{ $n(item.price, 'currency', $i18n.locale) }}
                  </div>

                  <v-btn @click="removeFromCart(item)">
                    {{ $t('Remove') }}
                  </v-btn>
                </div>

                <hr class="my-4">
              </v-col>
            </transition-group>
          </v-row>

        </v-col>

        <v-col v-else cols="8" class="px-6">
          <h4>{{ $t('No products') }}</h4>
        </v-col>

        <!-- Aside -->
        <v-col id="cart-sidebar" cols="4">
          <aside style="position:sticky;top:0;left:0;">
            <div class="card shadow-none">
              <div class="card-body">
                <!-- <h2>{{ $t('Summary') }}</h2> -->
                <v-checkbox v-model="giftOptions.is_gift" label="Please Gift Wrap my Order — $6.00" hide-details></v-checkbox>

                <v-checkbox v-model="giftOptions.is_gift" label="Faire un don - 0.5€" hide-details></v-checkbox>

                <hr class="my-7">

                <div class="d-flex justify-content-between font-weight-bold text-17">
                  <h5 class="text-uppercase">Sous-total</h5>
                  <h5 class="text-uppercase">25€</h5>
                </div>

                <div class="d-flex justify-content-between text-muted mb-5 text-17">
                  <h5 class="text-uppercase">Remise</h5>
                  <h5 class="text-uppercase">25€</h5>
                </div>

                <div class="d-flex justify-content-between font-weight-bold">
                  <h5 class="text-uppercase">Total</h5>
                  <h5>{{ $n(cartTotal, 'currency', $i18n.locale) }}</h5>
                </div>

                <hr class="my-7">

                <b-btn class="mb-7" block>
                  {{ $t('Checkout') }}
                </b-btn>

                <b-link :to="{ name: 'collection_details', params: { collection: 'all', lang: $i18n.locale } }">
                  {{ $t('Continue shopping') }}
                </b-link>
              </div>
            </div>
          </aside>
        </v-col>
      </v-row>

      <v-row>
        <p class="my-6 py-6">
          Modes de livraison magasin : offerte sans minimum d'achat // domicile : offerte dès 70€ d'achat // point relais : offerte dès 70€ d'achat
        </p>
      </v-row>

      <v-row>
        <div class="reassurance d-flex justify-content-around text-center">
          <div class="p-5">
            <v-icon class="mr-2 mb-3">mdi-arrow-left</v-icon>
            <p>Livraison et retours gratuit</p>
          </div>

          <div class="p-5">
            <v-icon class="mr-2 mb-3">mdi-arrow-left</v-icon>
            <p>Livraison et retours gratuit</p>
          </div>
          
          <div class="p-5">
            <v-icon class="mr-2 mb-3">mdi-arrow-left</v-icon>
            <p>Livraison et retours gratuit</p>
          </div>
          
          <div class="p-5">
            <v-icon class="mr-2 mb-3">mdi-arrow-left</v-icon>
            <p>Livraison et retours gratuit</p>
          </div>
        </div>
      </v-row>
    </v-container>
    
  </section>
</template>

<script>
import { mapState } from 'vuex'

import cartMixin from '@/mixins/cartMixin'

export default {
  name: 'CartView',
  mixins: [cartMixin],
  title() {
    return this.$t('Cart')
  },
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
body {
  background-color: #f6f6f6 !important;
}

#cart-sidebar {
  position: sticky;
  width: 100%;
  max-width: 100%;
}
</style>
