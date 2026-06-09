import type { SearchedImages } from '~/types'

export * from './products'
export * from './images'

/**
 * Composable used execute a search on API endpoints
 * @param endpoint - The API endpoint to query
 */
export async function useSearchImagesComposable() {
  const search = ref<string>('')

  const { data: _searched, execute, status } = await useFetch<SearchedImages>('/graphql/', {
    method: 'POST',
    baseURL: useRuntimeConfig().public.prodDomain,
    immediate: false,
    body: {
      query: `
      query SearchImages($name: String!) {
        searchImages(name: $name) {
          id
          name
          original
          active
          createdOn
        }
      }
      `,
      variables: {
        name: search.value
      }
    }
  })

  watchDebounced(search, async () => await execute(), { debounce: 2000, immediate: true })
  const searched = computed(() => _searched.value?.data.searchImages ?? [])

  const isLoading = computed(() => status.value === 'pending')

  return { search, searched, isLoading }
}
