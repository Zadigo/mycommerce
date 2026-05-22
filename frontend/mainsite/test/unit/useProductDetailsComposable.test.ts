import { vi, describe, it, expect, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

// Mock the useFetch composable
const mockUseFetch = vi.fn()
mockNuxtImport('useFetch', () => mockUseFetch)

// Mock useRoute if needed
mockNuxtImport('useRoute', () => {
  return () => ({
    params: { id: '123' }
  })
})

describe('useProductDetailsComposable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch and return product data', async () => {
    // Arrange: Mock the useFetch return value
    const mockProductData = {
      node: {
        id: '123',
        name: 'Test Product',
        productImages: [{ id: '1' }, { id: '2' }],
        colorVariants: [{ id: 'var1' }]
      }
    }

    mockUseFetch.mockResolvedValue({
      data: ref(mockProductData),
      status: ref('success'),
      error: ref(null),
      refresh: vi.fn(),
      execute: vi.fn()
    })

    // Act: Call your composable
    const { product, isLoading, numberOfImages, hasColorVariants } =
      await useProductDetailsComposable()

    // Assert
    expect(mockUseFetch).toHaveBeenCalledWith(
      '/api/products/123',
      expect.objectContaining({
        method: 'GET',
        immediate: true
      })
    )

    expect(product.value).toEqual(mockProductData)
    expect(isLoading.value).toBe(false)
    expect(numberOfImages.value).toBe(2)
    expect(hasColorVariants.value).toBe(true)
  })

  it('should handle loading state', async () => {
    mockUseFetch.mockResolvedValue({
      data: ref(null),
      status: ref('pending'),
      error: ref(null),
      refresh: vi.fn(),
      execute: vi.fn()
    })

    const { isLoading } = await useProductDetailsComposable()

    expect(isLoading.value).toBe(true)
  })

  it('should handle product without color variants', async () => {
    const mockProductData = {
      node: {
        productImages: [],
        colorVariants: []
      }
    }

    mockUseFetch.mockResolvedValue({
      data: ref(mockProductData),
      status: ref('success'),
      error: ref(null),
      refresh: vi.fn(),
      execute: vi.fn()
    })

    const { hasColorVariants, numberOfImages } = await useProductDetailsComposable()

    expect(hasColorVariants.value).toBe(false)
    expect(numberOfImages.value).toBe(0)
  })
})
