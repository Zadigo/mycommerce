export {
  useProducts,
  useProductSearch,
  useProductsUpload,
  useApiProductSearch
} from './products'


export {
  useImagesComposable,
  useImageAssociation
} from './images'

/**
 * Composable used execute a search on API endpoints
 * @param endpoint - The API endpoint to query
 */
export async function useApiSearchEndpoint<T = Record<string, unknown> | Record<string, unknown>[]>(endpoint: string) {
  const search = ref<string>()

  const { data: searched, execute, status } = await useFetch(endpoint, {
    method: 'GET',
    baseURL: useRuntimeConfig().public.prodDomain,
    immediate: false,
    query: { q: search.value }
  })


  watchDebounced(search, async () => await execute(), { debounce: 2000 })

  const isLoading = computed(() => status.value === 'pending')

  return { search, searched: searched, isLoading }
}
