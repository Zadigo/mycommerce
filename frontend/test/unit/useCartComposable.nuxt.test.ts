import { describe, it, expect, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import type { ProductNode } from '~/types'
import { productFixture } from '~/data/__fixtures__'

mockNuxtImport('useCookie', () => {
  return (name: string, options?: any) => ref(options?.default?.() ?? '')
})

import { useCartComposable } from '../../app/composables/use/cart'

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

describe('useCartComposable', () => {
  it('should initialize with default values', () => {
    const {
      cart,
      cartSession,
      cartSessionId,
      lastProduct,
      createItem,
      reduceQuantity,
      removeProduct
    } = useCartComposable()

    expect(cart.value).toBeTypeOf('object')

    expect(Array.isArray(cart.value)).toBe(true)
    if (Array.isArray(cart.value)) {
      expect(cart.value.length).toBe(0)
    }

    expect(createItem).toBeTypeOf('function')
    expect(removeProduct).toBeTypeOf('function')
    expect(reduceQuantity).toBeTypeOf('function')
  })

  it('should have cartSessionId as a ref string', () => {
    const { cartSessionId } = useCartComposable()
    expect(cartSessionId).toBeTypeOf('object')
    expect(cartSessionId.value).toBe('')
  })

  it('should have lastProduct as null initially', () => {
    const { lastProduct } = useCartComposable()
    expect(lastProduct).toBeTypeOf('object')
    expect(lastProduct.value).toBeNull()
  })

  it('should create new item in cart', async () => {
    const { createItem, cart } = useCartComposable()

    const mockProduct: ProductNode = productFixture

    await createItem(mockProduct, mockProduct.node.sizeSet[0])

    expect(cart.value.length).toBe(1)
    
    // expect(Array.isArray(cart.value)).toBe(true)
    // if (Array.isArray(cart.value)) {
    //   expect(cart.value.length).toBe(1)
    //   expect(cart.value[0].product.id).toBe('prod_1')
    //   expect(cart.value[0].size.id).toBe('size_1')
    //   expect(cart.value[0].quantity).toBe(1)
    //   expect(cart.value[0].total).toBe(0)
    // }
  })
})
