import type { SearchedProducts } from '~/types'
import { updateDoc } from 'firebase/firestore'

export const useSearchComposable = createGlobalState(() => {
  const search = shallowRef<string>('')
  const debouncedSearch = refDebounced(search, 2000)

  const { history, last } = useDebouncedRefHistory(debouncedSearch, { debounce: 5000 })
  const { docRef, session } = useSession()

  const _cache = ref<SearchedProducts>()

  const params = useUrlSearchParams('history') as { q?: string }

  watch(debouncedSearch, async (value) => {
    params.q = value

    /**
     * Fetch products
     */

    if (isDefined(debouncedSearch) && debouncedSearch.value !== "") {
      _cache.value = await $fetch<SearchedProducts>('/api/products/search', {
        method: 'GET',
        params: {
          name: debouncedSearch.value,
          offset: 20
        }
      })

      // try {
      //   const data = await $client<SearchedProducts>('/graphql/', {
      //     method: 'POST',
      //     body: {
      //       query: `
      //       query($name: String!) {
      //         searchProducts(name: $name, first: 20) {
      //           edges {
      //             node {
      //               ${baseProductGraph}
      //             }
      //           }
      //         }
      //       }`,
      //       variables: {
      //         name: debouncedSearch.value
      //       }
      //     },
      //     onRequestError({ error }) {
      //       customHandleError(error)
      //     }
      //   })

      //   _cache.value = data
      // } catch (error) {
      //   customHandleError(error)
      // }
    } else {
      _cache.value = undefined
    }

    /**
     * Analytics
     */

    // TODO: G-Analytics

    /**
     * Save search
     */

    const { customHandleError } = useErrorHandler()


    try {
      if (isDefined(session) && isDefined(docRef)) {
        await updateDoc(docRef, {
          searchHistory: history.value.map(item => ({
            term: item.snapshot,
            searchedOn: item.timestamp
          }))
        })
      }
    } catch (error) {
      customHandleError(error)
    }
  })

  const products = computed(() => isDefined(_cache) ? _cache.value.data.searchProducts.edges || [] : [])
  const canShowSearch = computed(() => products.value.length > 0)

  return {
    search,
    products,
    history,
    last,
    canShowSearch
  }
})
