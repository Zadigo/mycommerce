<template>
  <section id="wishlist" class="mx-10 px-10 my-10">
    <div v-if="!authenticationStore.isAuthenticated" class="w-full md:w-2/6">
      <TailCard class="shadow-sm border-0">
        <TailCardContent class="text-center p-5 flex flex-col justify-center">
          <div class="information">
            <Icon name="fa-solid:star" class="text-warning mb-4" size="120" />
            
            <h1 class="font-bold mt-4 mb-3 text-3xl">
              {{ $t('Conservation des favoris') }}
            </h1>

            <p class="font-light">
              {{ $t('Keep favorites text') }}
            </p>

            <TailButton id="action-start-login" class="mt-10" @click="showLoginDrawer=true">
              <Icon name="fa-solid:right-to-bracket" class="me-2" />
              {{ $t('Se connecter') }}
            </TailButton>
          </div>
        </TailCardContent>
      </TailCard>
    </div>

    <div v-if="likedProducts.length > 0">
      <!-- TODO: Analytics to track product click from wishlist @has-navigated -->
      <ProductsIterator v-if="products" :products="products" />
    </div>
  </section>
</template>

<script setup lang="ts">
// import { useStorage } from '@vueuse/core'
import type { Product } from '~/types'


const { t } = useI18n()
const { $client } = useNuxtApp()
const { handleError } = useErrorHandler()
const shopStore = useShop()
const authenticationStore = useAuthentication()

// const likedProducts = useStorage('likedProducts', [])
const { likedProducts } = storeToRefs(shopStore)
const { showLoginDrawer } = storeToRefs(authenticationStore)

/**
 * 
 */
const { data: products } = useAsyncData(async () => {
  return $client<Product[]>('/api/v1/shop/wishlist', {
    method: 'POST',
    body: {
      session_id: shopStore.sessionCache.sessionId,
      products: likedProducts.value
    },
    onRequestError({ error }) {
      handleError(error)
    }
  })
}, {
  lazy: true,
  server: false
})


useHead({
  title: t('Liste de souhait'),
  meta: [
    {
      key: 'description',
      content: t('Tout les produits que vous avez aimé')
    }
  ]
})

// const response = await $client<Product[]>('/api/v1/shop/wishlist', {
//   method: 'POST',
//   body: {
//     session_id: shopStore.sessionCache.sessionId,
//     products: likedProducts.value
//   },
//   onRequestError({ error }) {
//     handleError(error)
//   }
// })
// products.value = response

// onBeforeMount(requestLikedProducts)
</script>
