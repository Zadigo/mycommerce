<template>
  <section id="wishlist" class="mx-10 px-10 my-10">
    <div class="grid grid-cols-2">
      <div v-if="!isAuthenticated" class="w-full md:w-2/6">
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
import { productSymbol, useBusinessDetails } from '~/data'
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
const { sessionId } = useSession()

const { data } = useAsyncData(async () => {
  return $client<Product[]>('/api/v1/shop/wishlist', {
    method: 'POST',
    body: {
      session_id: sessionId?.value,
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

const { get } = await useBusinessDetails()

useSeoMeta({
  title: t('Liste de souhait'),
  description: t('Découvrez toutes notre collection de vêtements'),
  titleTemplate: `%s | ${get('legalName')}`,
  ogTitle: t('Liste de souhait'),
  ogDescription: t('Découvrez toutes notre collection de vêtements'),
  ogImage: '/images/group1/img1.jpeg',
  twitterTitle: t('Liste de souhait'),
  twitterDescription: t('Découvrez toutes notre collection de vêtements'),
  twitterImage: '/images/group1/img1.jpeg',
  twitterCard: 'summary_large_image',
  ogSiteName: get('legalName')
})

// useSchemaOrg(products.value.map(x => defineProduct({
//   "@type": 'Product',
//   "@id": `https://example.com/products/${x.node.slug}`,
//   name: x.node.name,
//   sku: x.node.sku,
//   image: x.node.productImages.map(image => image.original),
//   url: `https://example.com/products/${x.node.slug}`,
//   itemCondition: "https://schema.org/NewCondition",
//   brand: {
//     "@type": 'Brand',
//     name: get('legalName'),
//     logo: get('logo'),
//   },
//   offers: {
//     price: x.node.price,
//     priceCurrency: 'EUR',
//     availability: 'https://schema.org/InStock',
//     image: x.node.mainImage.original,
//     shippingDetails: {
//       "@type": 'OfferShippingDetails',
//       shippingDestination: [
//         { "@type": "DefinedRegion", addressCountry: 'FR' },
//         { "@type": "DefinedRegion", addressCountry: 'GP' }
//       ],
//       deliveryTime: null
//     }
//   }
// })))

defineOgImage({
  url: '/images/group1/img1.jpeg',
  width: 1200,
  height: 630,
  alt: t('Découvrez toutes notre collection de vêtements')
})
</script>
