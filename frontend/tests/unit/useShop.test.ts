import { createPinia } from 'pinia'
import { beforeAll, describe, expect, it } from 'vitest'
import { testProduct } from '~/data/__fixtures__'
import { useShop } from '~/stores/shop'

describe.concurrent('Use Shop Store', () => {
  beforeAll(() => {
    createPinia()
  })

  it('should respect default structure', () => {
    const store = useShop()

    expect(store.sessionCache).toBeUndefined()
    expect(store.showSearchModal).toBeFalsy()
    expect(store.showLanguageModal).toBeFalsy()
    expect(store.showWhatsAppModal).toBeFalsy()

    expect(store.visitedProducts).to.deep.equal([])
    expect(store.likedProducts).to.deep.equal([])
  
    expect(store.currentProductIndex).to.equal(0)

    expect(store.numberOfVisitedProducts).to.equal(0)
    expect(store.uniqueVisitedProductIds).to.deep.equal([])
  })

  it('should close all modals', () => {
    const store = useShop()
    store.showSearchModal = true
    store.showLanguageModal = true
    store.showWhatsAppModal = true

    store.closeAllModals()

    expect(store.showSearchModal).toBeFalsy()
    expect(store.showLanguageModal).toBeFalsy()
    expect(store.showWhatsAppModal).toBeFalsy()
  })

  it('should add product to track', () => {
    const store = useShop()

    store.trackProduct(testProduct)

    expect(store.visitedProducts).to.deep.equal([1])
  })
})
