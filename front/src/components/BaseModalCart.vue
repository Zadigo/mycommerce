<template>
  <b-modal id="modal-cart" v-model="showModalCart" size="lg" scrollable hide-footer @close="$store.commit('toggleModalCart')">
    <div class="container">
      <div class="row">
        <div v-for="item in cart" :key="item.id" class="col-12">
          <div class="p-1 d-flex justify-content-left">
            <b-img :src="item.product.images[0].original|mediaUrl" height="150" width="auto"></b-img>
            <div class="mx-4">
              <p class="font-weight-bold mb-1">{{ item.product.name }}</p>
              <p>{{ $n(item.product.unit_price, 'currency', $i18n.locale) }} x {{ item.quantity }}</p>

              <b-btn variant="light">
                <font-awesome-icon icon="trash" />
              </b-btn>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="bg-light rouded p-1 d-flex">
            <span>Total:</span>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'BaseModalCart',

  computed: {
    ...mapState({
      // showModalCart: (state) => { return state.openCart },
      cart: (state) => { return state.cart }
    }),
    
    showModalCart: {
      get () { return this.$store.state.openCart },
      set () { this.$store.commit('toggleModalCart') }
    }
  },
  
  // TODO: This makes excessive calls to the
  // th backend for the cart items
  // beforeMount () {
  //   this.$api.shop.cart.all()
  //   .then((response) => {
  //     this.$store.commit('updateCart', response.data)
  //   })
  //   .catch((error) => {
  //     error
  //   })
  // }
}
</script>
