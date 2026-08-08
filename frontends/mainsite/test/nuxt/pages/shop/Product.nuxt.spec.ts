import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getProduct } from '~~/test/__fixtures__'
import ProductPage from '~/pages/shop/[id].vue'

// const mockedUseProductDetailsComposable = vi.fn().mockResolvedValue({
//   product: ref(getProduct()),
//   isLoading: ref(false),
//   numberOfImages: ref(2),
//   hasColorVariants: ref(false)
// })

// vi.mock('../../layers/base/app/composables/use/product', () => mockedUseProductDetailsComposable)

// describe.skip('Product Page', () => {
//   beforeEach(() => {
//     vi.clearAllMocks()
//   })


//   it('should render successfully', async () => {
//     const component = await mountSuspended(ProductPage, {
//       stubs: {
//         // Don't stub the async component - let it resolve
//         'async-base-recommendation-block': false
//       }
//     })
  
//     expect(component).toBeDefined()
    
//     const recommendationsEl = component.find('#recommendations')
//     expect(recommendationsEl.exists()).toBe(true)
//     // console.log(component.html())
//   })
// })

vi.mock('~/components/product/page/aside/base.vue', () => ({
  default: defineComponent({
    template: '<aside id="product-aside">Product Aside</aside>'
  })
}))

describe.skip('pages > shop > product', () => {
  beforeEach(() => {
    // Render in client mode to ensure that the async component is resolved
    vi.stubEnv('NUXT_RENDER_MODE', 'client')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render successfully', async () => {
    const component = await mountSuspended(ProductPage)
    console.log(component.html())
  })
})
