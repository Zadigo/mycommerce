<template>
  <div ref="link" class="product-selection">
    <div class="wrapper">
      <article v-for="product in latestProducts" :key="product.id" class="card">
        <router-link :to="{ name: 'product_view', params: { id: product.id, slug: product.slug, lang: $i18n.locale } }" class="text-dark" @click="$emit('product-click', product)">
          <img v-if="product.get_main_image" :src="mediaUrl(product.get_main_image.mid_size)" :alt="product.name" class="card-img-top">
          <img v-else src="https://via.placeholder.com/300x300" :alt="product.name">
        </router-link>

        <div class="card-body">
          <router-link :to="{ name: 'product_view', params: { id: product.id, slug: product.slug, lang: $i18n.locale } }" class="text-dark">
            <p class="fw-normal dark-text mb-0">{{ truncate(product.name, 20) }}</p>
            <p class="fw-bold">{{ $n(product.get_price * 1, 'currency', $i18n.locale) }}</p>
          </router-link>
        </div>
      </article>
    </div>

    <button v-if="!arrivedState.left" id="left" type="button" class="btn btn-floating bg-white" @click="scrollItem('left')">
      <font-awesome-icon icon="fa-solid fa-arrow-left" />
    </button>

    <button v-if="!arrivedState.right" id="right" type="button" class="btn btn-floating bg-white" @click="scrollItem('right')">
      <font-awesome-icon icon="fa-solid fa-arrow-right" />
    </button>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAnalytics } from '@/plugins/vue-analytics/google'
import { useScroll } from '@vueuse/core'
import { useShop } from '../store/shop'
import { useUrls, useUtilities } from '@/composables/utils'

export default {
  name: 'BaseProductsRibbon',
  emits: {
    'product-click': () => true
  },
  setup () {
    const target = ref(null)
    const store = useShop()
    const { x, directions, arrivedState } = useScroll(target)
    const { google } = useAnalytics()
    const { truncate } = useUtilities()
    const { mediaUrl } = useUrls()
    return {
      google,
      scrollX: x,
      target,
      directions,
      arrivedState,
      store,
      mediaUrl,
      truncate
    }
  },
  data: () => ({
    currentPosition: 0,
    maxScrollablePosition: 0,
    latestProducts: []
  }),
  beforeMount () {
    const latestProducts = this.$session.retrieve('latestProducts')
    if (!latestProducts) {
      this.getLatestProducts()
    } else {
      this.store.products = latestProducts
      this.latestProducts = latestProducts
    }
  },
  mounted () {
    const element = this.$refs.link
    const wrapper = element.querySelector('.wrapper')
    this.target = wrapper
    const maxScrollablePosition = (wrapper.scrollWidth - wrapper.offsetWidth)
    this.maxScrollablePosition = maxScrollablePosition
  },
  methods: {
    async getLatestProducts () {
      try {
        const response = await this.$http.get('shop/latest', { limit: 10 })
        this.latestProducts = response.data
        this.store.products = response.data
        this.$localstorage.create('latestProducts', response.data)
      } catch (error) {
        this.store.addErrorMessage(`V-AX-LAT: An error occured: ${error}`)
      }
    },
    scrollItem (method) {
      const element = this.$refs.link
      const wrapper = element.querySelector('.wrapper')
      const currentPosition = wrapper.scrollLeft

      if (method === 'right') {
        wrapper.scrollLeft += 250
      }
      if (method === 'left') {
        wrapper.scrollLeft -= 250
      }
      this.currentPosition = currentPosition
    }
  }
}
</script>

<style scoped>
.product-selection {
  position: relative;
  /* padding: 2rem; */
}

.product-selection .wrapper {
  display: flex;
  padding: 1rem;
  overflow-x: scroll;
  scroll-behavior: smooth;
}

.product-selection .wrapper::-webkit-scrollbar {
  transition: all .3s ease;
  scroll-behavior: smooth;
  background-color: white;
  height: 5px;
}

.product-selection .wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, .2);
  border-radius: .5rem;
}

.product-selection .wrapper .card {
  margin: .5rem;
  /* min-width: 300px; */
  min-width: 200px;
}

.product-selection .btn#right {
  position: absolute;
  right: 3%;
  top: 40%;
  bottom: 50%;
  width: 3rem;
  height: 3rem;
}

.product-selection .btn#left {
  position: absolute;
  left: 3%;
  top: 40%;
  bottom: 50%;
  width: 3rem;
  height: 3rem;
}
</style>
