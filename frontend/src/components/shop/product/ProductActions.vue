<template>
  <div id="actions">
    <!-- Colors -->
    <div id="colors" class="my-3">
      <p class="mb-2">
        <span class="fw-bold">{{ $t('Color') }}</span>: {{ product.color }}
      </p>

      <!-- TODO: Create a swatch reusable component -->
      <div class="swatch">
        <router-link v-for="variant in productVariants" :key="variant.id" :to="{ name: 'product_view', params: { id: variant.id, slug: variant.slug, lang: $i18n.locale } }" class="color">
          <img :src="buildSwatch(variant.color)" class="img-fluid">
        </router-link>
      </div>
    </div>

    <!-- Size -->
    <div id="sizes" class="my-2">
      <p class="mb-2 fw-bold">{{ $t('Size') }}</p>

      <div v-if="hasSizes" class="sizes">
        <button v-for="(size, i) in product.sizes" id="btn-select-size" :key="size.id" :class="{ 'ms-2': i > 0, 'btn-dark': productOptions.default_size == size.name, 'btn-light': !(productOptions.default_size == size.name) }" class="btn btn-md shadow-none border" @click="setSize(size)">
          {{ size.name }}
        </button>
      </div>

      <div v-else id="sizes">
        <button id="btn-no-size" class="btn btn-md btn-outline-dark shadow-none border disabled">
          {{ $t('Unique size') }}
        </button>
      </div>

      <!-- <size-guide /> -->
    </div>

    <div v-if="noSizeSelected" class="bg-light p-2 rounded">
      {{ $t('Choose a size') }}
    </div>

    <!-- Actions -->
    <div id="cart" class="d-flex justify-content-left my-4">
      <button id="btn-add-cart" class="btn btn-lg btn-dark me-2 fs-4" @click="addToCart">
        <div v-if="addingToCart" class="spinner-border text-light me-2" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        {{ $t('Add to cart') }}
      </button>

      <!-- Add to like -->
      <button id="btn-add-like" class="btn btn-md btn-danger fs-4" @click="addToLikes">
        <font-awesome-icon icon="fa-solid fa-heart" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useShop } from '@/store/shop'
import { useAuthentication } from '@/store/authentication'
import { getCurrentInstance } from 'vue'

import useCartComposable from '@/composables/cart'

// import SizeGuide from './SizeGuide.vue'

export default {
  name: 'ProductActions',
  components: {
    // SizeGuide
  },
  props: {
    product: {
      type: Object
    },
    productVariants: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    const store = useShop()
    const app = getCurrentInstance()
    const { addingToCart, productOptions, getCart, getSessionId } = useCartComposable(app)
    return {
      store,
      addingToCart,
      productOptions,
      getCart,
      getSessionId
    }
  },
  data: () => ({
    noSizeSelected: false
  }),
  computed: {
    ...mapState(useAuthentication, ['isAuthenticated']),
    hasSizes () {
      return this.product.sizes.length > 0
    }
  },
  methods: {
    // TODO: Create a general function
    async addToCart () {
      try {
        this.addingToCart = true

        const options = this.productOptions
        const default_size = this.productOptions.default_size

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
          options.default_size = 'Unique'
        }

        try {
          // Try to get a current session_id if the
          // user has already been adding items to
          // his current cart
          options.session_id = this.getSessionId()
        } catch (error) {
          options.session_id = null
        }
        options.product = this.product.id

        const response = await this.$http.post('cart/add', options)
        const data = response.data

        this.store.$patch((state) => {
          state.cart = data
          this.$localstorage.create('cart', data)
        })

        this.addingToCart = false
        this.noSizeSelected = false
        this.productOptions = {
          default_size: null
        }
      } catch (error) {
        console.error(error)
        this.store.addErrorMessage(`V-AX-CA: ${error}: ${error.response.message}`)
      }
    },
    async addToLikes () {
      // TODO: Create a general function for this
      if (this.isAuthenticated) {
        try {
          const response = await this.$http.post(`shop/products/${this.product.id}/like`)
          this.store.addSuccessMessage('Added to like')
          this.$localstorage.create('likedProducts', response.data.result)
        } catch (error) {
          this.store.addErrorMessage('An error occured')
        }
      } else {
        // Open login modal
      }
    },
    buildSwatch (color) {
      // From the color of the variant build the
      // url that allows us to get the color's image
      const url = new URL(`media/swatches/${color.toLowerCase()}.png`, 'http://127.0.0.1:8000')
      return url.toString()
    },
    matchesWithRoute (variant) {
      return variant.id === this.$route.params.id
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
  .swatch .router-link-exact-active {
    border: 1px solid white;
  }
  .swatch .color::before {
    border: 2px solid #222;
    border-radius: 50%;
    background: transparent;
  }
  .swatch .color::after {
    border: 2px solid #222;
    border-radius: 50%;
    background: transparent;
  }
  .swatch .color:not(:last-child) {
    margin-right: .5rem;
  }

  .spinner-border {
    width: 1.5rem;
    height: 1.5rem;
    border-width: .2em;
  }
</style>
