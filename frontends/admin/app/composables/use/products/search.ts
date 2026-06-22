import type { Product, ProductNode, SearchedProducts } from '~/types'

export function usePassiveProductSearch(products: Ref<ProductNode[]>) {
  const search = ref<string>('')

  const searched = computed(() => {
    return products.value.filter((product) =>
      product.node.name.toLowerCase().includes(search.value.toLowerCase())
    )
  })

  return {
    search,
    searched
  }
}

/**
 * Composable that runs search directly on the Django API
 */
export function useProductSearch() {
  const search = ref<string>('')

  const { data, execute, status } = useFetch<SearchedProducts>('/graphql/', {
    method: 'POST',
    baseURL: useRuntimeConfig().public.prodDomain,
    immediate: false,
    body: {
      query: `
        query SearchProducts($name: String!) {
          searchProducts(name: $name) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      `,
      variables: {
        name: search.value
      }
    }
  })

  const searched = computed(() => data.value?.data.searchProducts.edges || [])
  const flattenedSearched = computed(() => searched.value.map((edge) => edge.node))

  watchDebounced(search, async () => await execute(), { debounce: 1000 })
  const isLoading = computed(() => status.value === 'pending')

  return {
    search,
    searched,
    flattenedSearched,
    isLoading
  }
}
