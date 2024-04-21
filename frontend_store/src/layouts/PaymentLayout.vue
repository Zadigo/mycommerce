<template>
  <section class="container">
    <div v-if="isSuccessPage" class="row my-5">
      <div class="col-8 offset-md-2">
        <router-view></router-view>
      </div>
    </div>

    <div v-else class="row my-5">
      <div class="col-12">
        <nav aria-label="breadcrumb">
          <v-breadcrumbs :items="paymentLinks">
            <template #divider>
              <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
          </v-breadcrumbs>
        </nav>
      </div>

      <div class="col-6">
        <router-view></router-view>
      </div>

      <div class="col-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="list-group">
              <article v-for="product in cart" :key="product.id" class="list-group-item d-flex justify-content-start align-items-top gap-4" aria-label="">
                <div class="col-auto">
                  <router-link :to="{ name: 'shop_product', params: { id: product.id } }">
                    <img src="../assets/img8.jpeg" class="img-fluid rounded-1" width="100" height="100" alt="">
                  </router-link>
                </div>

                <div class="col">
                  <router-link :to="{ name: 'shop_product', params: { id: product.id } }" class="link-dark">
                    <p class="h6 mb-1">{{ product.product.name }}</p>
                    <p class="fw-light fs-6">Taille : {{ product.size }}</p>
                  </router-link>

                  <v-btn v-show="$route.name === 'shop_payment_home'" rounded color="secondary" flat>
                    <font-awesome-icon :icon="['fas', 'trash']" />
                  </v-btn>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useCart } from 'src/stores/cart'

export default {
  name: 'PaymentLayout',
  setup () {
    const cartStore = useCart()
    const { cart } = storeToRefs(cartStore)
    return {
      cartStore,
      cart
    }
  },
  data () {
    return {
      // paymentLinks: [
      //   {
      //     title: 'Delivery',
      //     disabled: false,
      //     href: 'shop_payment_home',
      //   },
      //   {
      //     title: 'Shipment',
      //     disabled: true,
      //     href: 'shop_shipment',
      //   },
      //   {
      //     title: 'Payment',
      //     disabled: true,
      //     href: 'shop_payment',
      //   }
      // ]
    }
  },
  computed: {
    isSuccessPage () {
      return this.$route.name === 'shop_payment_success'
    },
    paymentLinks () {
      const links = [
        {
          title: 'Delivery',
          disabled: false,
          href: 'shop_payment_home',
        },
        {
          title: 'Shipment',
          disabled: true,
          href: 'shop_shipment',
        },
        {
          title: 'Payment',
          disabled: true,
          href: 'shop_payment',
        }
      ]

      if (this.$route.name === 'shop_shipment' || this.$route.name === 'shop_payment') {
        links[1].disabled = false
      }
      
      return links
    }
  },
  created () {
    // Preload the cart from the session if we actually
    // have the data. This allows us then to dynamically
    // calculate the items that the user has selected
    this.cartStore.cart = this.sessionStorage?.cart || []
  },
}
</script>
