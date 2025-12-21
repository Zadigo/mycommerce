import { createPinia, setActivePinia } from 'pinia'
import { beforeAll, describe, expect, it } from 'vitest'
import { productFixture } from '~/data/__fixtures__'
import { useShop } from '~/stores/shop'

describe.concurrent.skip('Use Shop Store', () => {
  let store: ReturnType<typeof useShop>

  beforeAll(() => {
    setActivePinia(createPinia())
    store = useShop()
  })

  it('should respect default structure', () => {
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

    store.trackProduct(productFixture)

    expect(store.visitedProducts).to.deep.equal([1])
    expect(store.numberOfVisitedProducts).to.equal(1)
  })
})
