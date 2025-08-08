import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { baseSessionCacheData } from '../../app/data/constants'
import { cartApiResponseFixture, productFixture } from '../../app/data/__fixtures__'

const { mockNuxtClient, mockUseNuxtApp } = vi.hoisted(() => {
  const mockNuxtClient = vi.fn()
  const mockUseNuxtApp = vi.fn(() => ({
    $client: mockNuxtClient,
    vueApp: {}
  }))
  return {
    mockNuxtClient,
    mockUseNuxtApp
  }
})

vi.mock('nuxt/app', () => {
  return {
    useNuxtApp: mockUseNuxtApp
  }
})

vi.mock('#app', () => {
  return {
    useNuxtApp: mockUseNuxtApp
  }
})

vi.mock('#imports', () => {
  return {
    useNuxtApp: mockUseNuxtApp
  }
})

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')

  return {
    ...actual,
    useRefHistory: vi.fn().mockReturnValue({
      last: vi.fn(() => null),
      history: [],
      undo: vi.fn(),
      redo: vi.fn(),
      canUndo: false,
      canRedo: false
    })
  }
})

import { useCart } from '../../app/stores/cart'
import { useNuxtApp } from 'nuxt/app'

describe('useCart', () => {
  let store: ReturnType<typeof useCart>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useCart()
    mockNuxtClient.mockClear()
  })

  it('debug: check if mock is working', () => {
    // This should help identify if the mock is being applied
    
    const { $client } = useNuxtApp()
    expect(typeof $client).toBe('function')
    expect($client).toBe(mockNuxtClient)
  })
  
  it('should start with an empty cart', () => {
    const { hasProducts, numberOfProducts, cartTotal, freeDeliveryTarget } = storeToRefs(store)

    expect(hasProducts.value).toBeFalsy()
    expect(numberOfProducts.value).toEqual(0)
    expect(cartTotal.value).toEqual(0)
    expect(freeDeliveryTarget.value).toEqual(50)
  })

  it('should handle size selection', async () => {
    const { userSelection } = storeToRefs(store)

    store.handleSizeSelection(productFixture.id, 'M')
    expect(userSelection.value.size).toEqual('M')
  })

  it('should add to cart', async () => {
    const { cartTotal, showSizeSelectionWarning, addingToCartState, sessionCache } = storeToRefs(store)

    sessionCache.value = baseSessionCacheData
    const mockResponse = {
      status: 200,
      data: cartApiResponseFixture
    }
    mockNuxtClient.mockResolvedValue(mockResponse)
    await store.addToCart(productFixture, 'M')
    

    expect(mockNuxtClient).toHaveBeenCalledWith('/api/v1/cart/add', {
      method: 'GET',
      body: expect.any(Object),
      onResponse: expect.any(Function)
    })

    expect(showSizeSelectionWarning.value).toBeFalsy()
    expect(addingToCartState.value).toBeFalsy()
    expect(cartTotal.value).toEqual(12.79)
    console.log('sessionCache', sessionCache.value.cart)
  })
})
