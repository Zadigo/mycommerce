<template>
  <div id="actions">
    <!-- Colors -->
    <div id="colors" class="my-3">
      <p class="mb-2 fs-6">
        <span class="fw-bold">{{ $t('Color') }}</span>: {{ product.color }}
      </p>

      <!-- TODO: Create a swatch reusable component -->
      <div class="swatch">
        <router-link v-for="variant in productVariants" :key="variant.id" :to="{ name: 'product_view', params: { id: variant.id, slug: variant.slug, lang: $i18n.locale } }" class="color">
          <img :src="buildSwatch(variant.color)" :alt="variant.slug" class="img-fluid">
        </router-link>
      </div>
    </div>

    <!-- Size -->
    <div id="sizes" class="my-2">
      <p class="mb-2 fw-bold fs-6">{{ $t('Size') }}</p>

      <div v-if="hasSizes" class="sizes">
        <button v-for="(size, i) in product.sizes" id="btn-select-size" :key="size.id" :class="{ 'ms-2': i > 0, 'btn-dark': productOptions.default_size == size.name, 'btn-light': !(productOptions.default_size == size.name) }" type="button" class="btn btn-md shadow-none border" @click="setSize(size)">
          {{ size.name }}
        </button>
      </div>

      <div v-else id="sizes">
        <button id="btn-no-size" type="button" class="btn btn-md btn-outline-dark shadow-none border disabled">
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
      <!-- FIXME: There is an issue with addToLikes which does not pass the product
      in the funcion but instead passes $event (PointerEvent) -->
      <button id="btn-add-cart" type="button" class="btn btn-lg btn-dark me-2 fs-6" @click="doAddToCart">
        <div v-if="isSending" class="spinner-border text-light me-2" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        {{ $t('Add to cart') }}
      </button>

      <!-- Add to like -->
      <button id="btn-add-like" type="button" class="btn btn-md btn-danger fs-4" @click="addToLikes">
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
    const { isSending, addToCart, setProductOption, enforceSize } = useCartComposable(app)
    return {
      store,
      isSending,
      enforceSize,
      setProductOption,
      addToCart
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
    doAddToCart () {
      if (this.hasSizes && this.enforceSize()) {
        this.noSizeSelected = true
        this.addingToCart = false
      } else {
        this.addToCart(this.product, (data) => {
          this.store.$patch((state) => {
            state.cart = data
            this.$localstorage.create('cart', data)
          })
        })
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
      this.setProductOption('default_size', size)
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
    height: auto;
    width: 100%;
  }
  .swatch .color {
    display: block;
    overflow: hidden;
    border-radius: 50%;
    height: 25px;
    min-height: 25px;
    width: 25px;
    border: 1px solid transparent;
    transition: transform .6s cubic-bezier(.5, 1.6, .45, .7);
  }
  /* .swatch .router-link-exact-active {
    border: 1px solid black;
  } */
  /* .swatch .color::before {
    border: 2px solid #222;
    border-radius: 50%;
    background: transparent;
  }
  .swatch .color::after {
    border: 2px solid #222;
    border-radius: 50%;
    background: transparent;
  } */
  .swatch .color:not(:last-child) {
    margin-right: .5rem;
  }

  .spinner-border {
    width: 1.5rem;
    height: 1.5rem;
    border-width: .2em;
  }
</style>
