import type { BaseImage, ProductImage, SearchedImages } from '~/types'

export * from './uploads'
export * from './association'

export interface FileElement {
  name: string,
  content: File | Blob | null
}

export interface RequestData {
  files: FileElement[]
}

export interface ImageFilters {
  column: string
  operator: 'Equals' | 'Not equal'
  value: string
}

export function useImagesComposable() {
  const _images = computedAsync(async () => {
    return await $fetch<ProductImage>('/graphql/', {
      method: 'POST',
      body: {
        query: `
        query {
          allImages {
            id
            name
            original
            active
            isMainImage
            createdOn
          }
        }
        `
      }
    })
  })

  // const images = ref<ProductImage[]>(data)
  const images = computed(() => _images.value?.data.allImages || [])

  return {
    images
  }
}

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
