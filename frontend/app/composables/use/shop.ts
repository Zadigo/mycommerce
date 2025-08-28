import { useArrayFindIndex, useStorage } from '@vueuse/core'

import type { ExtendedRouteParamsRawGeneric, Product, ProductStockApiResponse } from '~/types'

/**
 * Composable for working with likes on the product
 * on a single product page 
 */
export function useLikeComposable(product: Product | Ref<Product | undefined> | null | undefined) {
  if (import.meta.server) {
    return {
      isLiked: ref<boolean>(false),
      handleLike: (_product?: Product | null | undefined): void => {}
    }
  }
  
  const currentProduct = unref(product)
  const likedProducts = useStorage<number[]>('likedProducts', [])
  
  const isLiked = computed(() => {
    if (currentProduct) {
      return useArrayIncludes(likedProducts, currentProduct.id).value
    } else {
      return false
    }
  })

  /**
   * Adds a product to the list of products
   * added to the user's whishlist
   */
  function like() {
    if (currentProduct) {
      if (isLiked.value) {
        const index = useArrayFindIndex<number>(likedProducts, () => currentProduct.id)
        likedProducts.value.splice(index.value, 1)
      } else {
        likedProducts.value.push(currentProduct.id)
      }
      console.log('useLikeComposable', isLiked.value, likedProducts.value)
    }
  }

  return {
    /**
     * Whether the product is liked by the user
     */
    isLiked,
    /**
     * Function to handle liking a product.
     */
    like
  }
}

/**
 * Composable for checking if a product has images,
 * sizes, and a main image.
 * @param product - The product to check for images
 */
export function useProductComposable(product: Product | Ref<Product | null | undefined> | null | undefined) {
  const currentProduct = unref(product)

  if (!currentProduct) {
    return {
      hasImage: ref<boolean>(false),
      hasSizes: ref<boolean>(false),
      hasMainImage: ref<boolean>(false),
      numberOfImages: ref<number>(0),
      hasColorVariants: ref<boolean>(false)
    }
  }

  const hasImages = computed(() => currentProduct.images && currentProduct.images.length > 0)
  const hasSizes = computed(() => currentProduct.sizes && currentProduct.sizes.length > 0)
  const hasMainImage = computed(() => currentProduct.get_main_image && currentProduct.get_main_image.original)
  const numberOfImages = computed(() => hasImages ? currentProduct.images.length : 0)
  const hasColorVariants = computed(() => currentProduct.variants.length > 0)

  return {
    hasColorVariants,
    /**
     * Number of images associated with the product
     */
    numberOfImages,
    /**
     * Whether the product has images
     * @default false
     */
    hasImages,
    /**
     * Whether the product has sizes
     * @default false
     */
    hasSizes,
    /**
     * Whether the product has a main image
     * @default false
     */
    hasMainImage
  }
}

/**
 * Composable for fetching product details.
 * This composable fetches the product details from the API
 * and returns it as a reactive state.
 */
export async function useProductDetailComposable() {
  const { id } = useRoute().params as ExtendedRouteParamsRawGeneric

  const { data: product, status } = await useFetch<Product>(`/api/products/${id}`, {
    method: 'GET',
    immediate: true,
    server: true,
    onResponseError({ error }) {
      createError({
        statusMessage: error?.message,
        statusCode: 404
      })
    }
  })

  const isLoading = computed(() => status.value !== 'success')

  // Banner

  const showBanner = ref<boolean>(false)

  if (import.meta.client) {
    const { y } = useScroll(window)

    watch(y, (newY) => {
      showBanner.value = newY >= 1200 && newY <= 7000
    })
  }

  return {
    /**
     * Product data fetched from the API
     */
    product,
    /**
     * Whether the product is currently being loaded
     */
    isLoading,
    /**
     * Whether the banner should be shown based on scroll position
     */
    showBanner
  }
}

/**
 * Composable for fetching the stock state of a product.
 * This composable fetches the stock state of a product
 * from the API and returns it as a reactive state
 * @param product - The product to fetch the stock state for
 */
export function useProductStockComposable(product: Product | Ref<Product | undefined> | undefined, canRequest: Ref<boolean>) {
  if (import.meta.server) {
    return {
      stockState: ref<ProductStockApiResponse | null>(null)
    }
  }

  const currentProduct = unref(product)

  if (currentProduct === null || currentProduct === undefined) {
    throw new Error('Product is required for useProductStockComposable')
  }

  // const { $client } = useNuxtApp()

  const { customHandleError } = useErrorHandler()
  const stockState = ref<ProductStockApiResponse | null>(null)

  const { execute, data } = useFetch<ProductStockApiResponse>(`/api/v1/stocks/products/${currentProduct.id}`, {
    method: 'GET',
    baseURL: useRuntimeConfig().public.prodDomain,
    immediate: false,
    onResponseError({ error }) {
      customHandleError(error)
    }
  })

  whenever(canRequest, async (canRequestValue) => {
    await execute()
    if (data.value) {
      stockState.value = data.value
    }
  })

  // onMounted(async () => {
  //   delay(2000)

  //   const response = await $client<ProductStockApiResponse>(`/api/v1/stocks/products/${currentProduct.id}`, {
  //     method: 'GET',
  //     baseURL: useRuntimeConfig().public.prodDomain,
  //     onResponseError({ error }) {
  //       customHandleError(error)
  //     }
  //   })
  //   stockState.value = response
  // })

  return {
    /**
     * Stock state of the product
     */
    stockState
  }
}
