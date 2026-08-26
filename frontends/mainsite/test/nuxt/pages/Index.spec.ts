import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'

import Index from '~/pages/index.vue'

import type { ProductCollection } from '~/types'

vi.mock('~/components/base/collection/Card.vue', () => ({
  default: defineComponent({
    template: '<div class="mocked-collection-card"></div>'
  })
}))

// mockNuxtImport<typeof useI18n>('useI18n', original => vi.fn(original).mockImplementation(() => ({
//   t: (key: string) => key
// })))

mockNuxtImport('useFetch', original => vi.fn(original).mockImplementation(() => ({
  data: ref<ProductCollection>({
    data: {
      allCollections: [
        {
          illustration: undefined,
          category: 'category1',
          createdOn: '2023-01-01',
          description: 'Description 1',
          name: 'Collection 1',
          numberOfItems: 10,
          slug: 'collection-1',
          subCategory: 'subCategory1',
          subcategorySlug: 'sub-category-1',
          tags: [ 'tag1', 'tag2' ],
          viewName: 'View Name 1'
        }
      ]
    }
  })
})))

describe('Index Page', () => {
  // beforeAll(async () => {
  //   vi.stubEnv('MODE', 'test')
  // })

  // afterAll(() => {
  //   vi.unstubAllEnvs()
  // })

  it('should render correctly', async () => {
    const component = await mountSuspended(Index)
    console.log(component.html())

    // Title
    expect(component.find('h1')).toBeDefined()

    // Section
    expect(component.find('section')).toBeDefined()
    expect(component.html()).toContain('id="collections"')

    // Image
    expect(component.find('img')).toBeDefined()

    // Link
    // expect(component.find('a').exists()).toBe(true)
    // expect(component.find('a').attributes('href')).toBe('/shop/collection/all')
    // expect(component.find('a').attributes('disabled')).toBeUndefined()

  })
})
