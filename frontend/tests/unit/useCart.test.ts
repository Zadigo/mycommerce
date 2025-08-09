import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { cartApiResponseFixture, productFixture } from '../../app/data/__fixtures__'
import { baseSessionCacheData } from '../../app/data/constants'
import { useCart } from '../../app/stores/cart'

vi.stubGlobal('fetch', vi.fn(() => ({
  json: () => Promise.resolve(cartApiResponseFixture),
  ok: true,
  status: 200
})))

describe('useCart', () => {
  let store: ReturnType<typeof useCart>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useCart()

    const { sessionCache } = storeToRefs(store)
    sessionCache.value = baseSessionCacheData
  })

  afterAll(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks
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

  // TODO: sessionCache.value.cart is undefined because of the
  // return mocked fetch not return the correct items
  it.fails('should add to cart', async () => {
    const { cartTotal, showSizeSelectionWarning, addingToCartState, sessionCache } = storeToRefs(store)

    sessionCache.value = baseSessionCacheData
    expect(addingToCartState.value).toBeFalsy()
    await store.addToCart(productFixture, 'M')
    
    expect(showSizeSelectionWarning.value).toBeFalsy()
    expect(sessionCache.value.cart.length).toBeGreaterThanOrEqual(1)
  })

  it('should get correct totals', () => {
    const { cartTotal, sessionCache, numberOfProducts } = storeToRefs(store)

    sessionCache.value.cart = cartApiResponseFixture
    expect(cartTotal.value).toEqual(12.79)
    expect(numberOfProducts.value).toEqual(1)
  })
})
