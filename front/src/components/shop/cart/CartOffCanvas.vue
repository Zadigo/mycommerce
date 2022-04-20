<template>
  <div ref="link" :class="{ show: openCart }" class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample" aria-labelledby="Cart">
    <div class="offcanvas-header">
      <button type="button" class="btn-close text-reset" aria-label="Close" @click="toggleModalCart"></button>
    </div>

    <div class="offcanvas-body">
      <!-- Empty -->
      <div v-if="cartIsEmpty" class="card shadow-none">
        <div class="card-body text-center">
          <v-icon class="my-3" size="60">mdi-cart</v-icon>

          <h3>{{ $t('Your cart is currently empty') }}</h3>

          <hr class="my-5">

          <button class="btn btn-block btn-primary" @click="toggleModalCart">
            {{ $t('Continue shopping') }}
          </button>
        </div>
      </div>

      <v-container v-else>
        <v-row>
          <div v-for="item in cartItems" :key="item.id" class="card mb-2">
            <v-col cols="12">
              <div class="card-body">
                <div class="p-1 d-flex justify-content-left">
                  <img :src="item.product.images[0].mid_size|mediaUrl" class="img-fluid" height="100" width="100">
                  <div class="mx-4">
                    <p class="fw-bold mb-1">{{ item.product.name }}</p>

                    <p v-if="!item.product.on_sale">
                      <span class="fw-bold">{{ $n(item.product.unit_price, 'currency', $i18n.locale) }}</span> x 1 ({{ item.default_size }})
                    </p>
                    <p v-else>
                      <del>{{ $n(item.product.unit_price, 'currency', $i18n.locale) }}</del> {{ $n(item.product.sale_price, 'currency', $i18n.locale) }} x 1
                    </p>

                    <v-btn @click="removeFromCart(item)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-col>
          </div>
        </v-row>
      </v-container>
    </div>

    <div class="offcanvas-footer">
      <v-row>
        <div class="col-12">
          <div class="p-1 d-flex justify-content-between">
            <span>Total:</span>
            <span class="font-weight-bold">{{ $n(cartTotal, 'currency', $i18n.locale) }}</span>
          </div>
        </div>

        <div class="col-12">
          <div class="w-100">
            <v-col class="d-flex justify-content-around" cols="12">
              <v-btn class="mx-2" size="lg" @click="goToPage('cart_view')">
                {{ $t('View basket') }}
              </v-btn>

              <v-btn  style="width:174px;" @click="goToPage('shipment_view')">
                {{ $t('Checkout') }}
              </v-btn>
            </v-col>
          </div>
        </div>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import cartMixin from '@/mixins/cart'

export default {
  name: 'CartOffCanvas',
  mixins: [cartMixin],
  watch: {
    openCart(newValue) {
      if (newValue) {
        this.$refs.link.style.visibility = 'visible'
      } else {
        this.$refs.link.style.visibility = 'hidden'
      }
    }
  },
  computed: {
    ...mapState({
      cartTotal: (state) => { return state.cachedCartResponse.total },
      cartItems: (state) => { return state.cartItems },
      cart: (state) => { return state.cart },
      openCart: (state) => { return state.openCart }
    }),

    cartIsEmpty () {
      return this.cart.length == 0
    },
  },
  methods: {
    ...mapMutations(['toggleModalCart']),
    
    goToPage(name) {
      this.$store.commit('toggleModalCart')
      this.$router.push({ name: name, params: { lang: this.$i18n.locale } })
    }
  }
}
</script>

<style scoped>
.offcanvas {
  width: 500px;
}
.offcanvas-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}
</style>
