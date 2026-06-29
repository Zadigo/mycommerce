import { describe, expect, it, vi } from 'vitest'
import { renderSuspended, mountSuspended } from '@nuxt/test-utils/runtime'
import { productFixture } from '../../layers/base/app/utils/__fixtures__'
import type { BaseProduct } from '../../app/types'

import ProductCardBase from '../../app/components/product/card/Base.vue'
import ProductCardCarousel from '../../app/components/product/card/Carousel.vue'
import ProductCardCart from '../../app/components/product/card/Cart.vue'

type Testcase = {
  title: string
  props: {
    index: number
    product: typeof productFixture
    showLikeButton: boolean
    showCarousel: boolean
    showCart: boolean
    showPrices: boolean
  }
}

vi.mock('../../layers/base/app/composables/use/product/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../layers/base/app/composables/use/product/utils')>()

  return {
    ...actual,
    useLikeComposable: vi.fn((_product: BaseProduct) => {
      return {
        isLiked: ref(false),
        icon: ref('fa7-regular:heart'),
        like: vi.fn()
      }
    })
  }
})

vi.mock('../../layers/base/app/composables/use/analytics', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../layers/base/app/composables/use/analytics')>()

  return {
    ...actual,
    useGoogleAnalyticsCallbacks: vi.fn((_product: BaseProduct) => {
      return {
        selectProductEvent: vi.fn()
      }
    })
  }
})

describe.only('ProductCardBase', () => {
  const testcases: Testcase[] = [
    {
      title: 'should render correctly with all features enabled',
      props: {
        index: 1,
        product: productFixture,
        showLikeButton: true,
        showCarousel: true,
        showCart: true,
        showPrices: true
      }
    }
  ]

  testcases.forEach((testcase) => {
    it(testcase.title, async () => {
      const wrapper = await mountSuspended(ProductCardBase, {
        props: testcase.props
      })
    
      if (testcase.props.showPrices) {
        const priceEl = wrapper.find('div#price')
        expect(priceEl).toBeDefined()

        // Link
        const link = priceEl.find('a[id^="link-"]')
        expect(link).toBeDefined()
        expect(link.attributes('href')).toBeDefined()
        expect(link.attributes('disabled')).toBeUndefined()

        // Product Title
        expect(wrapper.find('h3').text()).toBe(testcase.props.product.node.name)

        // Buttons
        const buttonEls = wrapper.findAll('button')
        buttonEls.forEach((buttonEl) => {
          expect(buttonEl.attributes('disabled')).toBeUndefined()
          expect(buttonEl.attributes('id')).toBeDefined()
          // expect(buttonEl.attributes('id')).toSatisfy((id) => id && id.startsWith('action-like'), "Button id should start with 'action-like'")
        })
      }

      // Check that carousel and cart component are rendered
      if (testcase.props.showCarousel) {
        const carouselEl = wrapper.findComponent(ProductCardCarousel)
        expect(carouselEl.exists()).toBe(true)
      }

      if (testcase.props.showCart) {
        const cartEl = wrapper.findComponent(ProductCardCart)
        expect(cartEl.exists()).toBe(true)
      }
    })
  })

  it.skip('should handle undefined in the product prop gracefully', async () => {
    const wrapper = await mountSuspended(ProductCardBase, {
      props: {
        index: 1,
        product: undefined,
        showLikeButton: true,
        showCarousel: true,
        showCart: true,
        showPrices: true
      }
    })

    // Check that the component still renders without throwing an error
    expect(wrapper.exists()).toBe(true)
  })
})
