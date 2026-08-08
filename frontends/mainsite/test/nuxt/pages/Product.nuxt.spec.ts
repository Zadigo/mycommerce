import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { productFixture } from '~~/layers/base/app/utils/__fixtures__'
import ProductPage from '../../../app/pages/shop/[id].vue'

const mockedUseProductDetailsComposable = vi.fn().mockResolvedValue({
  product: ref(productFixture),
  isLoading: ref(false),
  numberOfImages: ref(2),
  hasColorVariants: ref(false)
})

vi.mock('../../layers/base/app/composables/use/product', () => mockedUseProductDetailsComposable)

describe.only('Product Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })


  it('should render successfully', async () => {
    const component = await mountSuspended(ProductPage, {
      stubs: {
        // Don't stub the async component - let it resolve
        'async-base-recommendation-block': false
      }
    })
  
    expect(component).toBeDefined()
    
    const recommendationsEl = component.find('#recommendations')
    expect(recommendationsEl.exists()).toBe(true)
    // console.log(component.html())
  })
})
