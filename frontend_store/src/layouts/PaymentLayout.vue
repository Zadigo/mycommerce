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
        <div class="card shadow-none bg-light">
          <div class="card-header border-none">
            <h1 class="fs-5 fw-bold my-2">Résumé ({{ cartStore.numberOfProducts }})</h1>
          </div>

          <div id="products" class="card-body">
            <div class="list-group">
              <article v-for="item in products" :key="item.id" :aria-label="item.product.name" class="list-group-item d-flex justify-content-start align-items-top gap-4 border-none ps-0">
                <div class="col-auto">
                  <router-link :to="{ name: 'shop_product', params: { id: item.id } }">
                    <v-img :src="djangoMediaPath(item.product.get_main_image.original)" :lazy-src="djangoMediaPath(item.product.get_main_image.original)" :width="100" :alt="item.product.name" />
                  </router-link>
                </div>

                <div class="col">
                  <router-link :to="{ name: 'shop_product', params: { id: item.product.id } }" class="link-dark">
                    <p class="fw-bold mb-1">{{ translatePrice(item.product.get_price) }}</p>
                    <p class="h6 mb-1">{{ item.product.name }}</p>
                    <p class="fw-light fs-6">{{ item.size }} {{ item.quantity }}x {{ item.product.get_price }}</p>
                  </router-link>

                  <v-btn v-show="$route.name === 'shop_payment_home'" size="small" rounded color="secondary" flat @click="removeFromCart(item)">
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
import { mapActions, storeToRefs } from 'pinia'
import { useCart } from 'src/stores/cart'
import { useUtilities }  from 'composables/shop'
import { useRefHistory } from '@vueuse/core'

export default {
  name: 'PaymentLayout',
  setup () {
    const cartStore = useCart()
    const { products } = storeToRefs(cartStore)
    const { djangoMediaPath } = useUtilities()

    const { translatePrice } = useUtilities()

    const { history } = useRefHistory(products)

    return {
      translatePrice,
      cartHistory: history,
      djangoMediaPath,
      cartStore,
      products
    }
  },
  computed: {
    isSuccessPage () {
      // Checks if the user has reached the success page
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
    this.cartStore.products = this.sessionStorage?.cart || []
  },
  methods: {
    ...mapActions(useCart, ['removeFromCart'])
  }
}
</script>

<style scoped>
#products {
  overflow-y: scroll;
  height: 400px;
}
</style>
