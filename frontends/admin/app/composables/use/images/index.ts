import type { BaseImage, ProductImage } from '~/types'

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
