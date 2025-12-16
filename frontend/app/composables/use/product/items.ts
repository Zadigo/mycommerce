import type { Product, SearchedProducts } from '~/types'
import type { ProductsQuery } from '~/types'

export function useProductsFilteringComposable() {
  const [showModal, toggle] = useToggle()

  /**
   * Filtering
   */

  const filteredProducts = ref<SearchedProducts>()

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
    showModal,
    history: last,
    query,
    filteredProducts,
    resetFilters,
    toggleModal: toggle
  }
}

/**
 * Composable to fetch products for a specific collection
 */
const [ useProductsComposable, _useProductsStore ] =  createInjectionState(async () => {
  const { id } = useRoute().params as { id: string}
  const { customHandleError } = useErrorHandler()

  const { data, status, error, execute: getProducts, refresh } = await useFetch<Product>(`/api/collections/${id}`, {
    method: 'GET',
    immediate: false,
    onResponseError({ error }) {
      // TODO: G-Analytics
      // gtag('event', 'exception', {
      //   fatal: true, 
      //   description: error?.message
      // })
      customHandleError(error)
    }
  })

  console.log('Products Fetch Status:', data.value)

  if (error.value) {
    throw createError({
      statusCode: 500,
      statusText: error.value.message
    })
  }

  const products = computed(() => isDefined(data) ? data.value.data.allProducts.edges : [])
  const totalProductCount = computed(() => products.value.length)
  const isLoading = computed(() => status.value === 'pending')
  const cursor = computed(() => data.value?.data.allProducts.pageInfo)

  /**
   * Other
   */

  const productsCount = computed(() => products.value.length)

  /**
   * Filtering
   */

  const { filteredProducts, resetFilters, toggleModal, showModal, query, history } = useProductsFilteringComposable()

  return {
    query,
    apiResponse: data,
    products,
    cursor,
    totalProductCount,
    isLoading,
    productsCount,
    filteredProducts,
    showModal,
    history,
    resetFilters,
    toggleModal,
    getProducts,
    refreshProducts: refresh
  }
})

export { useProductsComposable }

export function useProductsStore() {
  const counterStore = _useProductsStore()
  if (counterStore == null) throw new Error('Please call `useProductsStore` on the appropriate parent component')
  return counterStore
}
