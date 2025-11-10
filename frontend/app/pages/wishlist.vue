<template>
  <section id="wishlist" class="mx-10 px-10 my-10">
    <div class="grid grid-cols-2">
      <div class="w-full md:w-2/6">
        <volt-card class="shadow-sm border-0">
          <template #content>
            <div class="text-center p-5 flex flex-col justify-center">
              <div class="information">
                <icon name="i-fa7-solid:star" class="text-yellow-300 mb-4" size="120" />
    
                <h1 class="font-bold mt-4 mb-3 text-3xl">
                  {{ $t('Conservation des favoris') }}
                </h1>
    
                <p class="font-light">
                  {{ $t('Keep favorites text') }}
                </p>
    
                <volt-button id="action-start-login" class="mt-10" @click="showLoginDrawer=true">
                  <icon name="i-fa7-solid:right-to-bracket" class="me-2" />
                  {{ $t('Se connecter') }}
                </volt-button>
              </div>
            </div>
          </template>
        </volt-card>
      </div>

      <!-- TODO: Analytics to track product click from wishlist @has-navigated -->
      <products-iterator :quantity="2" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { productSymbol } from '~/data'
import type { Product } from '~/types'

const { t } = useI18n()
const { customHandleError } = useErrorHandler()

const showLoginDrawer = useState('showLoginDrawer')
const { isAuthenticated } = useUser()

const likeProductsIds = useLocalStorage<number[]>('likedProducts', [])

/**
 * Fetch products from wishlist
 */

const { $client } = useNuxtApp()
const { djangoSessionId } = await useStorageSetup()

const { data } = useAsyncData(async () => {
  return $client<Product[]>('/api/v1/shop/wishlist', {
    method: 'POST',
    body: {
      session_id: djangoSessionId?.value,
      products: likeProductsIds.value
    },
    onRequestError({ error }) {
      customHandleError(error)
    }
  })
}, {
  lazy: true,
  server: false
})

/**
 * Products
 */

const products = computed(() => data.value || [])

provide(productSymbol, products)

/**
 * SEO
 */

useHead({
  title: t('Liste de souhait'),
  meta: [
    {
      key: 'description',
      content: t('Tout les produits que vous avez aimé')
    }
  ]
})
</script>
