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
import type { ExtendedRouteParamsRawGeneric, Product } from '~/types'

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

const emit = defineEmits<{ 'has-navigated': [product: Product] }>()

// const { gtag } = useGtag()
const { $client } = useNuxtApp()
const { customHandleError } = useErrorHandler()
const { id } = useRoute().params as ExtendedRouteParamsRawGeneric
const shopStore = useShop()

const productsRow = ref<HTMLElement>()

function handleNavigation (data: (number | Product)[]) {
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
  const { data } = await useAsyncData<Product[]>(
    `recommendations-${id}`,
    async () => {
      return await $client('/api/v1/shop/products/recommendations', {
        params: {
          p: id,
          q: quantity
        } as FetchOptions,
        onRequestError({ error }) {
          customHandleError(error)
        }
      })
    }
  )

  const recommendations = computed(() => isDefined(data) ? data : [])
  provide('products', recommendations)
  
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
