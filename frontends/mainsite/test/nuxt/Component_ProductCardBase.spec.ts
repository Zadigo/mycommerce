import { describe, it, vi } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { productFixture } from '../../layers/base/app/utils/__fixtures__'
import type { BaseProduct } from '../../app/types'

vi.mock('#imports', (importOriginal) => {
  return {
    ...importOriginal(),
    useGoogleAnalyticsCallbacks: vi.fn((_product: BaseProduct) => {
      return {
        selectProductEvent: vi.fn()
      }
    }),
    useLikeComposable: vi.fn(() => {
      return {
        like: vi.fn(),
        isLiked: ref(false),
        icon: ref(''),
      } 
    })
  }
})

import ProductCardBase from '../../app/components/product/card/Base.vue'

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

describe('ProductCardBase', () => {

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
      const wrapper = await renderSuspended(ProductCardBase, {
        props: testcase.props
      })

      console.log(wrapper.html())
    })
  })
})
