import type { ExtendedRouteParamsRawGeneric, Product, ProductsApiResponse, ProductsQuery } from '~/types'

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

export { useProvideFilteringModalStore, useProvideProductsFilteringModal }

