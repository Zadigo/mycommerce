<doc>
  Allows the user to review the current items within
  his actual cart
</doc>

<template>
  <section id="cart" class="ecommerce-section">
    <div class="container">
      <div class="row">
        <div class="col-8">
          <div class="alert alert-info d-flex justify-content-around">
            <i>Icon</i>
            <p class="w-50">Plus que <span class="fw-bold">59,81 €</span> pour profiter de la livraison gratuite</p>

            <div class="progress">
              <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100">
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <h1 class="fw-bold">{{ $t('Cart') }}</h1>
              <p class="fs-5">{{ $tc('product_count', count) }}</p>
            </div>
          </div>

          <!-- Products -->
          <article v-for="item in cartItems" :key="item.id" :aria-label="item.product.name" class="card my-2">
            <div class="card-body d-flex justify-content-left p-1">
              <router-link :to="{ name: 'product_view', params: { id: item.product.id, slug: item.product.slug, lang: $i18n.locale } }">
                <div class="p-3">
                  <img :src="mediaUrl(item.product.images[0].mid_size)" :alt="item.name" class="img-fluid rounded" width="150">
                </div>
              </router-link>

              <div class="p-3">
                <router-link :to="{ name: 'product_view', params: { id: item.product.id, slug: item.product.slug, lang: $i18n.locale } }" class="text-dark">
                  <p class="fw-bold fs-4 m-0">{{ truncate(item.product.name, 30) }}</p>
                  <!-- Prices -->
                  <!-- <p class="fw-bold mb-2">{{ $n(item.product.get_price * 1, 'currency', $i18n.locale) }} x 1</p> -->
                  <base-price-display :product="item.product" display-classes="justify-content-start my-3" />
                </router-link>
                <input type="number" class="form-control p-2 w-50">
                <button type="button" class="btn btn-info my-2" @click="removeFromCart(item.product)">
                  {{ $t('Remove') }}
                </button>
              </div>
            </div>
          </article>

          <!-- Empty -->
          <div v-if="isEmpty" class="card">
            <div class="card-body text-center">
              <h4 class="text-center display-4">{{ $t('Your cart is empty') }}</h4>
              <router-link :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale } }" type="button" class="btn btn-lg btn-primary mt-3">
                {{ $t('Continue shopping') }}
              </router-link>
            </div>
          </div>
        </div>

        <aside class="col-4">
          <div ref="aside" class="cart-aside">
            <div class="card">
              <div class="card-body">
                <input :placeholder="$t('Coupon')" type="text" name="coupon" class="form-control p-2 mb-2">

                <div class="form-check">
                  <input id="gift-wrap" v-model="giftOptions.is_gift" class="form-check-input" type="checkbox">
                  <label class="form-check-label" for="gift-wrap">
                    {{ $t('Please Gift Wrap my order - $6.00') }}
                  </label>
                </div>

                <div class="form-check mt-2">
                  <input id="donation" v-model="giftOptions.donation" class="form-check-input" type="checkbox">
                  <label class="form-check-label" for="donation">
                    {{ $t('Faire un don - 0.5€') }}
                  </label>
                </div>

                <hr class="my-6">

                <div class="d-flex justify-content-between fw-bold">
                  <h5 class="text-uppercase fs-6 fw-bold">{{ $t('Subtotal') }}</h5>
                  <h5 class="text-uppercase fs-6 fw-bold">
                    {{ $n(grandTotal, 'currency', $i18n.locale) }}
                  </h5>
                </div>

                <div class="d-flex justify-content-between text-muted mt-2 mb-4">
                  <h5 class="text-uppercase fs-6">Remise</h5>
                  <h5 class="text-uppercase fs-6">25€</h5>
                </div>

                <div class="d-flex justify-content-between">
                  <h5 class="text-uppercase fw-bold">{{ $t('Total') }}</h5>
                  <h5 class="fw-bold">{{ $n(grandTotal, 'currency', $i18n.locale) }}</h5>
                </div>

                <hr class="my-7">

                <router-link :to="{ name: 'shipment_view', params: { lang: $i18n.locale } }" class="btn btn-block btn-primary">
                  {{ $t('Checkout') }}
                </router-link>

                <router-link :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale } }" class="btn btn-block btn-light">
                  {{ $t('Continue shopping') }}
                </router-link>
              </div>
            </div>

            <div class="card mt-2">
              <div class="card-body">
                payment
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div class="row text-center">
        <p class="my-5 py-6 fs-4">
          Modes de livraison magasin : offerte sans minimum d'achat // domicile : offerte dès 70€ d'achat // point
          relais : offerte dès 70€ d'achat
        </p>
      </div>

      <div class="row">
        <div class="reassurance d-flex justify-content-around text-center">
          <div class="p-5">
            <!-- <v-icon class="mr-2 mb-3">mdi-arrow-left</v-icon> -->
            <p class="fs-5">Livraison et retours gratuit</p>
          </div>

          <div class="p-5">
            <!-- <v-icon class="mr-2 mb-3">mdi-arrow-left</v-icon> -->
            <p class="fs-5">Livraison et retours gratuit</p>
          </div>

          <div class="p-5">
            <!-- <v-icon class="mr-2 mb-3">mdi-arrow-left</v-icon> -->
            <p class="fs-5">Livraison et retours gratuit</p>
          </div>

          <div class="p-5">
            <!-- <v-icon class="mr-2 mb-3">mdi-arrow-left</v-icon> -->
            <p class="fs-5">Livraison et retours gratuit</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'

import { mapState } from 'pinia'
import { useCart } from '@/store/cart'
import { useUrls, useUtilities } from '@/composables/utils'
import { getCurrentInstance } from 'vue'
import useCartComposable from '@/composables/cart'

import BasePriceDisplay from '@/layouts/shop/BasePriceDisplay.vue'

export default {
  name: 'CartView',
  components: { BasePriceDisplay },
  setup () {
    const store = useCart()
    const { truncate, getVerticalScrollPercentage } = useUtilities()
    const { removeFromCart } = useCartComposable(getCurrentInstance())
    const { mediaUrl } = useUrls()
    return {
      store,
      getVerticalScrollPercentage,
      removeFromCart,
      mediaUrl,
      truncate
    }
  },
  data: () => ({
    giftOptions: {
      is_gift: false,
      donation: false
    }
  }),
  computed: {
    ...mapState(useCart, ['cartItems', 'count', 'total', 'cachedCartResponse']),
    grandTotal () {
      return _.sum([this.total, this.giftOptions.is_gift ? 6 : 0, this.giftOptions.donation ? 0.5 : 0])
    }
  },
  mounted () {
    this.store.reloadCache(),
    window.addEventListener("scroll", this.asideEventListener)
  },
  beforeUnmount () {
    window.removeEventListener("scroll", this.asideEventListener)
  },
  methods: {
    asideEventListener () {
      const percentage = this.getVerticalScrollPercentage(document.body)
      if (percentage >= 20) {
        this.$refs.aside.classList.add("aside-sticky")
      } else {
        this.$refs.aside.classList.remove("aside-remove")
      }
    }
  }
}
</script>

<style scoped>
body {
  background-color: #f6f6f6 !important;
}

.aside-sticky {
  position: sticky;
  top: 20%;
  left: 0;
}

aside {
  transition: all .4s ease-in-out;
}
</style>
