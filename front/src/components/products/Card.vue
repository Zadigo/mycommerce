<template>
  <div v-if="isLoading || !mainImage" id="link-product-card" class="product">
    <div id="image">
      <b-skeleton-img height="504px" />
    </div>

    <b-skeleton width="65%" class="mt-3" />
    <b-skeleton width="25%" class="mt-3" />
  </div>

  <!-- TODO: Change .v-application a which makes links blue -->
  <div v-else id="link-product-card" class="product" @click="$emit('product-card-click', product)" @mouseenter="isHovered=true" @mouseleave="isHovered=false">
    <!-- TODO: Show when a product is marked as new -->
    <!-- <div class="product-badge">Nouveau</div> -->
    
    <div id="product-image">
      <router-link :to="{ name: 'product_view', params: { id: product.id, slug: product.slug, lang: $i18n.locale } }">
        <img :src="mainImage.mid_size|mediaUrl" :alt="mainImage.name" class="img-fluid" />
      </router-link>

      <transition name="slide-transition">
        <div v-if="isHovered" class="mini-cart p-3">
          <div class="font-weight-bold mb-3 text-uppercase">{{ $t('Add to cart') }}</div>

          <div id="sizes">
            <button type="button" class="btn btn-outline-dark">XS</button>
            <button type="button" class="btn btn-outline-dark mx-1">S</button>
            <button type="button" class="btn btn-outline-dark mx-1">M</button>
          </div>
        </div>
      </transition>
    </div>

    <router-link :to="{ name: 'product_view', params: { id: product.id, slug: product.slug, lang: $i18n.locale } }" class="text-17 normalize-link">
      <div id="product-details" class="mt-2">
        <p class="mb-0">
          {{ product.name|capitalizeLetters|truncate }}
        </p>

        <span v-if="product.on_sale" class="font-weight-bold">
          {{ $n(product.sale_price, 'currency', $i18n.locale) }}
        </span>

        <span v-else class="font-weight-bold">
          {{ $n(product.unit_price, 'currency', $i18n.locale) }}
        </span>
        
        <span v-if="product.on_sale" class="ml-2 text-red">
          <del>{{ $n(product.unit_price, 'currency', $i18n.locale) }}</del>
        </span>

        <span v-if="product.sale_value" class="bg-danger p-1 rounded text-white ml-3">
          {{ `-${product.sale_value}%`  }}
        </span>
      </div>
    </router-link>

    <!-- TODO: The tags are colliding when there are multiple -->
    <base-tag v-if="product.on_sale" :is-absolute="true" :padding="1" :width="30" background-color="red" class="m-3">
      {{ $t('Sale') }}
    </base-tag>

    <base-tag v-if="product.display_new && !product.on_sale" :is-absolute="true" :padding="1" :width="30" class="m-3">
      {{ $t('New') }}
    </base-tag>
  </div>
  <!-- <transition name="general-transition" mode="out-in">
  </transition> -->
</template>

<script>
var _ = require('lodash') 

import cartMixin from '../../mixins/cartMixin'
import BaseTag from '../../layouts/BaseTag.vue'

export default {
  name: 'Card',
  filters: {
    truncate(value) {
      return `${value.slice(0, 28)}...`
    }
  },
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
  
  #product-image {
    position: relative;
    overflow: hidden;
  }

  #product-image img {
    /* transition: all .2s ease; */
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
    transition: all .3s cubic-bezier(0, 0.5, 0.5, 1);
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
</style>
