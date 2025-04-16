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
import type { Product } from '~/types';

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

const { $client } = useNuxtApp()
const { handleError } = useErrorHandler()
// const { gtag } = useGtag()

const { debounce } = useDebounce()
const route = useRoute()
const shopStore = useShop()

const recommendations = ref<Product[]>([])
const productsRow = ref<HTMLElement>()

function handleNavigation (data: (number | Product)[]) {
  if (data) {
    const product = data[1]
    
    shopStore.closeAllModals()
    
    if (product && typeof product === 'object' && 'id' in product) {
      emit('has-navigated', product)
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

async function requestRecommendations () {
  try {
    if (!props.loadCache) {
      const response = await $client.get<Product[]>('/api/v1/shop/products/recommendations', {
        params: {
          p: route.params.id,
          q: props.quantity
        }
      })

      recommendations.value = response.data

      if (shopStore.sessionCache) {
        shopStore.sessionCache.recommendations = response.data
      }
    } else {
      recommendations.value = shopStore.sessionCache.recommendations
    }
  } catch (e) {
    handleError(e)
  }
}

// TODO: Load the recommendations that we have
// already fetched when the block is loaded


// requestRecommendations()

onMounted(async () => {
  debounce(requestRecommendations, 3000, false)()

  if (props.scrollable) {
    if (productsRow.value) {
      productsRow.value.classList.add('products-wrapper')
    }
  }
})
</script>
