import { describe, expect, it, vi } from 'vitest'
import { productFixture } from '../../../layers/base/app/utils/__fixtures__'
import { useCookie } from '#imports'
import { useCartComposable } from '../../../layers/base/app/composables/use/cart'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import type { CookieOptions } from '#app'
import { useDocument, VueFire } from 'vuefire'

mockNuxtImport('useCookie', () => {
  return (_name: string, _options?: CookieOptions) => ref(null)
})

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn()
}))

vi.mock('vuefire', async (importActual: () => Promise<typeof import('vuefire')>) => {
  const actual = await importActual()

  return {
    ...actual,
    VueFire: vi.fn(() => ({})),
    useDocument: vi.fn(() => ({
      data: {
        value: {
          items: []
        }
      }
    })),
    useFirestore: vi.fn(() => ({}))
  }
})

vi.mock('@vueuse/core', async (importActual) => {
  const actual = await importActual<typeof import('@vueuse/core')>()

  return {
    ...actual,
    useThrottleFn: vi.fn((fn: Function) => fn),
    provideLocal: vi.fn()
  }
})

describe('useCartComposable', () => {
  it('should return default values', () => {
    const result = useCartComposable()

    expect(result).toBeDefined()

    expect(result.cart.value).toEqual([])
    expect(result.cartSession).toBeNull()
    expect(result.cartSessionId.value).toBe('')
    expect(result.docRef).toBeNull()
    expect(result.isInitialized.value).toBe(false)
    expect(result.isSyncing.value).toBe(false)
    expect(result.lastProduct.value).toBeNull()
    expect(result.syncError.value).toBeNull()
    
    expect(result.clearCart).toBeTypeOf('function')
    expect(result.createItem).toBeTypeOf('function')
    expect(result.reduceQuantity).toBeTypeOf('function') 
    expect(result.removeProduct).toBeTypeOf('function')
    expect(result.freeDeliveryTarget(30, 50).value).toBe(20)
  })

  it.todo('should create new item in cart', async () => {
    vi.stubGlobal('process', { client: true })

    // Mock the useDocument composable to return a cart session with one item
    vi.mocked(useDocument).mockReturnValueOnce({
      data: {
        value: {
          items: [
            {
              product: {
                id: 'prod_1',
                name: 'Test Product',
                price: 100,
                salePrice: 0,
                unitPrice: 100,
                mainImage: {
                  id: 'img_1',
                  name: 'image.jpg',
                  isMainImage: true,
                  variant: 'large',
                  original: 'https://example.com/image.jpg',
                  thumbnail: 'https://example.com/image_thumb.jpg',
                  createdOn: '2024-01-01T00:00:00Z',
                }
              },
              size: productFixture.node.sizeSet[0],
              quantity: 1,
              total: 0
            }
          ]
        }
      }
    } as any)

    const sessionId = useCookie('cartSessionId')
    sessionId.value = 'test-session-id'

    const { createItem, cart  } = useCartComposable()
    await createItem(productFixture, productFixture.node.sizeSet[9])

    console.log(cart.value)
    expect(cart.value.length).toBe(1)

    vi.unstubAllGlobals()
  })
})
