import { describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { productFixture } from '~/data/__fixtures__'
import ProductPage from '../../../../app/pages/shop/[id].vue'

// vi.mock('#app', async () => {
//   const actual = await vi.importActual<typeof import('#app')>('#app')

//   return {
//     ...actual,
//     useFetch: vi.fn(() => ({
//       data: { value: productFixture },
//       error: ref(null),
//       status: ref('success'),
//       pending: ref(false)
//     }))
//   }
// })

describe.skip('Product page', () => {
  it('should render correctly', () => {
    const wrapper = mountSuspended(ProductPage)
  })
})
