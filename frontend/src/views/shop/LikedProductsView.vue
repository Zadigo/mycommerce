<template>
  <section id="likes" class="ecommerce-section">
    <div class="container">
      <div v-if="likedProducts.length > 0" class="row">
        <article v-for="product in likedProducts" :key="product.id" class="col-3">
          <div class="card">
            <router-link :to="{ name: 'product_view', params: { id: product.id, slug: product.slug, lang: $i18n.locale } }">
              <img :src="mediaUrl(product.get_main_image.mid_size)" :alt="likedProducts.name" class="card-img-top">
            </router-link>

            <div class="card-body">
              <h5 class="card-title">
                <router-link :to="{ name: 'product_view', params: { id: product.id, slug: product.slug, lang: $i18n.locale } }">
                  {{ truncate(product.name, 20) }}
                </router-link>
              </h5>

              <p class="card-text">{{ product.get_price }}</p>

              <button class="btn btn-block btn-primary">
                {{ $t('Add to cart') }}
              </button>

              <button class="btn btn-block btn-primary" @click="removeFromLiked(product)">
                {{ $t('Remove') }}
              </button>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="row text-center">
        <div class="col-12">
          <font-awesome-icon icon="fa-solid fa-heart" size="4x" class="mb-2" />
          <h1 class="mb-4 fw-bold">{{ $t('You have no saved items') }}</h1>

          <div v-if="authStore.isAuthenticated" class="my-2">
            <router-link :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale } }" class="btn btn-lg btn-primary">
              {{ $t('Continue shopping') }}
            </router-link>
          </div>

          <div v-else class="my-2">
            <p>{{ $t('Sign in to sync your saved items across all your devices') }}</p>
            <router-link :to="{ name: 'login_view', params: { lang: $i18n.locale } }" class="btn btn-lg btn-primary">
              <font-awesome-icon icon="fa-solid fa-right-to-bracket" class="me-2" />
              {{ $t('Sign in') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useAuthentication } from '../../store/authentication'
import { mediaUrl, truncate } from '../../utils'
import useCartComposable from '../../composables/cart'

export default {
  name: 'LikedProductsView',
  setup () {
    const authStore = useAuthentication()
    const { addToCart } = useCartComposable()
    return {
      authStore,
      mediaUrl,
      truncate,
      addToCart
    }
  },
  data: () => ({
    likedProducts: []
  }),
  beforeMount () {
    if (this.authStore.isAuthenticated) {
      this.getLikedProducts()
      this.likedProducts = this.localStorage.likedProducts || []
    }
  },
  methods: {
    async getLikedProducts () {
      try {
        const response = await this.$http.get('shop/likes')
        this.likedProducts = response.data.products
        this.$localstorage.create('likedProducts', this.likedProducts)
      } catch (error) {
        this.authStore.addErrorMessage(`V-AX-LI: ${error}`)
      }
    },

    async removeFromLiked (product) {
      try {
        const response = await this.$http.post('shop/likes/remove', { product: product.id })
        this.likedProducts = response.data
        this.$localstorage.create('likedProducts', this.likedProducts)
      } catch (error) {
        this.authStore.addErrorMessage(`V-AX-LI: ${error}`)
      }
    }
  }
}
</script>
