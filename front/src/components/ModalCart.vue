<template>
  <b-modal id="modal-cart" v-model="showModalCart" :title="$t('Cart')" size="md" scrollable hide-footer @close="$store.commit('toggleModalCart')">
    <div class="container">
      
      <v-row v-if="cartIsEmpty">
        <v-col cols="12">
          <p>{{ $t('Your cart is currently empty') }}</p>

          <hr>

          <b-btn block @click="$store.commit('toggleModalCart')">Continue shopping</b-btn>
        </v-col>
      </v-row>

      <div v-else class="row">
        <div v-for="item in cartItems" :key="item.id" class="col-12">
          <div class="p-1 d-flex justify-content-left">
            <b-img :src="item.product.images[0].mid_size|mediaUrl" height="150" width="auto"></b-img>
            <div class="mx-4">
              <p class="font-weight-bold mb-1">{{ item.product.name }}</p>

              <p v-if="!item.product.on_sale">{{ $n(item.product.unit_price, 'currency', $i18n.locale) }} x 1</p>
              <p v-else>
                <del>{{ $n(item.product.unit_price, 'currency', $i18n.locale) }}</del> {{ $n(item.product.sale_price, 'currency', $i18n.locale) }} x 1
              </p>

              <v-btn @click="removeFromCart(item)">
                {{ $t('Remove') }}
              </v-btn>
            </div>
          </div>
          <hr>
        </div>
        
        <div class="col-12">
          <div class="p-1 d-flex justify-content-between">
            <span>Total:</span>
            <span class="font-weight-bold">{{ $n(cartTotal, 'currency', $i18n.locale) }}</span>
          </div>
        </div>
      </div>
    
    </div>

    <div class="w-100">
      <v-col class="d-flex justify-content-center" cols="12">
        <v-btn class="mx-2" size="lg" @click="goToPage">
          {{ $t('View basket') }}
        </v-btn>

        <v-btn  style="width:174px;" @click="goToPage">
          {{ $t('Checkout') }}
        </v-btn>
      </v-col>
    </div>
    <!-- <template #modal-footer>
    </template> -->
  </b-modal>
</template>

<script>
import { mapState } from 'vuex'
import cartMixin from '@/mixins/cartMixin'

export default {
  name: 'ModalCart',
  mixins: [cartMixin],
  
  computed: {
    ...mapState({
      cartTotal: (state) => { return state.cachedCartResponse.total },
      cartItems: (state) => { return state.cartItems },
      cart: (state) => { return state.cart }
    }),

    cartIsEmpty () {
      return this.cart.length == 0
    },
    
    showModalCart: {
      get () { return this.$store.state.openCart },
      set () { this.$store.commit('toggleModalCart') }
    }
  },

  methods: {
    goToPage () {
      this.$store.commit('toggleModalCart')
      this.$router.push({ name: 'cart', params: { lang: this.$i18n.locale } })
    }
  }
}
</script>
