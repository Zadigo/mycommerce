<template>
  <div :data-count="quantity" class="recommendations">
    <h2 class="text-2xl font-bold text-center mb-5">
      {{ $t(blockTitle) }}
    </h2>

    <div ref="productsRow" class="row">
      <ProductsIterator :products="recommendations" :columns="columns" :show-carousel="showCarousel" :show-like-button="showLikeButton" :show-cart="showCart" :show-prices="showPrices" @has-navigated="handleNavigation" />
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

const props = defineProps({
  blockTitle: {
    type: String,
    default: "Cela peut t'intéresser"
  },
  quantity: {
    type: Number,
    default: 20
  },
  scrollable: {
    type: Boolean
  },
  columns: {
    type: Number,
    default: 3
  },
  showLikeButton: {
    type: Boolean,
    default: false
  },
  showCarousel: {
    type: Boolean,
    default: true
  },
  showCart: {
    type: Boolean,
    default: true
  },
  showPrices: {
    type: Boolean,
    default: true
  },
  loadCache: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits({
  'has-navigated'(_product: Product) {
    return true
  }
})

// const { gtag } = useGtag()
const { $client } = useNuxtApp()
const { handleError } = useErrorHandler()
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

const { data: recommendations } = await useAsyncData<Product[]>(
  `recommendations-${id}`,
  async () => {
    return await $client('/api/v1/shop/products/recommendations', {
      params: {
        p: id,
        q: props.quantity
      } as FetchOptions,
      onRequestError({ error }) {
        handleError(error)
      }
    })
  }
)

onMounted(async () => {
  if (props.scrollable) {
    if (productsRow.value) {
      productsRow.value.classList.add('products-wrapper')
    }
  }
})
</script>
