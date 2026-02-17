import { describe, expect, it, vi } from 'vitest'
import { productFixture } from '~~/layers/base/data/__fixtures__'

mockNuxtImport('useCookie', () => {
  return (_name: string, _options?: object) => {
    return ref(null)
  }
})

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn()
}))

vi.mock('vuefire', () => {
  const vuefire = vi.importActual<typeof import('vuefire')>('vuefire')

  return {
    ...vuefire,
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

import { useCookie } from '#app'
import { useCartComposable } from '../../app/composables/use/cart/items'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useDocument } from 'vuefire'

describe('useCartComposable Nuxt', () => {
  it('should return default values on server', () => {
    const { 
      cart, 
      cartSession, 
      cartSessionId, 
      docRef, 
      isInitialized, 
      isSyncing,
      lastProduct,
      syncError,
      clearCart, 
      createItem, 
      reduceQuantity,
      removeProduct,
      freeDeliveryTarget 
    } = useCartComposable()

    expect(cart.value).toEqual([])
    expect(cartSession).toBeNull()
    expect(cartSessionId.value).toBe('')
    expect(docRef).toBeNull()
    expect(isInitialized.value).toBe(false)
    expect(isSyncing.value).toBe(false)
    expect(lastProduct.value).toBeNull()
    expect(syncError.value).toBeNull()
    expect(clearCart).toBeTypeOf('function')
    expect(createItem).toBeTypeOf('function')
    expect(reduceQuantity).toBeTypeOf('function') 
    expect(removeProduct).toBeTypeOf('function')
    expect(freeDeliveryTarget(30, 50).value).toBe(20)
  })

  it('should be able to create new item in cart', async () => {
    // Run in client-side mode
    vi.stubGlobal('process', { client: true })

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
