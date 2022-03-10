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
        <div v-for="item in cart" :key="item.id" class="col-12">
          <div class="p-1 d-flex justify-content-left">
            <b-img :src="item.product.images[0].mid_size|mediaUrl" height="150" width="auto"></b-img>
            <div class="mx-4">
              <p class="font-weight-bold mb-1">{{ item.product.name }}</p>

              <p v-if="!item.product.on_sale">{{ $n(item.product.unit_price, 'currency', $i18n.locale) }} x {{ item.quantity }}</p>
              <p v-else>
                <del>{{ $n(item.product.unit_price, 'currency', $i18n.locale) }}</del> {{ $n(item.product.sale_price, 'currency', $i18n.locale) }} x {{ item.quantity }}
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
            <span class="font-weight-bold">{{ $n(cart.total, 'currency', $i18n.locale) }}</span>
          </div>
        </div>
      </div>
    
    </div>

    <template #modal-footer>
      <div class="w-100">
        <v-col class="d-flex justify-content-center" cols="12">
          <b-btn role="button" class="mx-2" size="lg">
            {{ $t('View basket') }}
          </b-btn>
          <b-btn role="button" size="lg" style="width:174px;">
            {{ $t('Checkout') }}
          </b-btn>
        </v-col>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ModalCart',

  computed: {
    ...mapState({
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

  beforeMount () {
    var cart = this.getCart()
    this.$store.commit('updateCart', cart)
  },

  methods: {
    getCart () {
      return this.$session.retrieve('cart')
    },

    removeFromCart (item) {
      var cart = this.getCart()

      this.$api.shop.cart.remove(item, cart['session_id'])
      .then(() => {
        // CHECK: This could break in case there is no
        // cart in the store but technically the mount
        // of the modal cart sets this automatically
        this.$store.commit('removeFromCart', item)
      })
      .catch((error) => {
        this.$store.dispatch('addErrorMessage', error.response.statusText)
      })
    }
  }
}
</script>
