import type { ProductsApiResponse, ProductsQuery } from '~/types'

/**
 * Composable to fetch products for a specific collection
 */
export async function useProductsComposable() {
  const { id } = useRoute().params
  const query = ref<Partial<ProductsQuery>>({ offset: 0 })
  const { customHandleError } = useErrorHandler()

  const { data, status, error, refresh } = await useFetch<ProductsApiResponse>(`/api/collections/${id}`, {
    method: 'GET',
    query: query.value,
    onResponseError({ error }) {
      // TODO: G-Analytics
      // gtag('event', 'exception', {
      //   fatal: true, 
      //   description: error?.message
      // })
      customHandleError(error)
    }
  })

  if (error.value) {
    throw createError({
      statusCode: 500,
      statusText: error.value.message
    })
  }

  const products = computed(() => isDefined(data.value) ? data.value.results : [])
  const totalProductCount = computed(() => products.value.length)
  const isLoading = computed(() => status.value === 'pending')

  return {
    query,
    apiResponse: data,
    products,
    totalProductCount,
    isLoading,
    refreshProducts: refresh
  }
}
