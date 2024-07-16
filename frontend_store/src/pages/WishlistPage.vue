<template>
  <shop-layout>
    <section id="wishlist" class="container my-5">
      <div class="row g-1">
        <div v-if="!authenticationStore.isAuthenticated" class="col-4">
          <div class="card shadow-sm" style="height: 557px;">
            <div class="card-body text-center p-5 d-flex flex-column justify-content-center">
              <div class="information">
                <font-awesome-icon :icon="['fas', 'star']" class="text-warning mb-4" size="4x" />
                <h1 class="card-title h6">
                  {{ $t('Conservation des favoris') }}
                </h1>
                <p class="fw-light">
                  Crée un compte ou connecte-toi si tu en as déjà un et
                  nous conserverons tes favoris pour que tu puisses les voir
                  sur des dispositifs différents.
                </p>

                <v-btn @click="showLoginDrawer = true">
                  {{ $t('Se connecter') }}
                </v-btn>
              </div>
            </div>
          </div>
        </div>

        <div v-for="product in likedProducts" :key="product.id" class="col-4">
          <product-card :product="product" :show-like-button="false" />
        </div>
      </div>
    </section>
  </shop-layout>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useShop } from 'src/stores/shop'
import { useAuthentication } from 'src/stores/authentication'

import ProductCard from 'src/components/products/ProductCard.vue'

export default {
  name: 'WishlistPage',
  components: {
    ProductCard
  },
  setup () {
    const authenticationStore = useAuthentication()
    const { showLoginDrawer } = storeToRefs(authenticationStore)

    const shopStore = useShop()
    const { likedProducts } = storeToRefs(shopStore)
    
    return {
      authenticationStore,
      likedProducts,
      showLoginDrawer
    }
  }
}
</script>
