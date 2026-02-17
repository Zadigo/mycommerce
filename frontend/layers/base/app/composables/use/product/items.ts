import type { LocationProductsQuery, Product, SearchedProducts, SelectedFilters } from '~/types'

/**
 * Function that adds filtering capabilities to the products composable
 * @private
 */
function _useProductsFilteringComposable() {
  const [showModal, toggle] = useToggle()

  /**
   * Filtering
   */

  const filteredProducts = ref<SearchedProducts>()

  /**
   * Route parameters
   */

  const queryParams = useUrlSearchParams<LocationProductsQuery>('history', { removeNullishValues: true })

  const query = ref<SelectedFilters>({
    sorted_by: 'Nouveautés',
    typology: [],
    colors: [],
    sizes: [],
    price: null,
    limit: 100,
    offset: 0
  })

  const { last } = useDebouncedRefHistory(query, { deep: true })

  watch(query, (newQuery) => {
    queryParams.sorted_by = newQuery.sorted_by
    queryParams.typology = newQuery.typology.join(',')
    queryParams.colors = newQuery.colors.join(',')
    queryParams.sizes = newQuery.sizes.join(',')
    queryParams.price = newQuery.price
  }, {
    deep: true
  })
  
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
    /**
     * Function that resets the filters to their default values
     */
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

  const _products = ref<Product>()
  const products = computed(() => _products.value?.data.allProducts.edges || [])

  async function getProducts() {
    _products.value = await $fetch<Product>(`/api/collections/${id}`, {
      method: 'GET',
      onResponseError({ error }) {
        customHandleError(error)
      }
    })
  }

  /**
   * Other
  */
 
  const isLoading = computed(() => !isDefined(_products))
  const cursor = computed(() => _products.value?.data.allProducts.pageInfo)
  const productsCount = computed(() => products.value.length)

  /**
   * Filtering
   */

  const { filteredProducts, showModal, query, history, resetFilters, toggleModal } = _useProductsFilteringComposable()

  return {
    query,
    products,
    cursor,
    isLoading,
    productsCount,
    filteredProducts,
    showModal,
    history,
    resetFilters,
    toggleModal,
    getProducts
  }
})

export { useProductsComposable }

export function useProductsStore() {
  const counterStore = _useProductsStore()
  if (counterStore == null) throw new Error('Please call `useProductsStore` on the appropriate parent component')
  return counterStore
}
