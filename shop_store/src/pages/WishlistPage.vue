<template>
  <shop-layout>
    <section id="wishlist" class="container space-section">
      <div class="row g-2">
        <div v-if="!authenticationStore.isAuthenticated" class="col-sm-12 col-md-4">
          <div class="card shadow-sm" style="height: 557px;">
            <div class="card-body text-center p-5 d-flex flex-column justify-content-center">
              <div class="information">
                <font-awesome-icon :icon="['fas', 'star']" class="text-warning mb-4" size="4x" />
                
                <h1 class="card-title h6 fw-bold mt-4 mb-3">
                  {{ $t('Conservation des favoris') }}
                </h1>

                <p class="fw-light">
                  {{ $t('Keep favorites text') }}
                </p>

                <v-btn color="secondary" flat rounded @click="showLoginDrawer = true">
                  <font-awesome-icon :icon="['fas', 'right-to-bracket']" class="me-2" />
                  {{ $t('Se connecter') }}
                </v-btn>
              </div>
            </div>
          </div>
        </div>

        <template v-if="likedProducts.length > 0">
          <!-- <base-product-iterator :products="likedProducts" /> -->
        </template>

        <template v-else>
          <div v-for="i in 2" :key="i" class="col-sm-12 col-md-4">
            <div class="card shadow-sm">
              <v-img :src="`/img${i}.jpeg`" lazy-src="`/img${i}.jpeg`" class="card-img" alt=""></v-img>
            </div>
          </div>
        </template>
      </div>
    </section>
  </shop-layout>
</template>

<script>
import { useHead } from 'unhead'
import { storeToRefs } from 'pinia'
import { useShop } from 'src/stores/shop'
import { useAuthentication } from 'src/stores/authentication'
import { ref } from 'vue';

// import BaseProductIterator from '@/components/BaseProductIterator.vue'

export default {
  name: 'WishlistPage',
  components: {
    // BaseProductIterator
  },
  setup () {
    const authenticationStore = useAuthentication()
    const { showLoginDrawer } = storeToRefs(authenticationStore)

    const shopStore = useShop()
    const { likedProducts } = storeToRefs(shopStore)
    const products = ref([])

    useHead({
      title: 'Wishlist',
      description: ''
    })
    console.log(likedProducts.value)
    return {
      products,
      authenticationStore,
      likedProducts,
      showLoginDrawer
    }
  },
  methods: {
    /** */
    async requestLikedProducts () {
      try {
        const response = await this.$http.post('products', {
          products: this.likedProducts
        })
        this.products = response.data
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
