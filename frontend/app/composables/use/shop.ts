import { useErrorHandler } from '~/composables/errors'

import type { ExtendedRouteParamsRawGeneric, MaybeProduct, Product, ProductsApiResponse, ProductsQuery, ProductStockApiResponse } from '~/types'

/**
 * Composable for working with likes on the product
 * on a single product page 
 * @param product - The product to handle likes for
 */
export async function useLikeComposable(product: MaybeProduct, callback?: () => void) {
  if (import.meta.server) {
    return {
      isLiked: ref<boolean>(false),
      icon: ref<string>('i-fa7-regular:heart'),
      handleLike: (_product?: MaybeProduct): void => {}
    }
  }

  const currentProduct = toRef(product)
  const { likedProducts } = await useStorageSetup()

  const isLiked = useArrayIncludes(likedProducts, currentProduct.value?.id)
  console.log('isLiked', isLiked, likedProducts)
  // const uniqueIds = useArrayUnique(likedProducts)
  // // Ensures only unique IDs in the storage
  // syncRef(uniqueIds, likedProducts, { direction: 'ltr' })

  /**
   * Adds a product to the list of products
   * added to the user's whishlist
   */
  function like() {
    if (isDefined(currentProduct)) {
      if (isLiked.value) {
        likedProducts.value = likedProducts.value.filter(id => id !== currentProduct.value.id)
      } else {
        likedProducts.value.push(currentProduct.value.id)
      }

      if (callback) callback()
    }
  }

  const icon = computed(() => isLiked.value ? 'i-fa7-solid:heart' : 'i-fa7-regular:heart')

  return {
    icon,
    /**
     * Whether the product is liked by the user
     * @default false
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
export function useProductComposable<P extends Product | Ref<Product | null | undefined> | null | undefined>(product: P) {
  const currentProduct = ref<P>(product)

  if (!currentProduct) {
    return {
      hasImage: ref<boolean>(false),
      hasSizes: ref<boolean>(false),
      hasMainImage: ref<boolean>(false),
      numberOfImages: ref<number>(0),
      hasColorVariants: ref<boolean>(false)
    }
  }

  const hasImages = computed(() => currentProduct.value.images && currentProduct.value.images.length > 0)
  const hasSizes = computed(() => currentProduct.value.sizes && currentProduct.value.sizes.length > 0)
  const hasMainImage = computed(() => currentProduct.value.get_main_image && currentProduct.value.get_main_image.original)
  const numberOfImages = computed(() => hasImages ? currentProduct.value.images.length : 0)
  const hasColorVariants = computed(() => currentProduct.value.variants.length > 0)

  return {
    /**
     * Whether the product has color variants
     * @default false
     */
    hasColorVariants,
    /**
     * Number of images associated with the product
     * @default 0
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

  /**
   * Banner
   */

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
     * Whether the banner at the bottom of the page
     * should be show when the user scrolls down
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

  const currentProduct = toRef(product)

  if (!isDefined(currentProduct)) {
    throw new Error('Product is required for useProductStockComposable')
  }

  // const { $client } = useNuxtApp()

  const { customHandleError } = useErrorHandler()
  const stockState = ref<ProductStockApiResponse | null>(null)

  const { execute, data } = useFetch<ProductStockApiResponse>(`/api/v1/stocks/products/${currentProduct.value.id}`, {
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

/**
 * Composable that connects to the cart API
 * websocket and broadcasts cart updates when
 * other customers complete orders on a product
 */
export function useLiveUpdates() {}

/**
 * A composable that provides global functionnalities
 * on the products filtering modal 
 */
const [useProvideProductsFilteringModal, useProvideFilteringModalStore ] = createInjectionState(() => {
  const [showModal, toggle] = useToggle()

  /**
   * Filtering
   */

  const filteredProducts = ref<ProductsApiResponse[]>([])

  /**
   * Route parameters
   */

  const queryParams = useUrlSearchParams<ProductsQuery>('history', { removeNullishValues: true }) as Partial<ProductsQuery>

  const query = ref<ProductsQuery>({
    sorted_by: 'Nouveautés',
    typology: [],
    colors: [],
    sizes: [],
    price: null,
    offset: 0
  })

  const { last } = useDebouncedRefHistory(query, { deep: true })

  watch(query, (newQuery) => {
    queryParams.sorted_by = newQuery.sorted_by
    queryParams.typology = newQuery.typology
    queryParams.colors = newQuery.colors
    queryParams.sizes = newQuery.sizes
    queryParams.price = newQuery.price
  })

  /**
   * Function that resets the filters to their default values
   */
  function resetFilters() {
    query.value = {
      sorted_by: 'Nouveautés',
      typology: [],
      colors: [],
      sizes: [],
      price: null,
      offset: 0,
      limit: 100
    }
  }
  
  return {
    history: last,
    query,
    showModal,
    filteredProducts,
    resetFilters,
    toggleModal: toggle
  }
})

export { useProvideProductsFilteringModal, useProvideFilteringModalStore }
