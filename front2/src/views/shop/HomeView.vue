<template>
  <section id="home">
    <base-intro-vue :image="require('@/assets/hero4.jpg')" height="90vh" offset-top="80px" class="shadow-sm">
      <template #default>
        <div class="text-white">
          <h1 class="mb-3 lead">Assouvis tes ardents désir</h1>
          <h5 class="mb-4 lead-smaller">Craquez pour nos nouveautés signées Lounge</h5>

          <router-link :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale  } }"
            class="btn btn-dark btn-lg btn-rounded" role="button">
            {{ $t('Discover') }}
          </router-link>
        </div>
      </template>
    </base-intro-vue>

    <section class="two-images">
      <div class="image">
        <div class="title">
          <h3 class="p-2 text-white text-uppercase fw-bold">-20% sur les sous-vêtements</h3>
          <button type="button" class="btn btn-lg btn-rounded btn-dark">
            Le top de nos soldes
          </button>
        </div>
      </div>

      <div class="image">
        <div class="title">
          <h3 class="p-2 text-white text-uppercase fw-bold">
            -20% de réduction sur les vêtements
          </h3>
          <button type="button" class="btn btn-lg btn-rounded btn-dark">
            Le top de nos soldes
          </button>
        </div>
      </div>
    </section>

    <!-- TODO: Create a unique component for this -->
    <section ref="productSelection" class="product-selection">
      <div class="wrapper">
        <div v-for="product in latestProducts" :key="product.id" class="card">
          <router-link :to="{ name: 'product_view', params: { id: product.id, slug: product.slug, lang: $i18n.locale } }" class="text-dark">
            {{ product.get_main_image }}
            <!-- <img :src="mediaUrl(product.get_main_image.mid_size)" class="card-img-top" alt=""> -->
          </router-link>
          
          <div class="card-body">
            <router-link :to="{ name: 'product_view', params: { id: product.id, slug: product.slug, lang: $i18n.locale } }" class="text-dark">
              <h4>{{ truncate(product.name, 20) }}</h4>
              <p class="fw-bold">{{ product.get_price }}</p>
            </router-link>
          </div>
        </div>
      </div>
      <transition name="scale">
        <button v-if="currentPosition >= 250 || currentPosition === maxScrollablePosition" type="button" id="left" class="btn btn-floating bg-white" @click="scrollItem('left')">
          Left
        </button>
      </transition>
      <transition name="scale">
        <button v-if="currentPosition !== maxScrollablePosition" type="button" id="right" class="btn btn-floating bg-white" @click="scrollItem('right')">
          Right
        </button>
      </transition>
    </section>

    <section class="ecommerce-section d-flex justify-content-around">
      <div class="card mx-2">
        <img src="http://via.placeholder.com/600x600" class="card-img-top" alt="">
        <div class="card-body text-center">
          <p>Some item</p>
          <button class="btn btn-lg btn-dark btn-rounded">Press</button>
        </div>
      </div>
      <div class="card mx-2">
        <img src="http://via.placeholder.com/600x600" class="card-img-top" alt="">
        <div class="card-body text-center">
          <p>Some item</p>
          <button class="btn btn-lg btn-dark btn-rounded">Press</button>
        </div>
      </div>
      <div class="card mx-2">
        <img src="http://via.placeholder.com/600x600" class="card-img-top" alt="">
        <div class="card-body text-center">
          <p>Some item</p>
          <button class="btn btn-lg btn-dark btn-rounded">Press</button>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { useShop } from '../../store/shop'
import { mediaUrl, truncate } from '../../utils'

export default {
  name: 'HomeView',
  setup () {
    const store = useShop()
    return {
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
    const element = this.$refs.productSelection
    const wrapper = element.querySelector('.wrapper')
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
      const element = this.$refs.productSelection
      const wrapper = element.querySelector('.wrapper')
      const currentPosition = wrapper.scrollLeft
      // if (currentPosition === 0 || currentPosition === maxScrollablePosition) {
      //   return
      // }

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
.two-images {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.two-images .image {
  position: relative;
  height: 500px;
  width: auto;
  overflow: hidden;
  background-image: url('../../assets/side1.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}

.two-images .image .title {
  position: absolute;
  width: 75%;
  padding: 2rem;
  bottom: 0;
  left: 0;
  z-index: 1;
}

.two-images .image::after {
  content: "";
  position: absolute;
  display: block;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  width: 100%;
  /* background: linear-gradient(180deg, rgba(0, 0, 0, 0), #fff); */
  background: linear-gradient(180deg, transparent, black);
}

.ecommerce-section {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  height: auto;
  width: 100%;
  overflow: hidden;
}

.product-selection {
  position: relative;
  padding: 2rem;
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
  min-width: 300px;
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
.scale-enter-active,
.scale-leave-active {
  transition: all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(.95, .95);
}
.scale-enter-to,
.scale-leave-from {
  transform: scale(1, 1);
}
</style>
