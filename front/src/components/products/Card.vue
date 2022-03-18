<template>
  <transition name="general-transition" mode="out-in">
    <b-card v-if="isLoading || !mainImage" id="link-product-card" class="product">
      <div id="image">
        <b-skeleton-img height="400px" />
      </div>
      <b-skeleton width="65%" class="mt-3" />
      <b-skeleton width="25%" class="mt-3" />
    </b-card>

    <router-link v-else :to="{ name: 'product', params: { id: product.id, slug: product.slug, lang: $i18n.locale } }" class="text-17">
      <div id="link-product-card" class="product" @mouseenter="isHovered=true" @mouseleave="isHovered=false" @click="$emit('product-card-click')">
        <!-- TODO: Show when a product is marked as new -->
        <!-- <div class="product-badge">Nouveau</div> -->
        
        <div id="image">
          <!-- FIXME: When a product has not image, the single component does not mount
          maybe force products to have images on the backend so that this does not happen
          or use a placeholder image -->
          <v-img :lazy-src="'http://via.placeholder.com/600x1100'" :src="mainImage.mid_size|mediaUrl" :alt="mainImage.name" :class="{ 'zoom': isHovered && hasEffect }" />
        </div>

        <div id="details" class="normalize-link">
          <p class="mb-0">
            {{ product.name|capitalizeLetters|truncate }}
          </p>

          <span v-if="product.on_sale" class="font-weight-bold">
            {{ $n(product.sale_price, 'currency', $i18n.locale) }}
          </span>
          <span v-else class="font-weight-bold">
            {{ $n(product.unit_price, 'currency', $i18n.locale) }}
          </span>
          <span v-if="product.on_sale" class="ml-3 text-red">
            <del>{{ $n(product.unit_price, 'currency', $i18n.locale) }}</del>
          </span>
        </div>

        <!-- <transition name="button-transition">
          <v-btn v-if="isHovered && showCartButton" id="add-to-cart" variant="primary" @click="addToCart(product)">
            {{ $t('Add to cart') }}
          </v-btn>
        </transition>
         -->
        <!-- TODO: The tags are colliding when there are multiple -->
        <base-tag v-if="product.on_sale" :is-absolute="true" :padding="1" :width="30" background-color="red" class="m-3">
          {{ $t('Sale') }}
        </base-tag>

        <base-tag v-if="product.display_new && !product.on_sale" :is-absolute="true" :padding="1" :width="30" class="m-3">
          {{ $t('Nouveau') }}
        </base-tag>
      </div>
    </router-link>
  </transition>
</template>

<script>
var _ = require('lodash') 

import cartMixin from '../cartMixin'
import BaseTag from '../BaseTag.vue'

export default {
  name: 'Card',
  filters: {
    truncate(value) {
      return `${value.slice(0, 20)}...`
    }
  },
  components: {
    BaseTag
  },
  mixins: [cartMixin],

  props: {
    product: {
      type: Object,
      required: true
    },
    multipleGridDisplay: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    showCartButton: {
      type: Boolean
    },
    hasEffect: {
      type: Boolean
    }
  },

  data: () => ({
    isHovered: false
  }),
  
  computed: {
    mainImage () {
      var mainImage = _.find(this.product.images, ['is_main_image', true])
      return _.isUndefined(mainImage) ? this.product.images[0] : mainImage
    }
  }
}
</script>

<style scoped>
  .product {
    position: relative;
  }

  .product #add-to-cart {
    position: absolute;
    bottom: 20%;
    left: 15%;
    z-index: 6000;
  }
  .product #image {
    transition: all .2s ease;
    overflow: hidden;
  }

  btn#add-to-cart {
    z-index: 8000;
  }

  .button-transition-enter-active,
  .button-transition-leave-active {
    transition: all .3s ease-in;
  }
  .button-transition-enter,
  .button-transition-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  .button-transition-enter-to,
  .button-transition-leave {
    opacity: 1;
    transform: translateY(0px);
  }
  .zoom {
    transform: scale(1.2, 1.2) rotate(-5deg);
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
</style>
