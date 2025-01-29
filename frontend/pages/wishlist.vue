<template>
  <section id="wishlist" class="container mb-5" style="margin-top:58px;">
    <div class="row g-2">
      <div v-if="!authenticationStore.isAuthenticated" class="col-sm-12 col-md-4">
        <div class="card shadow-sm" style="height: 557px;">
          <div class="card-body text-center p-5 d-flex flex-column justify-content-center">
            <div class="information">
              <font-awesome-icon icon="star" class="text-warning mb-4" size="4x" />
              
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

      <div v-if="likedProducts.length > 0">
        <!-- TODO: Analytics to track product click from wishlist @has-navigated -->
        <ProductsIterator :products="products" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core'
import type { Product } from '~/types'

useHead({
  title: 'Wishlist',
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})

const shopStore = useShop()
const { likedProducts } = storeToRefs(shopStore)

const authenticationStore = useAuthentication()
const { showLoginDrawer } = storeToRefs(authenticationStore)

const { handleError } = useErrorHandler()

function useWhishlistProducts () {
  const { $client } = useNuxtApp()
  const products = ref<Product[]>([])
  const likedProducts = useLocalStorage('likedProducts', null, {
    serializer: {
      read (raw) {
        return JSON.parse(raw)
      },
      write (value) {
        return JSON.stringify(value) 
      },
    }
  })

  async function requestLikedProducts () {
    try {
      const response = await $client.post<Product[]>('products', {
        products: likedProducts.value
      })
      products.value = response.data
    } catch (e) {
      handleError(e)
    }
  }

  return {
    requestLikedProducts,
    products
  }
}

const { products, requestLikedProducts } = useWhishlistProducts()

onBeforeMount(requestLikedProducts)
</script>
