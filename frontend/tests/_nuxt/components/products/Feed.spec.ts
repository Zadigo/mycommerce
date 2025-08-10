import { ProductsFeed, ProductsFeedHeader, ProductsIterator } from '#components'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { productFixture } from '~/data/__fixtures__'

vi.mock('#app', async () => {
  const actual = await vi.importActual<typeof import('#app')>('#app')

  return {
    ...actual,
    useRoute: vi.fn(() => ({ params: { id: 'all' } })),
    useFetch: vi.fn(() => ({
      data: { value: productFixture },
      error: ref(null),
      status: ref('success'),
      pending: ref(false)
    }))
  }
})

describe('Products Feed Component', () => {
  it('should mount with required components', async () => {
    const component = await mountSuspended(ProductsFeed)
    const requiredComponents = [ProductsFeedHeader, ProductsIterator]
    
    requiredComponents.forEach(item => {
      const result = component.getComponent(item)
      expect(result).toBeDefined()
    })
  })
}, 50000)
