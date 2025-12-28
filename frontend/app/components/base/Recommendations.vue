<template>
  <div class="recommendations">
    <h2 class="text-2xl font-bold text-center mb-5">
      {{ $t(blockTitle) }}
    </h2>

    <div ref="productsRow" class="row">
      <products-iterator :columns="columns" :show-carousel="showCarousel" :show-like-button="showLikeButton" :show-cart="showCart" :show-prices="showPrices" @has-navigated="(index) => { selectProductEvent(index, 'Recommendations') }" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { productsSymbol } from '~/data'
import { baseProductGraph } from '~/data/constants/graphs';
import type { ExtendedRouteParamsRawGeneric, ProductNode, ProductRecommendations, Undefineable } from '~/types'

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

const { $client } = useNuxtApp()
const { customHandleError } = useErrorHandler()

const { id } = useRoute().params as ExtendedRouteParamsRawGeneric

const productsRow = ref<HTMLElement>()

const data = ref<Undefineable<ProductRecommendations>>()

try {
  data.value = await $client<ProductRecommendations>('/v1/graphql/', {
    method: 'post',
    body: {
      query: `
          query($name: String!, $quantity: Int!) {
            recommendations(productName: $name, quantity: $quantity) {
              ${baseProductGraph}
            }
          }
          `,
      variables: {
        name: 'Trapèze',
        quantity: quantity
      }
    },
    onRequestError({ error }) {
      customHandleError(error)
    }
  })

  provideLocal(productsSymbol, isDefined(data) ? data.value.data.recommendations.map(x => ({ node: x })) : [])
  
} catch (e) {
  console.error(e)
}

/**
 * Analytics
 */

const { selectProductEvent, viewProductsEvent } = useGoogleAnalyticsCallbacks(undefined, data.value?.data.recommendations.map(x => ({ node: x })))

onMounted(async () => {
  await viewProductsEvent('Recommendations')

  if (scrollable) {
    if (productsRow.value) {
      productsRow.value.classList.add('products-wrapper')
    }
  }
})
</script>
