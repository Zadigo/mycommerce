<template>
  <base-modal-vue id="modal-cart" :show="openCart" :title="$t('Cart')" size="md" scrollable hide-footer @close="openCart = false">
    <div class="container">
      <div v-if="store.isEmpty" class="row">
        <div class="col-12">
          <p>{{ $t('Your cart is currently empty') }}</p>
          <hr>
          <button type="button" class="btn btn-primary btn-lg btn-block" @click="openCart=false">
            {{ $t('Continue shopping') }}
          </button>
        </div>
      </div>

      <div v-else class="row">
        <div v-for="item in cartItems" :key="item.id" class="col-12">
          <div class="p-1 d-flex justify-content-left">
            <img :src="mediaUrl(item.product.images[0].mid_size)" class="img-fluid" width="100">

            <div class="mx-4">
              <p class="fw-bold mb-1">{{ item.product.name }}</p>
              <base-price-display :product="item.product" display-classes="justify-content-start my-3" />
              <button type="button" class="btn btn-sm btn-info" @click="removeFromCart(item)">
                {{ $t('Remove') }}
              </button>
            </div>
          </div>
          <hr>
        </div>

        <div class="col-12">
          <div class="p-1 d-flex justify-content-between">
            <span>Total:</span>
            <span class="fw-bold">{{ $n(total, 'currency', $i18n.locale) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="w-100">
      <div class="d-flex justify-content-around col-12">
        <button type="button" class="btn btn-md btn-primary mx-2" size="lg" @click="goToPage('cart_view')">
          {{ $t('View basket') }}
        </button>

        <button type="button" class="btn btn-md btn-primary " style="width:174px;" @click="goToPage('shipment_view')">
          {{ $t('Checkout') }}
        </button>
      </div>
    </div>
  </base-modal-vue>
</template>

<script>
import { getCurrentInstance } from 'vue'
import { mapState, mapWritableState, storeToRefs } from 'pinia'
import { useUrls } from '@/composables/utils'
import { useCart } from '@/store/cart'
import useCartComposable from '@/composables/cart'

import BaseModalVue from '@/layouts/shop/BaseModal.vue'
import BasePriceDisplay from '@/layouts/shop/BasePriceDisplay.vue'

export default {
  name: 'ModalCart',
  components: {
    BaseModalVue,
    BasePriceDisplay
  },
  setup () {
    const store = useCart()
    const { cartItems } = storeToRefs(store)
    const app = getCurrentInstance()
    const { removeFromCart } = useCartComposable(app)
    const { mediaUrl } = useUrls()

    // store.$subscribe((mutation, state) => {
    //   console.log('store modal cart', state)
    //   if (mutation.type === 'shop') {
    //     console.log(state)
    //   }
    // })

    return {
      store,
      cartItems,
      mediaUrl,
      removeFromCart
    }
  },
  computed: {
    ...mapWritableState(useCart, ['openCart']),
    ...mapState(useCart, ['total', 'cachedCart']),
  },
  beforeMount () {
    this.store.reloadCache()
  },
  methods: {
    goToPage (name) {
      this.store.openCart = false
      this.$router.push({ name: name, params: { lang: this.$i18n.locale } })
    }
  }
}
</script>
