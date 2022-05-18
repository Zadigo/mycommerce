<template>
  <base-modal-vue :show="store.openCart" id="modal-cart" :title="$t('Cart')" size="md" scrollable hide-footer @close-modal="openCart=false" @close="openCart=false">
    <div class="container">
      
      <div class="row" v-if="cartIsEmpty">
        <div class="col-12">
          <p>{{ $t('Your cart is currently empty') }}</p>

          <hr>

          <button class="btn btn-primary btn-lg btn-block" @click="openCart=false">
            {{ $t('Continue shopping') }}
          </button>
        </div>
      </div>

      <div v-else class="row">
        <div v-for="item in cartItems" :key="item.id" class="col-12">
          <div class="p-1 d-flex justify-content-left">
            <img :src="mediaUrl(item.product.images[0].mid_size)" class="img-fluid" width="100">

            <div class="mx-4">
              <p class="font-weight-bold mb-1">{{ item.product.name }}</p>
              <!-- <p v-if="!item.product.on_sale">
                <span class="font-weight-bold">{{ $n(item.product.unit_price, 'currency', $i18n.locale) }}</span> x 1 ({{ item.default_size }})
              </p>
              <p v-else>
                <del>{{ $n(item.product.unit_price, 'currency', $i18n.locale) }}</del> {{ $n(item.product.sale_price, 'currency', $i18n.locale) }} x 1
              </p> -->

              <button class="btn btn-sm btn-info" @click="removeFromCart(item)">
                {{ $t('Remove') }}
              </button>
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
      <div class="d-flex justify-content-around col-12">
        <button class="btn btn-md btn-primary mx-2" size="lg" @click="goToPage('cart_view')">
          {{ $t('View basket') }}
        </button>

        <button class="btn btn-md btn-primary " style="width:174px;" @click="goToPage('shipment_view')">
          {{ $t('Checkout') }}
        </button>
      </div>
    </div>
  </base-modal-vue>
</template>

<script>
import _ from 'lodash'
import { useShop } from '@/store/shop'
import { mapState, mapWritableState, storeToRefs } from 'pinia'
import { mediaUrl } from '@/utils'
import BaseModalVue from '@/layouts/shop/BaseModal.vue'
import useCartComposable from '@/composables/cart'
import { toNumber } from '@vue/shared'
// import cartMixin from '@/mixins/cart'

export default {
  name: 'ModalCart',
  // mixins: [cartMixin],
  components: {
    BaseModalVue
  },
  setup() {
    var store = useShop()
    var { cartItems } = storeToRefs(store)
    var { getCart, getSessionId, removeFromCart } = useCartComposable()
    return {
      store,
      cartItems,
      mediaUrl,
      getCart,
      removeFromCart,
      getSessionId
    }
  },  
  
  computed: {
    ...mapState(useShop, ['cartItems']),
    cartTotal() {
      return _.sum(_.map(this.cartItems, (product) => {
        return toNumber(product.price)
      }))
    },
    ...mapWritableState(useShop, ['openCart']),
    // ...mapState({
    //   cartTotal: (state) => { return state.cachedCartResponse.total },
    //   cartItems: (state) => { return state.cartItems },
    //   cart: (state) => { return state.cart }
    // }),

    cartIsEmpty () {
      return this.cartItems.length == 0
    },
    
    // showModalCart: {
    //   get () { return this.$store.state.openCart },
    //   set () { this.$store.commit('toggleModalCart') }
    // }
  },

  beforeMount() {
    var data = this.getCart()
    this.store.updateCart(data)
  },

  updated() {
    var data = this.getCart()
    this.store.updateCart(data)
  },

  methods: {
    goToPage(name) {
      this.$store.commit('toggleModalCart')
      this.$router.push({ name: name, params: { lang: this.$i18n.locale } })
    }
  }
}
</script>
