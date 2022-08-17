<template>
  <div v-if="isLoading || !mainImage" id="link-product-card" class="product">
    Loading...
  </div>

  <article v-else id="link-product-card" class="product my-1" @click="$emit('product-card-click', product)" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <div id="product-image">
      <!-- Image -->
      <router-link :to="{ name: 'product_view', params: { id: product.id, slug: product.slug, lang: $i18n.locale } }">
        <img :src="mediaUrl(mainImage.mid_size)" :alt="mainImage.name" class="img-fluid" />
      </router-link>

      <!-- Mini-Cart -->
      <transition name="mini-cart-transition">
        <div v-if="isHovered" class="mini-cart p-3 d-none">
          <div class="fw-bold mb-3 text-uppercase">
            {{ $t('Add to cart') }}
          </div>

          <div id="sizes">
            <div v-if="hasSizes">
              <button v-for="size in product.sizes" :key="size.name" type="button" :class="{ disabled: !size.availability }" class="btn btn-outline-dark me-2" @click="quickAddToCart(product, size)">
                {{ size.name }}
              </button>
            </div>

            <button v-else class="btn btn-outline-dark" type="button" @click="quickAddToCart(product, { name: 'Unique' }, true)">
              {{ $t('Unique') }}
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- Information -->
    <router-link :to="{ name: 'product_view', params: { id: product.id, slug: product.slug, lang: $i18n.locale } }" class="text-decoration-none">
      <div id="product-details" class="mt-2">
        <p class="fw-normal dark-text mb-0">
          {{ truncate(capitalizeLetters(product.name)) }}
        </p>

        <div class="d-flex justify-content-between">
          <div>
            <span v-if="product.on_sale" class="me-2 fw-light">
              <del>{{ $n(product.unit_price * 1, 'currency', $i18n.locale) }}</del>
            </span>

            <span :class="{ 'text-danger': product.on_sale }" class="fw-bold">
              {{ $n(product.get_price * 1, 'currency', $i18n.locale) }}
            </span>
          </div>

          <div>
            <span v-if="product.on_sale" class="bg-danger p-1 rounded text-white ml-3">
              {{ formatAsPercentage(product.sale_value, true) }}
            </span>
          </div>
        </div>
      </div>
    </router-link>

    <!-- Other -->
    <div class="d-flex justify-content-left p-absolute m-2">
      <base-tag v-if="product.on_sale" :padding="1" :width="30" background-color="bg-primary">
        {{ $t('Sale') }}
      </base-tag>

      <base-tag v-if="product.display_new" :padding="1" :width="30" background-color="bg-danger" class="mx-2">
        {{ $t('New') }}
      </base-tag>
    </div>
  </article>
</template>

<script>
import _ from 'lodash'

import { truncate, capitalizeLetters, mediaUrl, formatAsPercentage } from '@/utils'
import { useShop } from '@/store/shop'

import BaseTag from '@/layouts/shop/BaseTag.vue'

import useCartComposable from '@/composables/cart'

export default {
  name: 'ProductCard',
  components: {
    BaseTag
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object,
      required: true
    }
  },
  emits: {
    'product-card-click': () => true
  },
  setup () {
    const store = useShop()
    const { addingToCart, productOptions, quickAddToCart, getSessionId } = useCartComposable()
    return {
      addingToCart,
      productOptions,
      store,
      formatAsPercentage,
      capitalizeLetters,
      mediaUrl,
      truncate,
      quickAddToCart,
      getSessionId
    }
  },
  data: () => ({
    isHovered: false
  }),
  computed: {
    mainImage () {
      const mainImage = _.find(this.product.images, ['is_main_image', true])
      return mainImage || this.product.images[0]
    },

    hasSizes () {
      return this.product.sizes.length > 0
    }
  }
}
</script>

<style scoped>
.product {
  position: relative;
}

.product a {
  color: black;
}

#product-image {
  position: relative;
  overflow: hidden;
}

#product-image img {
  transition: all 0.3s cubic-bezier(0, 0.5, 0.5, 1);
  overflow: hidden;
}

#product-image:hover img {
  transform: scale(1.2);
}
.product-badge {
  position: absolute;
  top: 5%;
  left: 5%;
  background-color: white;
  border-radius: 30px;
  padding: .25rem .5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: black;
  font-size: 12px;
  font-weight: 600;
  z-index: 1;
}
.mini-cart {
  position: absolute;
  bottom: 0%;
  left: 0;
  width: 100%;
  opacity: .8;
  min-height: 150px;
  background-color: white;
}
.mini-cart .btn {
  width: 15%;
}
.mini-cart .btn.uniqe {
  width: 40%;
}

.scale-transition-enter-active,
.scale-transition-leave-active {
  transition: all .8s ease-in-out;
}

.scale-transition-enter-from,
.scale-transition-leave-to {
  opacity: 0;
  transform: scale(.8, .8);
}
.scale-transition-enter-to,
.scale-transition-leave-from {
  opacity: 1;
  transform: scale(1, 1);
}
.mini-cart-transition-enter-active,
.mini-cart-transition-leave-active {
  transition: all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.mini-cart-transition-enter-from,
.mini-cart-transition-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

.mini-cart-transition-enter-to,
.mini-cart-transition-leave-from {
  opacity: 1;
  transform: translateY(0px);
}
</style>
