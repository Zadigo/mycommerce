<template>
  <div v-if="isLoading || !mainImage" id="link-product-card" class="product">
    Loading...
    <!-- <div id="image">
      <b-skeleton-img height="504px" />
    </div>

    <b-skeleton width="65%" class="mt-3" />
    <b-skeleton width="25%" class="mt-3" /> -->
  </div>

  <!-- TODO: Change .v-application a which makes links blue -->
  <div v-else id="link-product-card" class="product my-1" @click="$emit('product-card-click', product)" @mouseenter="isHovered=true" @mouseleave="isHovered=false">
    <!-- TODO: Show when a product is marked as new -->
    <!-- <div class="product-badge">Nouveau</div> -->
    
    <div id="product-image">
      <router-link :to="{ name: 'product_view', params: { id: product.id, slug: product.slug, lang: $i18n.locale } }">
        <img :src="mediaUrl(mainImage.mid_size)" :alt="mainImage.name" class="img-fluid" />
      </router-link>

      <transition name="slide-transition">
        <div v-if="isHovered" class="mini-cart p-3">
          <div class="fw-bold mb-3 text-uppercase">{{ $t('Add to cart') }}</div>
          
          <div id="sizes">
            <div v-if="hasSizes">
              <button v-for="size in product.sizes" :key="size.name" type="button" :class="{ disabled: !size.availability }" class="btn btn-outline-dark mr-2" @click="simpleAddToCard(product, size, true)">
                {{ size.name }}
              </button>
            </div>

            <button v-else class="btn btn-outline-dark" @click="simpleAddToCard(product, { name: 'Unique' }, true)">
              {{ $t('Unique') }}
            </button>
          </div>
        </div>
      </transition>
    </div>

    <router-link :to="{ name: 'product_view', params: { id: product.id, slug: product.slug, lang: $i18n.locale } }" class="text-decoration-none">
      <div id="product-details" class="mt-2">
        <p class="fw-normal mb-0">
          {{ truncate(capitalizeLetters(product.name)) }}
        </p>
        
        <div class="d-flex justify-content-between">
          <div>
            <span v-if="product.on_sale" class="me-2 text-red">
              <!-- <del>{{ $n(product.unit_price, 'currency', $i18n.locale) }}</del> -->
              <del>{{ product.unit_price }}</del>
            </span>

            <span class="fw-bold">
              <!-- {{ $n(product.get_price, 'currency', $i18n.locale) }} -->
              {{ product.on_sale ? product.sale_price : product.unit_price }}
            </span>
          </div>
          
          <div>
            <span v-if="product.on_sale" class="bg-danger p-1 rounded text-white ml-3">
              <!-- {{ formatPercentage(product.sale_value, true) }} -->
              {{ product.sale_value }}
            </span>
          </div>
        </div>
    

      </div>
    </router-link>

    <div class="d-flex justify-content-left p-absolute m-2">
      <base-tag v-if="product.on_sale" :padding="1" :width="30" background-color="bg-primary">
        {{ $t('Sale') }}
      </base-tag>

      <base-tag v-if="product.display_new" :padding="1" :width="30" background-color="bg-danger" class="mx-2">
        {{ $t('New') }}
      </base-tag>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { truncate, capitalizeLetters, mediaUrl, formatPercentage } from '@/utils'
import { useShop } from '@/store/shop'
import cartMixin from '@/mixins/cart'

import BaseTag from '@/layouts/shop/BaseTag.vue'

export default {
  name: 'ProductCard',
  components: {
    BaseTag
  },
  mixins: [cartMixin],
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
  setup() {
    var store = useShop()
    return {
      capitalizeLetters,
      formatPercentage,
      mediaUrl,
      store,
      truncate
    }
  },
  data: () => ({
    isHovered: false
  }),
  computed: {
    mainImage () {
      var mainImage = _.find(this.product.images, ['is_main_image', true])
      return _.isUndefined(mainImage) ? this.product.images[0] : mainImage
    },

    hasSizes() {
      return this.product.sizes.length > 0
    }
  }
}
</script>

<style scoped>
  .product {
    position: relative;
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
  
  .scale-transition-enter,
  .scale-transition-leave-to {
    opacity: 0;
    transform: scale(.8, .8);
  }
  
  .scale-transition-enter-to,
  .scale-transition-leave {
    opacity: 1;
    transform: scale(1, 1);
  }

  .slide-transition-enter-active,
  .slide-transition-leave-active {
    transition: color .8s ease;
    transition: all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .slide-transition-enter,
  .slide-transition-leave-to {
    opacity: 0;
    transform: translateY(50px);
  }
  
  .slide-transition-enter-to,
  .slide-transition-leave {
    opacity: 1;
    transform: translateY(0px);
  }

</style>
