import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import BaseRecommendations from '../../app/components/base/Recommendations.vue'
import { productFixture } from '../../layers/base/app/utils/__fixtures__'
import type { ProductRecommendations } from '../../app/types'

const fetchMock = vi.fn()
vi.stubGlobal('$fetch', () => fetchMock)

vi.mock('../../layers/base/app/composables/use/analytics', (importActual) => {
  const actual = importActual<typeof import('../../layers/base/app/composables/use/analytics')>('../../layers/base/app/composables/use/analytics')
  
  return {
    ...actual,
    useGoogleAnalyticsCallbacks: vi.fn(() => ({
      selectProductEvent: vi.fn(),
      viewProductsEvent: vi.fn()
    }))
  }
})

const recommendationsFixture: ProductRecommendations = {
  data: {
    recommendations: [
      productFixture.node
    ]
  }
}

describe.only('BaseRecommendations', () => {
  it('should render correctly', async () => {
    fetchMock.mockResolvedValueOnce(recommendationsFixture)

    const wrapper = await mountSuspended(BaseRecommendations, {
      global: {
        mocks: {
          $t: (key: string) => key,
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
