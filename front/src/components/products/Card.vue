<template>
  <b-card v-if="isLoading">
    <b-skeleton-img height="300px" />
    <b-skeleton width="65%" class="mt-3" />
    <b-skeleton width="25%" class="mt-3" />
  </b-card>

  <!-- <router-link v-else :to="{ name: 'product', params: { id: product.id, slug: product.slug, lang: $i18n.locale } }" class="text-17">
    <b-card id="product" class="border-0 hover-shadow" body-class="p-1 normalize-link " img-top>
      <b-card-img :src="mainImage.mid_size|mediaUrl" :alt="mainImage.name"></b-card-img>
      
      <b-card-body class="p-1 mt-3">
        <p v-if="multipleGridDisplay" class="mb-0">
          {{ product.name|truncate }}
        </p>

        <span class="font-weight-bold">
          <strong>{{ $n(product.unit_price, 'currency', $i18n.locale) }}</strong>
        </span>
      </b-card-body>
    </b-card>
  </router-link> -->

  <router-link v-else :to="{ name: 'product', params: { id: product.id, slug: product.slug, lang: $i18n.locale } }" class="text-17">
    <div id="link-product-card" class="product" @mouseenter="isHovered = true" @mouseleave="isHovered=false" @click="$emit('product-card-click')">
      <!-- TODO: Show when a product is marked as new -->
      <!-- <div class="product-badge">Nouveau</div> -->
      
      <div id="image">
        <v-img :lazy-src="mainImage.mid_size|mediaUrl" :src="mainImage.mid_size|mediaUrl" :alt="mainImage.name" :class="{ 'zoom': isHovered && hasEffect }" />
      </div>

      <div id="details" class="normalize-link">
        <p class="mb-0">
          {{ product.name|capitalizeLetters|truncate }}
        </p>

        <span class="font-weight-bold">
          {{ $n(product.unit_price, 'currency', $i18n.locale) }}
        </span>
      </div>

      <transition name="button-transition">
        <b-btn v-if="isHovered && showQuickButton" id="add-to-cart" variant="primary">
          {{ $t('Add to cart') }}
        </b-btn>
      </transition>
    </div>
  </router-link>
</template>

<script>
var _ = require('lodash') 

export default {
  name: 'Card',

  filters: {
    truncate(value) {
      return `${value.slice(0, 20)}...`
    }
  },
  
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
    showQuickButton: {
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

  // methods: {
  //   animateImage (el) {
  //     el
  //   }
  // }
}
</script>

<style scoped>
  /* .view, body, html {
      height: 100%;
  }

  .view {
      position: relative;
      overflow: hidden;
      cursor: default;
  }
  .overlay .mask {
    opacity: 0;
    transition: all 0.4s ease-in-out;
  } */

  .product {
    position: relative;

    /* max-width: 25%;
    flex: 0 0 25%;
    padding: .5rem;
    margin-bottom: 2rem; */
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
</style>
