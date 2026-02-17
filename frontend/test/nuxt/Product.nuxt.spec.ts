import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { productFixture } from '~~/layers/base/data/__fixtures__'

// Mock useProductDetailsComposable before import
vi.mock('../../app/composables/use/product/useProductDetailsComposable', () => ({
  useProductDetailsComposable: vi.fn().mockReturnValue({
    product: vi.fn().mockReturnValue(ref(productFixture)),
    isLoading: vi.fn().mockReturnValue(ref(false)),
    numberOfImages: vi.fn().mockReturnValue(ref(2)),
    hasColorVariants: vi.fn().mockReturnValue(ref(false))
  })
}))

import ProductPage from '../../app/pages/shop/[id].vue'


describe('Index Page', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
  })


  it('should render successfully', async () => {
    // Mock fetch or any other global functions if necessary
    const mockFetch = vi.fn().mockResolvedValue({
      recommendations: [
        productFixture
      ]
    })

    const { useProductDetailsComposable } = await import('../../app/composables/use/product')

    // useProductDetailsComposable.mockReturnValue({
    //   product: ref(productFixture),
    //   isLoading: ref(false),
    //   numberOfImages: computed(() => 2),
    //   hasColorVariants: computed(() => false)
    // })

    console.log('useProductDetailsComposable', useProductDetailsComposable())

    const el = await mountSuspended(ProductPage, {
      global: {
        mocks: {
          $fetch: mockFetch,
          provideLocal: vi.fn()
        }
      },
      stubs: {
        // Don't stub the async component - let it resolve
        'async-base-recommendation-block': false
      }
    })
    
    // await flushPromises()

    expect(el).toBeDefined()
  })
})
