<template>
  <div class="col-12">
    <article v-for="item in cartItems" :key="item.product__id" :aria-label="item.product__name" class="card shadow-none border mb-1">
      <div class="card-body p-2">
        <div class="d-flex justify-content-start gap-2">
          <!-- {{ item }} -->
          <div class="col-auto">
            <v-img :src="parseMainImage(item.product_info.product)" :lazy-src="parseMainImage(item.product_info.product)" :alt="item.product__name" :width="150" :height="150" />
          </div>

          <div class="infos">
            <router-link :to="{ name: 'shop_product', params: { id: item.product__id } }" class="link-dark" @click="$emit('show-cart-drawer')">
              <p class="mb-1">
                {{ item.product__name }}
              </p>

              <div class="fw-bold">
                {{ $n(parseFloat(item.product_info.price), 'currency') }}
              </div>
              
              <div class="fs-light fs-6 mb-1 d-flex justify-content-start align-items-center gap-3">
                <span v-if="item.product_info.size">{{ item.product_info.size }}</span>
                <span>{{ item.quantity }}x</span>
              </div>
            </router-link>

            <div id="actions">
              <v-btn v-if="isEditable" class="me-2" size="x-small" variant="tonal" rounded @click="handleProductEdition('open', item)">
                <font-awesome-icon :icon="['fas', 'pen']" />
              </v-btn>

              <v-btn variant="tonal" size="x-small" rounded>
                <font-awesome-icon :icon="['fas', 'trash']" />
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';

import { storeToRefs } from 'pinia';
import { useShopUtilities } from 'src/composables/shop';
import { useCart } from 'src/stores/cart';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseCartIterator',
  props: {
    isEditable: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    'edit-product' () {
      return true
    },
    'show-cart-drawer' () {
      return true
    }
  },
  setup () {
    const { parseMainImage } = useShopUtilities()
    const cartStore = useCart()
    
    const { cache } = storeToRefs(cartStore)

    return {
      cache,
      parseMainImage
    }
  },
  computed: {
    /**
     * Computed function that get the items from the session
     * and iterates on each statistic object to be displayed 
     */
    cartItems () {
      // const cachedCart = this.sessionStorage.cart_cache || {}
      const cachedCart = this.cache || {}
      const statistics = cachedCart.statistics || []

      return _.map(statistics, (item) => {
        const productInfo = _.find(cachedCart.results, (result) => {
          return result.product.id === item.product__id
        })
        item.product_info = productInfo
        return item
      })
    }
  },
  beforeUpdate () {
    console.log('BaseCartIterator', 'beforeUpdate')
  },
  methods: {
    /**
     * Function to open the product edition drawer
     * 
     * @param {String} action Action to use: open or close the drawer
     * @param {Object} item Product in the cart to edit
     */
    handleProductEdition (action, item) {
      this.$emit('edit-product', { action, product: item })
    }
  }
})
</script>
