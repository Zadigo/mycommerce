<template>
  <products-feed-layout>
    <!-- Filters -->
    <template #filtering>
      <products-feed-header :count="productsCount" @modal:productFilters="emit('modal:product-filters')" />
    </template>

    <!-- Products -->
    <template v-if="productsCount > 0" #default>
      <products-iterator :columns="currentGridSize" />
    </template>

    <template v-else #default>
      <div class="mx-auto text-center font-light text-2xl max-w-3xl p-10 my-10">
        <p class="font-light">
          {{ $t('Page not available text') }}
        </p>

        <volt-button size="lg">
          <nuxt-link-locale id="link-collections-more" to="/shop/collection/all" @click="query.offset=0">
            {{ $t('Voir toute la collection') }}
          </nuxt-link-locale>
        </volt-button>
      </div>
    </template>

    <!-- Intersect -->
    <template #intersect>
      <client-only>
        <div v-if="productsCount > 0" id="product-pagination" ref="intersectionTarget" class="font-bold text-uppercase flex justify-center mt-5">
          <volt-button v-if="isEndOfPage" id="scroll-top" size="lg" @click="scrollToTop">
            <Icon name="i-fa7-solid:arrow-up" class="me-2" />
            {{ $t('Tu es arrivé à la fin') }}
          </volt-button>

          <div v-else class="grow">
            <p v-if="isLoadingMoreProducts">Loading...</p>

            <volt-button v-else id="load-more" size="lg">
              <Icon name="arrow-down" class="me-2" />
              {{ $t('Voir plus de produits') }}
            </volt-button>
          </div>
        </div>
      </client-only>
    </template>
  </products-feed-layout>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { useHandleGridSize } from '~/composables/use/grid'
import { productsSymbol } from '~~/layers/base/app/data/constants/symbols'
import type { Product } from '~/types'

const emit = defineEmits<{ 'products:list': [products: Product[]], 'modal:product-filters': [] }>()

/**
 * Products
 */

const { products, isLoading, productsCount, cursor, query, getProducts } = await useProductsComposable()
await getProducts()

provide('productsLoading', isLoading)
provide(productsSymbol, products)

/**
 * Analytics
 */

const { viewProductsEvent } = useGoogleAnalyticsCallbacks(undefined, products.value)

onMounted(async () => { await viewProductsEvent() })

/**
 * Grid
 */

const { currentGridSize } = useHandleGridSize()

/**
 * Intersection
 */

const isLoadingMoreProducts = ref<boolean>(false)
const intersectionTarget = ref<HTMLElement | null>(null)

/**
 * Scrolling
 */

if (import.meta.client) {
  useIntersectionObserver(intersectionTarget, ([ { isIntersecting }]) => {
    if (isIntersecting && isDefined(products)) {
      isLoadingMoreProducts.value = true
      
      // if (isDefined(apiResponse)) {
      //   query.value.offset = apiResponse.value.next
      //   refreshProducts()
      // } else {
      //   console.error('Intersection does not have a next page')
      // }

      isLoadingMoreProducts.value = false
    }
  }, {})
}

/**
 * Other
 */

const isEndOfPage = computed(() => isDefined(cursor) && cursor.value.hasNextPage === false)
</script>
