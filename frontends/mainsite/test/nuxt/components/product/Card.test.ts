import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Card from '../../../../../mainsite/app/components/product/card/Base.vue'
import Carousel from '../../../../../mainsite/app/components/product/card/Carousel.vue'
import Cart from '../../../../../mainsite/app/components/product/card/Cart.vue'
import { getProduct } from '../../../__mocks__'

vi.mock('../../../../layers/base/app/composables/use/product/utils', async (original) => {
  const actual = await original<typeof import('../../../../layers/base/app/composables/use/product/utils')>()
  return {
    ...actual,
    useLikeComposable: vi.fn(() => ({
      isLiked: false,
      icon: 'fa7-regular:heart',
      like: vi.fn()
    }))
  }
})

describe('Card component', () => {
  const testCases = [
    {
      title: 'should render correctly',
      props: {
        index: 1,
        product: getProduct(),
        showLikeButton: true,
        showCarousel: true,
        showCart: true,
        showPrices: true
      }
    }
  ]

  testCases.forEach(({ title, props }) => {
    it(title, async () => {
      const component = await mountSuspended(Card, { props })
      expect(component.exists()).toBe(true)

      const carouselEl = component.findComponent(Carousel)
      expect(carouselEl.exists()).toBe(true)
      
      const cartEl = component.findComponent(Cart)
      expect(cartEl.exists()).toBe(true)

      // Should not render the title if not hoverered
      const titleEl = component.find('h3')
      expect(titleEl.exists()).toBe(true)

      console.log(component.html())
    })
  })
})
