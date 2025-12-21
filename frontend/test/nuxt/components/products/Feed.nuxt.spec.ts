import { ProductsFeed, ProductsFeedHeader, ProductsIterator } from '#components'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { productFixture } from '~/data/__fixtures__'

const { mockUseFetch, mockUseRoute } = vi.hoisted(() => ({
  mockUseFetch: vi.fn(),
  mockUseRoute: vi.fn(() => ({
    params: { id: 'all' }
  }))
}))

mockNuxtImport('useFetch', () => mockUseFetch)
mockNuxtImport('useRoute', () => mockUseRoute)

describe('Products Feed Component', () => {
  afterAll(() => {
    vi.restoreAllMocks()
  })

  it.skip('should mount with required components and elements', async () => {
    mockUseFetch.mockResolvedValueOnce({
      data: { value: productFixture },
      error: ref(null),
      status: ref('success')
    })

    const component = await mountSuspended(ProductsFeed)
    
    const section = component.find('#feed-structure')
    expect(section.exists()).toBe(true)

    // If there are products, this section should be displayed
    // and "#link-collections-more" should not
    const paginationBlock = component.find('#product-pagination')
    expect(paginationBlock.exists()).toBe(true)
    
    const seeCollection = component.find('.link-collections-more')
    expect(seeCollection.exists()).toBe(false)

    const requiredComponents = [ProductsFeedHeader, ProductsIterator]
    // requiredComponents.forEach(item => {
    //   const result = component.getComponent(item)
    //   expect(result).toBeDefined()
    // })
  })

  it('should be able to load more products', async () => {
    mockUseFetch.mockResolvedValueOnce({
      data: { value: productFixture },
      error: ref(null),
      status: ref('success')
    })

    const component = await mountSuspended(ProductsFeed)

    expect(mockUseFetch).toHaveBeenCalledWith('/api/collections/all', {
      method: 'GET',
      query: { offset: 0 },
      onResponseError: ({ error }: { error: Error }) => error,
      transform: (data: productFixture) => data
    })

    const paginationBlock = component.find('#product-pagination')
    // const button = paginationBlock.find('button')
    console.log(component.html())
    console.log(paginationBlock)
  })
}, 10000)
