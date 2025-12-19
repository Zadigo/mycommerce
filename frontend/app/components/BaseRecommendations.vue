<template>
  <div class="recommendations">
    <h2 class="text-2xl font-bold text-center mb-5">
      {{ $t(blockTitle) }}
    </h2>

    <div ref="productsRow" class="row">
      <products-iterator :columns="columns" :show-carousel="showCarousel" :show-like-button="showLikeButton" :show-cart="showCart" :show-prices="showPrices" @has-navigated="handleNavigation" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { productsSymbol } from '~/data'
import type { ExtendedRouteParamsRawGeneric, ProductNode, ProductRecommendations } from '~/types'

interface FetchOptions {
  /**
   * The product's ID used for the Fuzzy
   * matcher in Django
   */
  p: string | number
  /**
   * The amount of products to get 
   */
  q: number
}

const {
  blockTitle = "Cela peut t'intéresser",
  quantity = 20,
  scrollable,
  columns = 3,
  showLikeButton,
  showCarousel = true,
  showCart = true,
  showPrices = true,
  loadCache
} = defineProps<{
  blockTitle?: string
  quantity?: number
  scrollable?: boolean
  columns?: number
  showLikeButton?: boolean
  showCarousel?: boolean
  showCart?: boolean
  showPrices?: boolean
  loadCache?: boolean
}>()

const emit = defineEmits<{ 'has-navigated': [product: ProductNode] }>()

// const { gtag } = useGtag()
const { $client } = useNuxtApp()
const { customHandleError } = useErrorHandler()
const { id } = useRoute().params as ExtendedRouteParamsRawGeneric
const shopStore = useShop()

const productsRow = ref<HTMLElement>()

function handleNavigation (data: (number | ProductNode)[]) {
  if (data) {
    const product = data[1]
    
    shopStore.closeAllModals()
    
    if (product && typeof product === 'object' && 'id' in product) {
      emit('has-navigated', product)

      // TODO: G-Analytics
      // gtag('event',  'select_item',  {
      //   items: [
      //     {
      //       item_id: product.id,
      //       item_name: product.name,
      //       price: product.get_price,
      //       item_brand: null,
      //       item_category: product.category,
      //       index: data[0]
      //     }
      //   ],
      //   item_list_name: 'recommendations',
      //   item_list_id: 'recommendations',
      //   currency: 'EUR'
      // })
    }
  }
}

try {
  const { data } = await useAsyncData<ProductRecommendations>(
    `recommendations-${id}`,
    async () => {
      return await $client('/v1/graphql/', {
        method: 'post',
        body: {
          query: `
            query {
              recommendations(productName: "Trapèze", quantity: ${quantity}) {
                id
                name
                price
                salePrice
                unitPrice
                mainImage {
                  id
                  name
                  original
                  thumbnail
                }
                productImages {
                  id
                  name
                  original
                  isMainImage
                }
              }
            }
        `
        },
        onRequestError({ error }) {
          customHandleError(error)
        }
      })
    }
  )

  provideLocal(productsSymbol, isDefined(data) ? data.value.data.recommendations.map(x => ({ node: x })) : [])
  
  onMounted(async () => {
    if (scrollable) {
      if (productsRow.value) {
        productsRow.value.classList.add('products-wrapper')
      }
    }
  })
} catch (e) {
  // Ignore errors
}
</script>
