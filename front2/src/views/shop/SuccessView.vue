<template>
  <section id="success" class="ecommerce-section">
    <div class="container">
      <div class="row">
        <div class="card">
          <div class="card-body text-center">
            <h3 class="display-6 fw-bold">Your order was successful</h3>
            <router-link :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale } }" class="btn btn-primary btn-lg">
              Continue shopping
            </router-link>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-12">
          <more-products-vue :recommended-products="[]" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useShop } from '../../store/shop'
import { storeToRefs } from 'pinia'

import MoreProductsVue from '../../components/shop/product/MoreProducts.vue'

export default {
  name: 'SuccessView',
  components: {
    MoreProductsVue
  },
  setup () {
    const store = useShop()
    const { cartItems } = storeToRefs(store)
    return {
      cartItems
    }
  },
  beforeMount () {
    var token = this.$route.query.token
    this.checkToken(token)
  },
  methods: {
    async getRecommendations () {
      // pass
    },

    async checkToken (token) {
      if (!token) {
        return this.$router.push({ name: 'collection_details_view', params: { collection: 'all', lang: this.$i18n.locale } })
      } else {
        // pass
      }
    }
  }
}
</script>
