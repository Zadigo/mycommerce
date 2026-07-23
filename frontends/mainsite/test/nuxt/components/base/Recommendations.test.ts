import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, vi } from 'vitest'
import Recommendations from '~/components/base/Recommendations.vue'
import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack/types'
import { getRecommendations } from '../../../__mocks__'

const mockFetch = vi.fn((url: NitroFetchRequest, _options: NitroFetchOptions<NitroFetchRequest>) => {
  if (url === '/api/recommendations') return Promise.resolve(getRecommendations())
  throw new Error(`Unexpected fetch request: ${url}`)
})

vi.stubGlobal('$fetch', mockFetch)

describe('Recommendations component', () => {
  const testCases = [
    {
      title: 'should render correctly with default props',
      props: {
        blockTitle: 'Recommended for you',
        listName: 'recommendations',
        quantity: 5,
        scrollable: true,
        columns: 3,
        showCarousel: true,
        showCart: true,
        showPrices: true
      }
    }
  ]

  testCases.forEach(({ title, props }) => {
    it(title, async () => {
      const component = await mountSuspended(Recommendations, {
        props: {
          ...props
        }
      })

      expect(component).toBeDefined()
      
      const titleEl = component.find('h2')
      expect(titleEl.exists()).toBe(true)
      expect(titleEl.text()).toBe(props.blockTitle)
      // console.log(component.html())
    })
  })
})
