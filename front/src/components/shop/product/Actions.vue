<template>
  <div id="actions">
    <!-- Colors -->
    <div id="colors" class="my-3">
      <p class="mb-2 font-size-2">
        <span class="font-weight-bold">{{ $t('Color') }}</span>: {{ product.color }}
      </p>

      <!-- TODO: Create a swatch reusable component -->
      <div class="swatch">
        <router-link v-for="variant in productVariants" :key="variant.id" :to="{ name: 'product_view', params: { id: variant.id, slug: variant.slug, lang: $i18n.locale } }" :class="{ active: matchesWithRoute(variant) }" class="color">
          <v-img :src="buildSwatch(variant.color)"></v-img>
        </router-link>
      </div>
    </div>

    <!-- Size -->
    <div id="sizes" class="my-2">
      <p class="mb-2 font-size-2">
        {{ $t('Size') }}
      </p>

      <div v-if="sizes.length > 0" class="sizes">
        <b-btn v-for="(size, i) in sizes" id="btn-select-size" :key="size.key" :class="{ 'ml-2': i > 0, 'bg-dark': productOptions.default_size == size }" class="shadow-none border" variant="light" @click="setSize(size)">
          {{ size.name }}
        </b-btn>
      </div>

      <div v-else id="sizes">
        <btn id="btn-no-size" class="btn btn-md btn-outline-dark shadow-none border disabled">
          {{ $t('Unique size') }}
        </btn>
      </div>

      <size-guide />
    </div>

    <!-- Actions -->
    <div id="cart" class="d-flex justify-content-left my-4">      
      <!-- Add to cart -->
      <btn id="btn-add-cart" class="btn btn-lg btn-dark mr-2 font-size-3" @click="addToCart">
        <v-progress-circular v-if="addingToCart" :size="25" class="mr-2" color="white" indeterminate></v-progress-circular>
        {{ $t('Add to cart') }}
      </btn>

      <!-- Add to like -->
      <btn id="btn-add-like" class="btn btn-md btn-danger" @click="addToLikes">
        <v-icon class="text-white">mdi-heart</v-icon>
      </btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import cartMixin from '@/mixins/cart'

import SizeGuide from './SizeGuide.vue'

export default {
  name: 'Actions',
  components: {
    SizeGuide
  },
  mixins: [cartMixin],
  props: {
    product: {
      type: Object
    },
    productVariants: {
      type: Array,
      default: () => []
    },
    sizes: {
      type: Array,
      default: () => []
    }
  },
  title: () => 'Cart',

  data: () => ({
    productOptions: {
      default_size: 'Unique'
    },
    addingToCart: false
  }),

  computed:{
    ...mapGetters('authenticationModule', ['isAuthenticated'])
  },

  methods: {
    addToCart () {
      // TODO: Create a general function
      this.addingToCart = true

      var options = this.productOptions
      var cart = this.$localstorage.retrieve('cart')

      options['session_id'] = cart ? cart['session_id'] : null

      this.$api.shop.cart.add(this.product, options)
      .then((response) => {
        var data = response.data

        this.$store.commit('updateCart', data)
        this.$localstorage.create('cart', data)
        
        // this.$analytics.google.addToCart({
        //   item_name: this.product.name
        // })

        setTimeout(() => {
          this.addingToCart = false
          this.productOptions.default_size = 'Unique'
        }, 2000)
      })
      .catch((error) => {
        this.$store.dispatch('addErrorMessage', error.response.statusText)
      })
    },

    addToLikes () {
      // TODO: Create a general function for this
      if (!this.isAuthenticated) {
        this.$store.commit('authenticationModule/loginUser')
      } else {
        this.$api.shop.lists.like(this.product)
        .then((response) => {
          var data = response.data
          console.log(data)
        })
        .catch((error) => {
          error
        })
      }
    },

    buildSwatch (color) {
      // From the color of the variant build the
      // url that allows us to get the color's image
      var url = new URL(`media/swatches/${ color.toLowerCase() }.png`, 'http://127.0.0.1:8000')
      return url.toString()
    },

    matchesWithRoute (variant) {
      return variant.id == this.$route.params.id
    },

    setSize (size) {
      this.productOptions.default_size = size
    }
  }
}
</script>

<style scoped>
  .sizes #btn-select-size {
    width: 15%;
  }

  .sizes #btn-no-size {
    width: 50%;
  }

  .swatch {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: left;
    width: 100%;
  }

  .swatch .color {
    display: block;
    overflow: hidden;
    border-radius: 50%;
    min-height: 34px;
    width: 34px;
  }

  .swatch .color.active {
    box-shadow: 0 0 0 2px #000;
    border: 2px solid #fff;
  }

  .swatch .color:not(:last-child) {
    margin-right: .5rem;
  }
</style>
