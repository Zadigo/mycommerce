import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Index from '~/pages/shop/collection/[id].vue'

vi.mock('~/components/products/Feed.vue', () => ({
  default: defineAsyncComponent({
    loader: async () => defineComponent({
      template: '<div id="feed">Feed</div>'
    })
  })
}))

vi.mock('~/components/modals/Filters.vue', () => ({
  default: defineComponent({
    template: '<volt-drawer id="filters" />'
  })
}))

describe.skip('collection > index page', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render correctly', async () => {
    const component = await mountSuspended(Index)
    console.log(component.html())
  })
})
