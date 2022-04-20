<template>
  <div id="actions">
    <!-- Colors -->
    <div id="colors" class="my-3">
      <p class="mb-2">
        <span class="fw-bold">{{ $t('Color') }}</span>: {{ product.color }}
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
      <p class="mb-2">
        {{ $t('Size') }}
      </p>

      <div v-if="hasSizes" class="sizes">
        <button v-for="(size, i) in product.sizes" id="btn-select-size" :key="size.id" :class="{ 'ml-2': i > 0, 'btn-dark': productOptions.default_size == size.name, 'btn-light': !(productOptions.default_size == size.name) }" class="btn btn-md shadow-none border" @click="setSize(size)">
          {{ size.name }}
        </button>
      </div>

      <div v-else id="sizes">
        <button id="btn-no-size" class="btn btn-md btn-outline-dark shadow-none border disabled">
          {{ $t('Unique size') }}
        </button>
      </div>

      <size-guide />
    </div>

    <div v-if="noSizeSelected" class="bg-light p-2 rounded">Choississez une taille</div>  

    <!-- Actions -->
    <div id="cart" class="d-flex justify-content-left my-4">
      <!-- Add to cart -->
      <button id="btn-add-cart" class="btn btn-lg btn-dark mr-2 font-size-3" @click="addToCart">
        <v-progress-circular v-if="addingToCart" :size="25" class="mr-2" color="white" indeterminate></v-progress-circular>
        {{ $t('Add to cart') }}
      </button>

      <!-- Add to like -->
      <button id="btn-add-like" class="btn btn-md btn-danger" @click="addToLikes">
        <v-icon class="text-white">mdi-heart</v-icon>
      </button>
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
    }
  },
  title: () => 'Cart',

  data: () => ({
    productOptions: {
      default_size: null
    },
    addingToCart: false,
    noSizeSelected: false
  }),

  computed:{
    ...mapGetters('authenticationModule', ['isAuthenticated']),

    hasSizes() {
      return this.product.sizes.length > 0
    }
  },

  methods: {
    // TODO: Create a general function
    async addToCart() {
      try {
        this.addingToCart = true
        
        var options = this.productOptions
        var default_size = this.productOptions['default_size']

        if (this.hasSizes && default_size == null) {
          this.noSizeSelected = true
          this.addingToCart = false
          return
        }

        // When the size is unique, and since
        // we initially set the default size
        // as null, set it to Unique or this
        // will return an error requiring that
        // the default_size be not null
        if (default_size == null) {
          options['default_size'] = 'Unique'
        }

        try {
          // Try to get a current session_id if the
          // user has already been adding items to
          // his current cart
          options['session_id'] = this.getSessionId()
        } catch(error) {
          options['session_id'] = null
        }
        options['product'] = this.product.id

        var response = await this.axios.post('cart/add', options)
        var data = response.data
        
        this.$store.commit('updateCart', data)
        this.$localstorage.create('cart', data)

        this.addingToCart = false
        this.noSizeSelected = false
        this.productOptions = {
          default_size: null
        }
      } catch(error) {
        this.$store.dispatch('addErrorMessage', `${error}: ${error.response}`)
      }
    },

    async addToLikes() {
      // TODO: Create a general function for this
      if (!this.isAuthenticated) {
        this.$store.commit('authenticationModule/loginUser')
      } else {
        try {
          var response = await this.axios.post(`shop/products/${this.product.id}/like`)
          this.$store.commit('addSuccessMessage', 'Added to like')
          this.$localstorage.create('likes', response.data.result)
        } catch(error) {
          this.$store.dsipatch('addErrorMessage', error)
        }
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
      this.noSizeSelected = false
      this.productOptions.default_size = size.name
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
