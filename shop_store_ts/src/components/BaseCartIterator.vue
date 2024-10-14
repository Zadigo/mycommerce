<template>
  <div class="col-12">
    <article v-for="item in cartItems" :key="item.product__id" :aria-label="item.product__name" class="card shadow-none border mb-1">
      <div class="card-body p-2">
        <div class="d-flex justify-content-start gap-2">
          <!-- {{ item }} -->
          <div class="col-auto">
            <v-img :src="parseMainImage(item.product_info?.product)" :lazy-src="parseMainImage(item.product_info.product)" :alt="item.product__name" :width="150" :height="150" />
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
              <v-btn v-if="isEditable" class="me-2" size="x-small" variant="tonal" rounded @click="handleProductEdition(item)">
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
import { ProductToEdit } from '@/types/composables/cart';

import { storeToRefs } from 'pinia';
import { useShopUtilities } from 'src/composables/shop';
import { useCart } from 'src/stores/cart';
import { defineComponent } from 'vue';

// declare interface CustomCartStatistics extends CartStatistic {
//   product_info: string
// }

export default defineComponent({
  name: 'BaseCartIterator',
  props: {
    isEditable: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    'edit-product' (_editedProduct: ProductToEdit) {
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
     * 
     * TODO: Refactor this function
     */
    cartItems (): ProductToEdit[] {
      const cachedCart = this.cache || {}
      const statistics = cachedCart.statistics || []
      
      return statistics.map((item) => {
        const productInfo = cachedCart.results.find((cartItem) => {
          return cartItem.product.id === item.product__id
        })

        return { ...item, product_info: productInfo }
      })
    }
  },
  methods: {
    /**
     * Function to open the product edition drawer
     */
    handleProductEdition (item: ProductToEdit) {
      this.$emit('edit-product', item)
    }
  }
})
</script>
